@echo off
title Push Glow Skincare Companion to GitHub
cls
echo ====================================================================
echo    🌸 Glow ✦ Skincare Companion - Upload to GitHub Repository
echo    Target: https://github.com/yorr-amd/glow
echo ====================================================================
echo.

cd /d "C:\PROJECT\glow"

echo [*] Memeriksa status git...
git remote -v
echo.

echo [*] Mengunggah (push) branch main ke GitHub...
git push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    echo ====================================================================
    echo    ✅ BERHASIL! Semua kode dan aset berhasil di-push ke GitHub! 🌸✨
    echo    Link Repo: https://github.com/yorr-amd/glow
    echo ====================================================================
) else (
    echo ====================================================================
    echo    ⚠️ Ada kendala otorisasi. Silakan pastikan sudah login ke GitHub.
    echo ====================================================================
)

echo.
pause
