#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

fn main() {
    // Launch PyInstaller backend subprocess if binary exists adjacent to app
    let _ = Command::new("substack-mcp-backend.exe")
        .arg("--port")
        .arg("11163")
        .spawn();

    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
