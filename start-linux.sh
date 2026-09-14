#!/usr/bin/env bash

# 🌸 Cece Yori Glow Tracker - Linux Start Launcher
echo "========================================================"
echo "  🌸 GLOW ✦ SKINCARE COMPANION (LINUX LAUNCHER)"
echo "========================================================"
echo ""

cd "$(dirname "$0")"
export PATH="$HOME/.cargo/bin:$HOME/.local/bin:/usr/local/bin:$PATH"

# Periksa apakah binary rilis Tauri sudah pernah dibuild
BUNDLE_BIN="src-tauri/target/release/glow"

if [ -f "$BUNDLE_BIN" ]; then
    echo "🚀 Menjalankan Glow Desktop Native Release..."
    exec "$BUNDLE_BIN" "$@"
fi

# Periksa apakah Cargo & Rust terpasang untuk menjalankan tauri dev
if command -v cargo &> /dev/null; then
    echo "🚀 Menjalankan Glow dalam mode Tauri Desktop..."
    npm run tauri:dev
else
    echo "ℹ️  Rust toolchain belum terpasang untuk desktop native runner."
    echo "🌐 Membuka Glow dalam mode Web Application..."
    echo ""
    echo "💡 Tips: Pasang Rust (curl -sSf https://sh.rustup.rs | sh) untuk menjalankan jendela desktop native."
    echo ""
    npm run preview -- --open
fi
