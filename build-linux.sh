#!/usr/bin/env bash
set -e

# 🌸 Cece Yori Glow Tracker - Linux Build Script
echo "========================================================"
echo "  🌸 GLOW TRACKER - BUILD DESKTOP APP UNTUK LINUX"
echo "========================================================"
echo ""

# Tambahkan path lokal untuk node & cargo jika ada
export PATH="$HOME/.cargo/bin:$HOME/.local/bin:/usr/local/bin:$PATH"

# 1. Periksa Node.js & npm
echo "[1/4] Memeriksa Node.js & npm..."
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "❌ Node.js atau npm belum terdeteksi di PATH!"
    exit 1
fi
echo "✅ Node.js $(node -v) & npm $(npm -v) ditemukan."
echo ""

# 2. Periksa Rust Toolchain
echo "[2/4] Memeriksa Rust & Cargo..."
if ! command -v cargo &> /dev/null || ! command -v rustc &> /dev/null; then
    echo "⚠️  Rust / Cargo belum terpasang di sistem!"
    echo "👉 Anda dapat memasangnya dengan mudah tanpa sudo:"
    echo "   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y"
    echo "   source \"\$HOME/.cargo/env\""
    echo ""
    echo "Silakan pasang Rust terlebih dahulu, lalu jalankan kembali script ini."
    exit 1
fi
echo "✅ Rustc $(rustc --version) & Cargo $(cargo --version) ditemukan."
echo ""

# 3. Periksa Pustaka Development Linux (Fedora / Debian / Ubuntu)
echo "[3/4] Memeriksa dependensi sistem Linux..."
MISSING_DEPS=0

if command -v dnf &> /dev/null; then
    # Fedora / RHEL
    echo "ℹ️  Mendeteksi sistem Fedora / RHEL (dnf)."
    for pkg in gcc gcc-c++ webkit2gtk4.1-devel gtk3-devel openssl-devel libayatana-appindicator-gtk3-devel librsvg2-devel; do
        if ! rpm -q "$pkg" &> /dev/null; then
            echo "   - Pustaka belum terpasang: $pkg"
            MISSING_DEPS=1
        fi
    done
    if [ "$MISSING_DEPS" -eq 1 ]; then
        echo ""
        echo "⚠️  Beberapa pustaka sistem diperlukan untuk kompilasi Tauri di Fedora."
        echo "👉 Silakan pasang dengan menjalankan perintah berikut di terminal:"
        echo "   sudo dnf install -y gcc gcc-c++ webkit2gtk4.1-devel gtk3-devel openssl-devel libayatana-appindicator-gtk3-devel librsvg2-devel"
        echo ""
        read -p "Lanjutkan kompilasi jika Anda yakin sudah terpasang? (y/N) " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            exit 1
        fi
    fi
elif command -v apt-get &> /dev/null; then
    # Debian / Ubuntu
    echo "ℹ️  Mendeteksi sistem Debian / Ubuntu (apt)."
    echo "👉 Pastikan dependensi terpasang:"
    echo "   sudo apt-get install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev"
fi
echo ""

# 4. Build Frontend & Tauri App
echo "[4/4] Membangun aset web & mengompilasi paket Linux..."
npm run build
npm run tauri:build

echo ""
echo "========================================================"
echo "  🎉 BERHASIL! Paket aplikasi Linux sudah siap:"
echo "========================================================"
echo "File hasil build tersedia di folder:"
echo "  $(pwd)/src-tauri/target/release/bundle/"
echo ""
find src-tauri/target/release/bundle/ -maxdepth 3 -type f \( -name "*.AppImage" -o -name "*.deb" -o -name "*.rpm" \) 2>/dev/null || true
echo ""
