use crate::ReqwestClient;

macro_rules! send_channel_if_some {
    ($send:expr, $payload:expr) => {
        if let Some(sender) = $send {
            sender
                .send($payload)
                .map_err(|err| format!("Failed to send to channel! {err}"))
        } else {
            Ok(())
        }
    };
}

macro_rules! send_channel {
    ($send:expr, $payload:expr) => {
        $send
            .send($payload.into())
            .map_err(|err| format!("Failed to send to channel! {err}"))
    };
}

/// Downloads file, and call progress callback if there's one
async fn download_file<'a>(
    client: &'a reqwest::Client,
    url: &'a str,
    filename: Option<&'a str>,
    prog_range: Option<std::ops::Range<f32>>,
    prog_sender: Option<crossbeam_channel::Sender<Option<f32>>>,
    log_sender: Option<crossbeam_channel::Sender<String>>,
) -> Result<std::path::PathBuf, String> {
    use std::fs::File;
    use std::io::Write;

    use futures_util::StreamExt;
    use tauri::api::path::cache_dir;

    let get_mapped_range = |val| match prog_range.clone() {
        Some(range) => range.start + (val - 0.0) * (range.end - range.start) / (1.0 - 0.0),
        None => val,
    };

    send_channel_if_some!(&prog_sender, None)?;
    send_channel_if_some!(&log_sender, format!("Fetching..."))?;

    let res = client
        .get(url)
        .send()
        .await
        .or(Err(format!("Failed to GET from '{url}'")))?;

    let total_size = res.content_length();

    let get_filename_from_url = || {
        url.split('/')
            .last()
            .ok_or_else(|| "Failed to get file name directly from URL".to_string())
    };

    fn get_filename_from_content_disposition(str: &str) -> Result<&str, String> {
        let mut dispositions = str.split(';');
        let filename_disposition = dispositions
            .find(|&s| s.contains("filename="))
            .ok_or("Failed to get filename disposition")?;

        let filename = &filename_disposition[10..filename_disposition.len()];

        Ok(filename)
    }

    let response_headers = res.headers().clone();
    let get_filename_from_response_headers = || match response_headers
        .get(reqwest::header::CONTENT_DISPOSITION)
        .and_then(|disp| disp.to_str().ok())
        .map(Into::into)
    {
        Some(disp) => get_filename_from_content_disposition(disp),
        None => get_filename_from_url(),
    };

    let filename = match filename {
        Some(name) => Ok(name),
        None => get_filename_from_response_headers(),
    }?;

    send_channel_if_some!(&prog_sender, Some(0.0))?;
    send_channel_if_some!(&log_sender, format!("Done fetching {filename}!"))?;

    send_channel_if_some!(&log_sender, format!("Allocating for {filename}..."))?;

    let cache_path = cache_dir()
        .ok_or("Failed to get cache path")?
        .join("autalon-cache-dir");
    std::fs::create_dir_all(&cache_path)
        .map_err(|err| format!("Failed to create cache folder. {err}"))?;
    let file_path = cache_path.join(filename);

    // TODO: Check if filename already exists
    if file_path.exists() {
        send_channel_if_some!(&prog_sender, Some(get_mapped_range(1.0)))?;
        send_channel_if_some!(
            &log_sender,
            format!("File already downloaded for {filename}")
        )?;

        return Ok(file_path);
    }

    let mut file = File::create(&file_path).or(Err(format!(
        "Failed to create file on '{}'",
        file_path.display()
    )))?;
    let mut downloaded: u64 = 0;
    let mut stream = res.bytes_stream();

    send_channel_if_some!(&log_sender, format!("Downloading for {filename}..."))?;

    while let Some(item) = stream.next().await {
        let chunk = item.or(Err("Error while downloading file".to_string()))?;
        file.write_all(&chunk)
            .or(Err("Error while writing to file".to_string()))?;
        // TODO: If total_size is None, do something
        match total_size {
            Some(total) => {
                downloaded += chunk.len() as u64;
                let progress: f32 = downloaded as f32 / total as f32;
                send_channel_if_some!(&prog_sender, Some(get_mapped_range(progress)))?;
            }
            None => {
                send_channel_if_some!(&prog_sender, None)?;
            }
        }

        // TODO: Add progress
    }

    Ok(file_path)
}

