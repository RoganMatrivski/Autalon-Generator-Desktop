#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod exporter;
mod github_tools;

pub struct ReqwestClient(reqwest::Client);

fn main() {
    let reqwest_client = reqwest::ClientBuilder::default()
        .redirect(reqwest::redirect::Policy::limited(60))
        .build()
        .expect("Failed to build reqwest client");

    tauri::Builder::default()
        .manage(ReqwestClient(reqwest_client))
        .invoke_handler(tauri::generate_handler![
            exporter::export_to_katalon_project
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
