@echo off
title 🌸 Glow - Build Android APK
color 0D
echo ========================================================
echo   🌸 GLOW - BUILD ANDROID APK LANGSUNG DI LAPTOP
echo ========================================================
echo.

:: 1. Atur Java JDK 21 (LTS)
set "JAVA_HOME=C:\Users\hp\.jdks\temurin-21"
if not exist "%JAVA_HOME%\bin\java.exe" set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [1/3] Memeriksa Java...
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo [X] Java tidak ditemukan di: %JAVA_HOME%
    echo Pastikan Android Studio sudah terpasang.
    pause
    exit /b 1
)
echo [OK] Java ditemukan!
echo.

:: 2. Build Web Assets & Sync ke Android
echo [2/3] Mempersiapkan aset Glow terbaru...
cd /d "%~dp0"
call npm run build
call npx cap sync android
echo.

:: 3. Jalankan Gradle untuk menghasilkan APK
echo [3/3] Sedang merakit file APK Android (mohon tunggu)...
cd /d "%~dp0android"
call gradlew.bat assembleDebug

if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo.
    echo ========================================================
    echo  🎉 BERHASIL! File APK kamu sudah jadi di laptop!
    echo ========================================================
    copy "app\build\outputs\apk\debug\app-debug.apk" "%~dp0Glow-App.apk" >nul
    echo File APK tersimpan di: %~dp0Glow-App.apk
    echo.
    echo Membuka folder file APK...
    explorer.exe /select,"%~dp0Glow-App.apk"
) else (
    echo.
    echo [INFO] Jika koneksi internet gradle pertama kali timeout,
    echo silakan buka Android Studio dan klik menu:
    echo "Build -> Build Bundle(s) / APK(s) -> Build APK(s)"
)

echo.
pause
