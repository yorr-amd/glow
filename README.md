# 🌸 Glow ✦ Personal Skincare Routine

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.1-pink?style=for-the-badge&logo=tauri)
![Tauri](https://img.shields.io/badge/Tauri_2.0-Rust-orange?style=for-the-badge&logo=rust)
![React](https://img.shields.io/badge/React_18-Vite-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-3D_Graphics-black?style=for-the-badge&logo=three.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS_3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Platform](https://img.shields.io/badge/Platform-Windows_x64-blue?style=for-the-badge&logo=windows)

**A luxury, romantic glassmorphism skincare companion with real-time 3D celestial animations, procedural interactive serum physics, and strict exfoliation safety rules.**

[✨ Download Latest Windows Installer](https://github.com/yorr-amd/glow/releases/latest) • [📖 Dokumentasi & Panduan](#-panduan-fitur) • [🏛️ Arsitektur](#-arsitektur--teknologi)

</div>

---

## 💖 Tentang Aplikasi (Overview)

**Glow** adalah aplikasi desktop modern yang dirancang khusus untuk memandu dan menjaga konsistensi perawatan kulit (*skincare routine*) harian. Dibangun dengan estetika **Romantic Glassmorphism** bernuansa pastel (*blush pink, soft rose, plum*) dan diperkuat dengan grafis interaktif **Three.js 3D**.

Aplikasi ini tidak hanya mencatat rutinitas, tetapi juga mendampingi pengguna secara real-time sepanjang hari dari pagi hingga malam hari.

---

## ✨ Fitur Unggulan (Key Features)

### 1. ☀️ 4-Phase Real-time 3D Celestial Atmosphere
Atmosfer hero banner dan visual langit di aplikasi secara otomatis berganti mengikuti jam nyata perangkat:
* ☀️ **Pagi (`05:00 - 10:59`)**: Matahari 3D bercahaya emas dengan 12 sinar cincin berputar (*solar rays*) dan percikan flare matahari.
* 🌤️ **Siang (`11:00 - 14:59`)**: Matahari siang cerah dengan awan 3D volumetrik yang melayang lembut melintasi langit biru.
* 🌇 **Sore (`15:00 - 18:59`)**: Matahari terbenam (*sunset*) kemerahan yang perlahan turun ke cakrawala dengan gelombang sinar senja *rose-gold*.
* 🌙 **Malam (`19:00 - 04:59`)**: Bulan Sabit 3D bercahaya lembut (*violet moon*) dengan **120+ bintang 3D berkelap-kelip** dan komet/shooting star melintas berkala.

---

### 2. 🧴 3D Interactive Skincare Serum Bottle
* Botol kaca serum 3D prosedural dengan tutup dropper emas mewah yang bisa diputar 360° secara bebas menggunakan mouse / touch drag.
* Level cairan serum bercahaya di dalam botol dan gelembung mikro naik secara real-time mengikuti persentase centang rutinitas kamu (0% hingga 100%).

---

### 3. 🔒 Exfoliation Safety Lock (Toner Merah - Sonik Scents)
* Fitur keamanan untuk menjaga kesehatan *skin barrier*.
* Checklist dan toggle Toner Merah **hanya aktif dan dapat dibuka pada hari Rabu & Sabtu malam**. Di luar hari tersebut, fitur terkunci rapat (Disabled 🔒) untuk mencegah *over-exfoliation*.

---

### 4. 🔥 Strict Consecutive Streak Counter
* Menghitung hari berurutan kamu merawat kulit.
* Efek api membara tetap menyala jika rutinitas dilakukan tanpa bolong. Jika terlewat 1 hari saja, api otomatis menjadi abu-abu (*grayscale*) dan streak ter-reset.

---

### 5. 👑 Profil Pengguna & Sistem Akun (`🌸 Cece`)
* Kustomisasi avatar emoji aesthetic (`🌸`, `✨`, `🍓`, `🎀`, `👸`, `💄`, `🦄`).
* Pengaturan tipe kulit (*Kombinasi, Kering, Berminyak, Normal, Acne-Prone*), target kulit (*Glass skin, Tekstur halus*), dan preferensi notifikasi desktop.

---

### 6. 📅 Jurnal Riwayat & 🧴 Lemari Skincare (Product Shelf)
* **Riwayat Skincare**: Kalender 30 hari dengan rekap persentase konsistensi, badge sesi waktu, dan form catatan kondisi kulit harian.
* **Product Shelf**: Rak rias kosmetik virtual untuk menambah, mengedit, menghapus, serta mengatur masa simpan PAO (*Period After Opening*) pada setiap produk skincare.

---

### 7. 🛡️ 100% Offline-First & Privasi Terjamin
* Semua data riwayat, catatan kulit, dan preferensi tersimpan secara privat di penyimpanan lokal native laptop pengguna (tanpa pelacakan eksternal).

---

## 🏛️ Arsitektur & Teknologi (Tech Stack)

```
┌─────────────────────────────────────────────────────────────┐
│             Cece Yori Glow Tracker UI (React 18)           │
│  - Three.js 3D Celestial Canvas & Interactive Serum Bottle  │
│  - Tailwind CSS + Glassmorphic Design System Tokens         │
│  - Lucide Icons & Canvas Confetti Celebrations              │
└──────────────────────────────┬──────────────────────────────┘
                               │ IPC Bridge (Tauri Core)
┌──────────────────────────────▼──────────────────────────────┐
│             Tauri 2.0 Desktop Engine (Rust 2021)            │
│  - Single Instance Lock (@tauri-apps/plugin-single-instance)│
│  - Native Windows Notifications (@tauri-apps/notification)  │
│  - Native JSON Persistent Store (@tauri-apps/plugin-store)  │
│  - Windows Vibrancy & Frameless Titlebar Control            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Cara Menjalankan & Mengembangkan (Quick Start)

### Prasyarat:
* [Node.js](https://nodejs.org/) (versi 18 ke atas)
* [Rust](https://www.rust-lang.org/) & Cargo (untuk kompilasi desktop Tauri)
* Microsoft Visual Studio C++ Build Tools (Windows)

### 1. Clone Repositori
```bash
git clone https://github.com/yorr-amd/glow.git
cd glow
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Jalankan Mode Pengembangan (Dev Mode)
* **Mode Web Preview**:
  ```bash
  npm run dev
  ```
* **Mode Native Desktop Tauri**:
  ```bash
  npx tauri dev
  ```

### 4. Build Installer Resmi Windows (.exe)
```bash
npm run build
npx tauri build
```
File installer installer setup wizard akan otomatis terbuat di:
`src-tauri/target/release/bundle/nsis/Cece Yori Glow Tracker_1.0.1_x64-setup.exe`

---

## 📜 Lisensi & Hak Cipta

Dibuat oleh **YRR AMD** bersama Tim.

*Hak Cipta © 2026 Glow. All Rights Reserved.*
