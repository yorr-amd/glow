# 🌸 Glow ✦ Personal Skincare Companion

<div align="center">

![Version](https://img.shields.io/badge/version-1.1.1-pink?style=for-the-badge&logo=tauri)
![Tauri](https://img.shields.io/badge/Tauri_2.0-Rust-orange?style=for-the-badge&logo=rust)
![React](https://img.shields.io/badge/React_18-Vite-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-3D_Graphics-black?style=for-the-badge&logo=three.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS_3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Android-blue?style=for-the-badge&logo=android)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

**A luxury, romantic glassmorphism skincare companion with real-time 3D celestial animations, procedural interactive serum physics, strict exfoliation safety locks, and full bilingual support (English & Indonesian).**

<br />

### 📥 Download Official Release (v1.1.1)
| Platform | Package | Download Link |
|---|---|---|
| 📱 **Android** | `Glow-v1.1.1.apk` | [⬇️ **Download Android APK (4.48 MB)**](https://github.com/yorr-amd/glow/releases/download/v1.1.1/Glow-v1.1.1.apk) |
| 🪟 **Windows Installer** | `Glow_1.1.1_x64-setup.exe` | [⬇️ **Download Setup (3.57 MB)**](https://github.com/yorr-amd/glow/releases/download/v1.1.1/Glow_1.1.1_x64-setup.exe) |
| 🪟 **Windows Portable** | `Glow-v1.1.1-portable.exe` | [⬇️ **Download Portable (14.2 MB)**](https://github.com/yorr-amd/glow/releases/download/v1.1.1/Glow-v1.1.1-portable.exe) |

<br />

[ 🇬🇧 English Documentation ](#-english-documentation) • [ 🇮🇩 Dokumentasi Bahasa Indonesia ](#-dokumentasi-bahasa-indonesia) • [ 🚀 Quick Start ](#-quick-start--installation)

---

</div>

<br />

# 🇬🇧 English Documentation

## 💖 Overview
**Glow** is a modern desktop skincare tracker crafted to guide and preserve daily skincare consistency. Built with an elegant **Romantic Glassmorphism** pastel aesthetic (*blush pink, soft rose, deep plum*) and powered by real-time interactive **Three.js 3D** graphics.

Glow accompanies users throughout the day across four dynamic time-based phases—from morning preparation to overnight replenishment.

---

## ✨ Key Features

### 1. ☀️ 4-Phase Real-time 3D Celestial Atmosphere
The hero visual and atmospheric sky dynamically transition based on real device local time:
* ☀️ **Morning (`05:00 - 10:59`)**: 3D golden radiant sun with 12 rotating solar burst rays and flare particles.
* 🌤️ **Afternoon (`11:00 - 14:59`)**: Bright midday sun accompanied by procedural 3D volumetric floating clouds.
* 🌇 **Evening (`15:00 - 18:59`)**: Rose-gold sunset dipping beneath the horizon with soft twilight gradient waves.
* 🌙 **Night (`19:00 - 04:59`)**: Glowing violet crescent moon surrounded by **120+ twinkling 3D stars** and periodic shooting stars.

---

### 2. 🧴 3D Interactive Skincare Serum Bottle
* Procedural 3D glass serum bottle with a luxury gold dropper cap that can be rotated 360° via mouse/touch drag.
* Real-time luminous serum liquid and effervescent micro-bubbles adjust dynamically to your completion rate (0% to 100%).

---

### 3. 🔒 Exfoliation Safety Lock (Red Toner - Sonik Scents)
* Designed to safeguard skin barrier integrity against over-exfoliation.
* The Red Toner checklist item **only unlocks on Wednesday and Saturday nights**. On all other days, the toggle remains strictly locked (Disabled 🔒).

---

### 4. 🔥 Strict Consecutive Streak Counter
* Tracks consecutive daily routine completion.
* A vivid glowing flame remains lit during unbroken consistency. If a day is missed, the flame turns grayscale and the streak resets to encourage fresh accountability.

---

### 5. 🌐 Full Bilingual Support (EN & ID)
* Instant in-app language switcher (`EN | ID`) directly accessible from the navigation bar.
* Complete localization covering routine titles, category badges, product guides, usage tips, and calendar modals.

---

### 6. 📅 Skincare Journal & 🧴 Product Shelf
* **30-Day Skincare Journal**: Consistency metrics, time-session badges, and personalized daily skin condition logs.
* **Product Shelf**: Virtual cosmetic shelf to add, edit, or customize products with PAO (*Period After Opening*) monitoring.

---

### 7. 🛡️ 100% Offline-First & Private
* Zero third-party tracking. All profiles, journals, and routine data are saved natively on your machine via local encrypted store.

---

### 8. 🔄 In-App Auto-Update (1-Tap Mobile Update)
* Automatic version detection via GitHub Releases API on app startup.
* 1-Tap background APK downloading via Android DownloadManager and instant package installation prompt without manual GitHub browsing.
* In-app toggle and manual "Check for Updates" button in Settings/Profile.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Glow UI (React 18)                       │
│  - Three.js 3D Celestial Canvas & Interactive Serum Bottle  │
│  - Tailwind CSS + Glassmorphic Design System Tokens         │
│  - Context-Driven Bilingual System (i18n: ID & EN)          │
│  - Lucide Icons & Dynamic Canvas Celebrations               │
└──────────────────────────────┬──────────────────────────────┘
                               │ IPC Bridge (Tauri Core)
┌──────────────────────────────▼──────────────────────────────┐
│             Tauri 2.0 Desktop Engine (Rust 2021)            │
│  - Single Instance Lock (@tauri-apps/plugin-single-instance)│
│  - Native Windows Notifications (@tauri-apps/notification)  │
│  - Native JSON Persistent Store (@tauri-apps/plugin-store)  │
│  - Frameless Custom Window Controls & Tray Menu             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18+)
* [Rust](https://www.rust-lang.org/) & Cargo
* Microsoft Visual Studio C++ Build Tools (Windows)

### 1. Clone the Repository
```bash
git clone https://github.com/yorr-amd/glow.git
cd glow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Mode
* **Web Browser Mode**:
  ```bash
  npm run dev
  ```
* **Native Desktop Tauri Mode**:
  ```bash
  npm run tauri:dev
  ```

### 4. Build Windows Executable (.exe)
```bash
npm run build
npx tauri build
```
The installer setup will be generated at:
`src-tauri/target/release/bundle/nsis/Glow_1.1.1_x64-setup.exe`

<br />

---

# 🇮🇩 Dokumentasi Bahasa Indonesia

## 💖 Tentang Aplikasi
**Glow** adalah aplikasi desktop modern yang dirancang khusus untuk memandu dan menjaga konsistensi perawatan kulit (*skincare routine*) harian. Dibangun dengan estetika **Romantic Glassmorphism** bernuansa pastel (*blush pink, soft rose, plum*) dan diperkuat dengan grafis interaktif **Three.js 3D**.

Glow mendampingi pengguna secara real-time sepanjang hari dari pagi hingga malam hari melalui empat fase waktu yang dinamis.

---

## ✨ Fitur Unggulan

### 1. ☀️ 4-Fase Atmosfer Langit 3D Real-time
Visual langit pada header berganti secara otomatis mengikuti jam lokal laptop kamu:
* ☀️ **Pagi (`05:00 - 10:59`)**: Matahari 3D emas bercahaya dengan 12 cincin sinar berputar (*solar rays*) dan percikan flare matahari.
* 🌤️ **Siang (`11:00 - 14:59`)**: Matahari siang cerah dengan awan 3D volumetrik prosedural yang melayang melintasi langit.
* 🌇 **Sore (`15:00 - 18:59`)**: Matahari terbenam (*sunset*) kemerahan yang turun ke cakrawala dengan gelombang sinar senja *rose-gold*.
* 🌙 **Malam (`19:00 - 04:59`)**: Bulan Sabit 3D bercahaya lembut (*violet moon*) dengan **120+ bintang 3D berkelap-kelip** dan komet/shooting star melintas berkala.

---

### 2. 🧴 Botol Serum Skincare 3D Interaktif
* Botol kaca serum 3D prosedural dengan tutup dropper emas mewah yang bisa diputar 360° secara bebas menggunakan mouse drag.
* Level cairan serum bercahaya di dalam botol dan gelembung mikro naik secara real-time mengikuti persentase centang rutinitas kamu (0% hingga 100%).

---

### 3. 🔒 Kunci Pengaman Eksfoliasi (Toner Merah - Sonik Scents)
* Menjaga kesehatan *skin barrier* agar terhindar dari iritasi dan *over-exfoliation*.
* Checklist dan toggle Toner Merah **hanya aktif dan dapat dibuka pada hari Rabu & Sabtu malam**. Di luar hari tersebut, fitur terkunci rapat (Disabled 🔒).

---

### 4. 🔥 Strict Consecutive Streak Counter
* Menghitung hari berurutan kamu merawat kulit.
* Efek api membara tetap menyala jika rutinitas dilakukan tanpa bolong. Jika terlewat 1 hari saja, api otomatis menjadi abu-abu (*grayscale*) dan streak ter-reset.

---

### 5. 🌐 Dukungan 2 Bahasa (Indonesia & Inggris)
* Tombol pengubah bahasa cepat (`ID | EN`) langsung tersedia di navbar atas.
* Seluruh deskripsi produk, tips pemakaian, dialog modal, dan navigasi diterjemahkan secara rapi.

---

### 6. 📅 Jurnal Riwayat & 🧴 Lemari Skincare (Product Shelf)
* **Riwayat Skincare 30 Hari**: Rekap persentase konsistensi, badge sesi waktu, dan form catatan kondisi kulit harian.
* **Product Shelf**: Rak rias kosmetik virtual untuk menambah, mengedit, menghapus, serta mengatur masa simpan PAO (*Period After Opening*) pada setiap produk skincare.

---

### 7. 🛡️ 100% Offline-First & Privasi Terjamin
* Semua data riwayat, catatan kulit, dan preferensi tersimpan secara privat di penyimpanan lokal native pengguna.

---

### 8. 🔄 Pembaruan Otomatis (1-Tap Auto Update)
* Deteksi versi baru secara otomatis melalui GitHub Releases API setiap aplikasi dibuka.
* Pengunduhan APK di latar belakang melalui Android DownloadManager dan peluncuran jendela pemasangan otomatis (*1-tap install*) tanpa repot membuka browser atau web GitHub.
* Toggle pengaturan auto-update dan tombol "Periksa Pembaruan Sekarang" di menu Profil/Pengaturan.

---

## 📜 Lisensi & Kontributor (License & Contributors)

Dibuat dengan dedikasi dan cinta oleh **YRR AMD / Yori Amanda & Tim**.  
*Hak Cipta © 2026 Glow. Distributed under the MIT License.*
