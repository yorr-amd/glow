# Stop glow if running
Stop-Process -Name "glow" -Force -ErrorAction SilentlyContinue

Write-Host "--- 1. Cleaning WebView2 App Caches ---"
$cachePaths = @(
    "C:\Users\hp\AppData\Local\com.ceceyori.glow\EBWebView\Default\Cache",
    "C:\Users\hp\AppData\Local\com.ceceyori.glow\EBWebView\Default\Code Cache",
    "C:\Users\hp\AppData\Local\com.ceceyori.glow\EBWebView\Default\GPUCache",
    "C:\Users\hp\AppData\Local\com.ceceyori.glow\EBWebView\Default\Service Worker"
)
foreach ($path in $cachePaths) {
    if (Test-Path $path) {
        Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "--- 2. Cleaning Heavy Debug Build Caches in src-tauri (~6.6 GB) ---"
if (Test-Path "C:\PROJECT\glow\src-tauri\target\debug") {
    Remove-Item -Path "C:\PROJECT\glow\src-tauri\target\debug" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "--- 3. Cleaning Intermediate Release Build Artifacts (~2 GB) ---"
$releaseIntermediates = @(
    "C:\PROJECT\glow\src-tauri\target\release\build",
    "C:\PROJECT\glow\src-tauri\target\release\deps",
    "C:\PROJECT\glow\src-tauri\target\release\incremental"
)
foreach ($p in $releaseIntermediates) {
    if (Test-Path $p) {
        Remove-Item -Path $p -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "--- 4. Cleaning Cargo & NPM Caches (~1.5 GB) ---"
if (Test-Path "C:\Users\hp\AppData\Local\npm-cache") {
    Remove-Item -Path "C:\Users\hp\AppData\Local\npm-cache" -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path "C:\Users\hp\.cargo\registry\cache") {
    Remove-Item -Path "C:\Users\hp\.cargo\registry\cache" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "--- 5. Cleaning Windows Temp Files ---"
Get-ChildItem "C:\Users\hp\AppData\Local\Temp\*" -Force -Recurse -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "--- 6. Re-linking Desktop Shortcut ---"
$ws = New-Object -ComObject WScript.Shell
$desktopLnk = "C:\Users\hp\OneDrive\Desktop\Glow.lnk"
$oldLnk = "C:\Users\hp\OneDrive\Desktop\Cece Yori Glow Tracker.lnk"
if (Test-Path $oldLnk) { Remove-Item $oldLnk -Force -ErrorAction SilentlyContinue }
$targetExe = "C:\PROJECT\glow\src-tauri\target\release\glow.exe"

if (Test-Path $targetExe) {
    $sc = $ws.CreateShortcut($desktopLnk)
    $sc.TargetPath = $targetExe
    $sc.WorkingDirectory = "C:\PROJECT\glow\src-tauri\target\release"
    $sc.IconLocation = "C:\PROJECT\glow\src-tauri\icons\icon.ico"
    $sc.Description = "Glow ✦ Skincare Tracker (v1.0.1)"
    $sc.Save()
    Write-Host "Shortcut updated successfully: $desktopLnk"
} else {
    Write-Host "Warning: $targetExe not found"
}

Write-Host "--- 7. Drive Storage Summary ---"
Get-PSDrive C | Select-Object Name, @{Name="Used(GB)";Expression={[math]::round($_.Used/1GB,2)}}, @{Name="Free(GB)";Expression={[math]::round($_.Free/1GB,2)}}
