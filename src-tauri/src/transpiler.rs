#[tauri::command]
pub async fn get_fn_metadata() -> Result<String, String> {
    autalon_transpiler::get_fn_metadata()
        .map_err(|err| format!("Failed to get function metadata. {err}"))
}

#[tauri::command]
pub async fn transpile_groovy(src: &str) -> Result<String, String> {
    autalon_transpiler::transpile_groovy(src)
        .map_err(|err| format!("Failed to transpile groovy. {err}"))
}