/// Exports a script to a katalon project folder
///
/// Have to make the frontend to supply the required file url
/// instead of fetching it from Rust directly.
/// Cause `octocrab` framework dependency, `hyperx`,
/// clashes with `Tauri`. Which was `percent_encoding`.
///
/// # Arguments
/// * `src` - Source code to export
/// * `driver_url` - Link to the driver file
/// * `template_url` - Link to the template file
#[tauri::command]
pub async fn export_to_katalon_project(
    src: &str,
    client_state: tauri::State<'_, ReqwestClient>,
    window: tauri::Window,
) -> Result<(), String> {
    use std::io::{Read, Write};

    use crossbeam_channel::unbounded;

    // Ask the user where to save the final export to
    let curr_time = chrono::Local::now().format("%Y%m%d-%H%M%S");
    let reccommended_filename = format!("{curr_time}.zip");
    let Some(save_path) = tauri::api::dialog::blocking::FileDialogBuilder::new().set_file_name(&reccommended_filename).save_file() else {
        return Err("User cancelled the operation".to_string());
    };

    let client = &client_state.0;

    let (log_tx, log_rx) = unbounded::<String>();
    let (prog_tx, prog_rx) = unbounded::<Option<f32>>();

    let (window_clone1, window_clone2) = (window.clone(), window.clone());
    tauri::async_runtime::spawn(async move {
        for a in log_rx {
            window_clone1.emit("exporter::log", a)?;
        }

        // Have to specify Ok() for me to use error propagation op
        Ok::<(), tauri::Error>(())
    });
    tauri::async_runtime::spawn(async move {
        for a in prog_rx {
            window_clone2.emit("exporter::progress", a)?;
        }

        // Have to specify Ok() for me to use error propagation op
        Ok::<(), tauri::Error>(())
    });

    send_channel!(log_tx, "Getting latest driver releases...")?;

    // Get latest driver and template first
    let driver_url = crate::github_tools::get_repository_latest_release(
        client,
        "RoganMatrivski",
        "AutalonDriver-Java",
        ".jar",
    )
    .await?;

    send_channel!(log_tx, "Getting latest template project...")?;
    let template_url = crate::github_tools::get_repository_tarball(
        client,
        "RoganMatrivski",
        "Katalon-Studio-Project-Template",
        "master",
    )
    .await?;

    let driver_filepath = download_file(
        client,
        &driver_url,
        None,
        Some(0.0..95.0),
        Some(prog_tx.clone()),
        Some(log_tx.clone()),
    )
    .await?;

    let template_filepath = download_file(
        client,
        &template_url,
        None,
        Some(95.0..100.0),
        Some(prog_tx.clone()),
        Some(log_tx.clone()),
    )
    .await?;

    send_channel!(log_tx, "Extracting template file...")?;

    let inflated_template_path = {
        use flate2::read::GzDecoder;
        use std::fs::File;
        use tar::Archive;

        let template_filename_stems = template_filepath
            .file_name()
            .ok_or("Failed to get template file name")?
            .to_str()
            .unwrap()
            .split('.');
        let template_filename = template_filename_stems
            .clone()
            .take(template_filename_stems.count() - 2)
            .collect::<Vec<&str>>()
            .join("");
        // let template_filename = template_filepath
        //     .file_prefix()
        //     .ok_or("Failed to get template file name")?;
        let inflate_path = std::env::temp_dir().join(template_filename);

        let template_file = File::open(template_filepath)
            .map_err(|err| format!("Failed to open template file. {err}"))?;
        let decompressed = GzDecoder::new(template_file);
        let mut archive = Archive::new(decompressed);
        archive
            .unpack(&inflate_path)
            .map_err(|err| format!("Failed to inflate template file. {err}"))?;

        let subfolder_path = std::fs::read_dir(&inflate_path)
            .map_err(|err| format!("Failed to read inflated folder path. {err}"))?
            .flatten()
            .find(|d| d.path().is_dir())
            .ok_or("Failed to get first folder from inflated folder")?
            .path();

        Ok::<std::path::PathBuf, String>(subfolder_path)
    }?;

    let testcase_name = "NewTestCase1";
    let testcase_uuid = uuid::Uuid::new_v4().as_hyphenated().to_string();

    send_channel!(log_tx, "Creating new folder for generated files")?;

    let driver_folder_path = inflated_template_path.join("Drivers");
    let testcase_folder_path = inflated_template_path.join("Test Cases");
    let script_folder_path = inflated_template_path.join(format!("Scripts/{testcase_name}"));

    std::fs::create_dir_all(&driver_folder_path)
        .map_err(|err| format!("Failed to create driver folder. {err}"))?;
    std::fs::create_dir_all(&testcase_folder_path)
        .map_err(|err| format!("Failed to create testcase folder. {err}"))?;
    std::fs::create_dir_all(&script_folder_path)
        .map_err(|err| format!("Failed to create script folder. {err}"))?;

    let testcase_content = include_str!("./static/testcase_template.tc");
    let testcase_content = testcase_content.replace("{{TESTCASE_NAME}}", testcase_name);
    let testcase_content = testcase_content.replace("{{TESTCASE_UUID}}", &testcase_uuid);

    send_channel!(log_tx, "Moving driver to template file")?;

    std::fs::copy(
        &driver_filepath,
        driver_folder_path.join(
            driver_filepath
                .file_name()
                .ok_or_else(|| "Failed to get existing driver filename".to_string())?,
        ),
    )
    .map_err(|err| format!("Failed to copy driver file to project directory. {err}"))?;

    send_channel!(log_tx, "Inserting generated file")?;

    {
        let mut file =
            std::fs::File::create(testcase_folder_path.join(testcase_name.to_owned() + ".tc"))
                .map_err(|err| format!("Failed to open testcase file. {err}"))?;
        file.write_all(testcase_content.as_bytes())
            .map_err(|err| format!("Failed to write to testcase file. {err}"))?;
    }

    {
        let mut file = std::fs::File::create(script_folder_path.join("script.groovy"))
            .map_err(|err| format!("Failed to open script file. {err}"))?;
        file.write_all(src.as_bytes())
            .map_err(|err| format!("Failed to write to script file. {err}"))?;
    }

    send_channel!(log_tx, "Zipping all the files")?;

    {
        let file = std::fs::File::create(save_path)
            .map_err(|err| format!("Failed to create zip file. {err}"))?;
        let mut zip = zip::ZipWriter::new(file);
        let zip_options =
            zip::write::FileOptions::default().compression_method(zip::CompressionMethod::Stored);

        let mut buffer = Vec::new();
        for entry in walkdir::WalkDir::new(&inflated_template_path) {
            let entry =
                entry.map_err(|err| format!("Failed to walk through zip directory. {err}"))?;

            let read_path = entry.path();
            let path = read_path
                .strip_prefix(&inflated_template_path)
                .map_err(|err| format!("Failed to strip path for zip. {err}"))?;

            if read_path.is_file() {
                dbg!("Adding file", read_path, path);
                zip.start_file(path.to_string_lossy(), zip_options)
                    // zip.start_file_from_path(path, zip_options)
                    .map_err(|err| format!("Failed to zip a file. {err}"))?;
                let mut f = std::fs::File::open(read_path)
                    .map_err(|err| format!("Failed to open file to be zipped. {err}"))?;
                f.read_to_end(&mut buffer)
                    .map_err(|err| format!("Failed to read file to be zipped. {err}"))?;
                zip.write_all(&buffer)
                    .map_err(|err| format!("Failed to read file to buffer. {err}"))?;
                buffer.clear();
            } else if !path.as_os_str().is_empty() {
                dbg!("Adding dir", read_path, path);
                zip.add_directory(path.to_string_lossy(), zip_options)
                    // zip.add_directory_from_path(path, zip_options)
                    .map_err(|err| format!("Failed to add directory to zip. {err}"))?;
            }
        }

        zip.finish()
            .map_err(|err| format!("Failed to finish zip write. {err}"))?;

        send_channel!(log_tx, "Finished!")?;

        // std::fs::remove_dir_all(
        //     inflated_template_path
        //         .parent()
        //         .ok_or("Failed to get inflated directory parent")?,
        // )
        // .map_err(|_| "Failed to remove temporary directory")?;
    }

    Ok(())
}
