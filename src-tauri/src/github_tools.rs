use serde::Deserialize;

#[derive(Deserialize)]
struct Release {
    assets: Vec<Asset>,
}

#[derive(Deserialize)]
struct Asset {
    browser_download_url: String,
}

const GITHUB_USER_AGENT: &str = "RoganMatrivski/Autalon-Generator";

pub async fn get_repository_latest_release(
    client: &reqwest::Client,
    owner: &str,
    repository: &str,
    filter: &str,
) -> Result<String, String> {
    let url = format!("https://api.github.com/repos/{owner}/{repository}/releases");

    let response = client
        .get(url)
        .header("User-Agent", GITHUB_USER_AGENT)
        .send()
        .await
        .map_err(|err| format!("Failed send releases request. {err}"))?;

    let response_text = response
        .text()
        .await
        .map_err(|err| format!("Failed to convert releases response to text. {err}"))?;

    let releases: Vec<Release> = serde_json::from_str(&response_text)
        .map_err(|err| format!("Failed to parse releases response. {err}"))?;

    let asset = releases
        .first()
        .ok_or("Failed to get latest release")?
        .assets
        .iter()
        .find(|asset| asset.browser_download_url.contains(filter))
        .ok_or(format!("Failed to find assets matching {filter}"))?;

    Ok(asset.browser_download_url.clone())
}

pub async fn get_repository_tarball(
    client: &reqwest::Client,
    owner: &str,
    repository: &str,
    reference: &str,
) -> Result<String, String> {
    let url = format!("https://api.github.com/repos/{owner}/{repository}/tarball/{reference}");

    let response = client
        .get(&url)
        .header("User-Agent", GITHUB_USER_AGENT)
        .send()
        .await
        .map_err(|err| format!("Failed send tarball link check. {err}"))?;

    if !response.status().is_success() {
        Err(format!(
            "Tarball link is not valid. Response: {}",
            response.status().as_str()
        ))
    } else {
        Ok(response.url().to_string())
    }
}
