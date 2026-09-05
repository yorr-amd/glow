use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};

#[cfg(target_os = "windows")]
fn migrate_legacy_data() {
    if let Some(local_app_data) = std::env::var_os("LOCALAPPDATA") {
        let base_path = std::path::PathBuf::from(local_app_data);
        let old_dir = base_path
            .join("com.ceceyori.glow")
            .join("EBWebView")
            .join("Default")
            .join("Local Storage")
            .join("leveldb");
        let new_dir = base_path
            .join("com.glow.tracker")
            .join("EBWebView")
            .join("Default")
            .join("Local Storage")
            .join("leveldb");
        let marker = base_path.join("com.glow.tracker").join(".migrated_legacy_data");

        if old_dir.exists() && !marker.exists() {
            let _ = std::fs::create_dir_all(&new_dir);
            if let Ok(entries) = std::fs::read_dir(&old_dir) {
                for entry in entries.flatten() {
                    let target = new_dir.join(entry.file_name());
                    let _ = std::fs::copy(entry.path(), target);
                }
            }
            let _ = std::fs::File::create(&marker);
        }
    }
}

#[tauri::command]
async fn run_in_app_update(app: tauri::AppHandle, url: String) -> Result<String, String> {
    let temp_dir = std::env::temp_dir();
    let setup_path = temp_dir.join("Glow_Update_Setup.exe");
    let setup_str = setup_path.to_str().ok_or("Invalid temp path")?;

    // Download via curl.exe (built-in on Windows 10 & 11)
    let mut downloaded = false;
    if let Ok(status) = std::process::Command::new("curl.exe")
        .args(["-L", "-s", "-S", "-o", setup_str, &url])
        .status()
    {
        if status.success() && setup_path.exists() && setup_path.metadata().map(|m| m.len() > 100_000).unwrap_or(false) {
            downloaded = true;
        }
    }

    // Fallback: PowerShell WebClient
    if !downloaded {
        let ps_cmd = format!(
            "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('{}', '{}')",
            url, setup_str
        );
        let status = std::process::Command::new("powershell")
            .args(["-NoProfile", "-Command", &ps_cmd])
            .status()
            .map_err(|e| format!("Gagal mengunduh installer: {}", e))?;

        if !status.success() {
            return Err("Pengunduhan installer gagal".to_string());
        }
    }

    #[cfg(target_os = "windows")]
    {
        std::process::Command::new(&setup_path)
            .spawn()
            .map_err(|e| format!("Gagal menjalankan installer: {}", e))?;

        let app_clone = app.clone();
        std::thread::spawn(move || {
            std::thread::sleep(std::time::Duration::from_millis(600));
            app_clone.exit(0);
        });
    }

    Ok("Pembaruan berhasil diunduh dan sedang dipasang!".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(target_os = "windows")]
    migrate_legacy_data();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(w) = app.get_webview_window("main") {
                let _ = w.show();
                let _ = w.unminimize();
                let _ = w.set_focus();
            }
        }))
        .invoke_handler(tauri::generate_handler![run_in_app_update])
        .setup(|app| {
            // Setup System Tray Icon & Menu
            let show_i = MenuItem::with_id(app, "show", "Buka Glow Tracker 🌸", true, None::<&str>)?;
            let hide_i = MenuItem::with_id(app, "hide", "Sembunyikan", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Keluar", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &hide_i, &quit_i])?;

            if let Some(icon) = app.default_window_icon() {
                let _tray = TrayIconBuilder::new()
                    .icon(icon.clone())
                    .tooltip("Glow ✦ Skincare Companion")
                    .menu(&menu)
                    .show_menu_on_left_click(false)
                    .on_menu_event(|app, event| match event.id.as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                            }
                        }
                        "hide" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.hide();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    })
                    .on_tray_icon_event(|tray, event| {
                        if let TrayIconEvent::Click {
                            button: MouseButton::Left,
                            button_state: MouseButtonState::Up,
                            ..
                        } = event
                        {
                            let app = tray.app_handle();
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                            }
                        }
                    })
                    .build(app)?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
