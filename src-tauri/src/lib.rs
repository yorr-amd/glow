use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, WebviewUrl, WebviewWindowBuilder,
};


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

fn show_or_create_main_window<R: tauri::Runtime>(app: &tauri::AppHandle<R>) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    } else {
        let _ = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
            .title("Glow ✦ Skincare Companion")
            .inner_size(1366.0, 860.0)
            .min_inner_size(1024.0, 700.0)
            .decorations(false)
            .build();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            show_or_create_main_window(app);
        }))
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let _ = window.hide();
                api.prevent_close();
            }
        })
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
                            show_or_create_main_window(app);
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
                            show_or_create_main_window(app);
                        }
                    })
                    .build(app)?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
