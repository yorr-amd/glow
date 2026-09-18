#!/usr/bin/env bash
set -e

# 🌸 Cece Yori Glow Tracker - Android APK Build Script (Linux)
echo "========================================================"
echo "  🌸 GLOW TRACKER - BUILD ANDROID APK (LINUX)"
echo "========================================================"
echo ""

# 1. Periksa Java JDK (Prioritaskan Java 21 / 17 LTS)
for jvm in /usr/lib/jvm/java-21-openjdk /usr/lib/jvm/java-17-openjdk /usr/lib/jvm/temurin-21 /usr/lib/jvm/temurin-17 "$HOME/.jdks/temurin-21" "$HOME/.jdks/temurin-17"; do
    if [ -d "$jvm" ] && [ -x "$jvm/bin/java" ]; then
        export JAVA_HOME="$jvm"
        export PATH="$JAVA_HOME/bin:$PATH"
        break
    fi
done

echo "[1/3] Memeriksa Java..."
if ! command -v java &> /dev/null; then
    echo "❌ Java belum terpasang di sistem!"
    echo "Silakan pasang OpenJDK 21 terlebih dahulu: sudo dnf install -y java-21-openjdk-devel"
    exit 1
fi

JAVA_RAW=$(java -version 2>&1 | head -n 1)
JAVA_MAJOR=$(echo "$JAVA_RAW" | sed -E 's/.*version "([0-9]+).*/\1/')
echo "✅ $JAVA_RAW ditemukan."

if [ -n "$JAVA_MAJOR" ] && [ "$JAVA_MAJOR" -gt 21 ] 2>/dev/null; then
    echo ""
    echo "⚠️  PERINGATAN: Sistem saat ini memakai Java $JAVA_MAJOR."
    echo "    Android Gradle Plugin & Groovy belum mendukung Java 22+ (hanya mendukung Java 17 atau 21 LTS)."
    echo "👉 Silakan pasang Java 21 di Fedora dengan perintah:"
    echo "   sudo dnf install -y java-21-openjdk-devel"
    echo "   sudo alternatives --config java  (pilih java-21-openjdk)"
    echo ""
fi
echo ""


# 2. Build Web Assets & Sync ke Android
echo "[2/3] Mempersiapkan aset Glow terbaru..."
npm run build
npx cap sync android
echo ""

# 3. Jalankan Gradle untuk APK
echo "[3/3] Merakit file APK Android..."
cd android
chmod +x gradlew

if [ -f "keystore.properties" ]; then
    echo "ℹ️  Mendeteksi keystore.properties - Merakit Signed Release APK..."
    ./gradlew assembleRelease
    if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
        cd ..
        cp android/app/build/outputs/apk/release/app-release.apk Glow-App.apk
        echo ""
        echo "========================================================"
        echo "  🎉 BERHASIL! File APK Release (Signed) sudah jadi!"
        echo "========================================================"
        echo "File APK tersimpan di: $(pwd)/Glow-App.apk"
        exit 0
    fi
fi

echo "ℹ️  Merakit Debug APK (keystore.properties belum dikonfigurasi)..."
./gradlew assembleDebug

if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    cd ..
    cp android/app/build/outputs/apk/debug/app-debug.apk Glow-App.apk
    echo ""
    echo "========================================================"
    echo "  🎉 BERHASIL! File APK Debug kamu sudah jadi!"
    echo "========================================================"
    echo "  [Catatan]: Untuk update tanpa uninstall di HP pengguna,"
    echo "            buat keystore permanen & aktifkan keystore.properties"
    echo "            (Lihat petunjuk di: android/keystore.properties.example)"
    echo "========================================================"
    echo "File APK tersimpan di: $(pwd)/Glow-App.apk"
else
    echo "❌ Gagal merakit APK. Periksa log Gradle di atas."
    exit 1
fi
