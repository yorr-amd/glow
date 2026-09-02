# 🌸 Cece Yori Glow Tracker - AI Design System & Agent Guidelines

Dokumen ini adalah panduan standar untuk **semua AI Assistant (Antigravity, Claude, ChatGPT, Gemini, Copilot)** saat mengembangkan, memperbarui, atau menambahkan fitur UI di proyek **Cece Yori Glow Tracker**.

---

## 🎨 1. Core Design Philosophy
* **Aesthetic**: Romantic, soft, feminine, pastel, modern clean glassmorphism.
* **Canvas Background**: `#FDF5F7` (soft blush pink).
* **Primary Text Color**: `#3D1F2A` (deep romantic plum).
* **Primary Accent Color**: `#D06885` / `#9B4B62` (blush pink to rose gold).

---

## 🏛️ 2. Structure of Design System
Semua token dan reusable UI components terpusat di `src/design-system/`:
```
src/design-system/
├── tokens/
│   ├── colors.js         # Master palette, 4-mode gradients & category colors
│   └── typography.js     # Fonts, heading sizes, and typography classes
├── components/
│   ├── Button.jsx        # Standard buttons (primary, secondary, ghost, danger)
│   ├── Card.jsx          # Glassmorphic card container presets
│   └── Badge.jsx         # Category and status badges
└── index.js              # Unified exports
```

---

## ☀️ 3. 4-Phase Time-Based Routine Themes
Setiap waktu memiliki gradien dan suasana atmosfer tersendiri:

| Waktu | Jam | Ikon | Gradient Header | Badge Style |
|---|---|---|---|---|
| **Pagi** | `05:00 - 10:59` | ☀️ | `from-[#F59E0B] via-[#F97316] to-[#E11D48]` | Amber (`bg-amber-100 text-amber-800`) |
| **Siang** | `11:00 - 14:59` | 🌤️ | `from-[#0284C7] via-[#0EA5E9] to-[#0D9488]` | Sky (`bg-sky-100 text-sky-800`) |
| **Sore** | `15:00 - 18:59` | 🌇 | `from-[#C97B8E] via-[#B86478] to-[#9B4B62]` | Rose (`bg-rose-100 text-rose-800`) |
| **Malam** | `19:00 - 04:59` | 🌙 | `from-[#7B6C8E] via-[#6A5480] to-[#4E3866]` + User Photo Overlay | Violet (`bg-violet-100 text-violet-800`) |

---

## 🪟 4. Glassmorphism & UI Tokens

### Container Cards:
Gunakan class glassmorphism standar:
```html
bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all
```

### Typography:
* **Brand / Judul Utama**: `font-display text-[#3D1F2A] font-bold` (Playfair Display serif).
* **Body / UI**: `text-slate-600 font-sans text-sm` (DM Sans).
* **Badge / Label Kecil**: `text-[10px] font-bold uppercase tracking-wider`.
* **Jam Digital**: `font-mono font-semibold tracking-widest`.

### Border Radius Hierarchy:
* Widget / Card / Form: `rounded-2xl` (16px) atau `rounded-3xl` (24px)
* Tombol / Input: `rounded-xl` (12px)
* Pill Tags / Window Controls: `rounded-full` (9999px)

---

## ⚠️ 5. Strict Product & Business Rules for AI
1. **Toner Merah (Sonik Scents)**:
   * Hanya aktif dan boleh dibuka di hari **Rabu & Sabtu malam**.
   * Di luar hari tersebut, toggle dan checklist toner wajib **terkunci (Disabled 🔒)**.
2. **Streak Counter**:
   * Menghitung hari berurutan. Jika ada **1 hari saja yang terlewat (skip)**, api otomatis menjadi abu-abu `grayscale` dan streak reset ke `0 Hari`.
3. **Product Shelf**:
   * User bisa menambah, mengedit, dan **menghapus semua produk** (baik bawaan maupun custom).
   * Selalu sediakan tombol **"Reset Bawaan"** untuk mengembalikan produk default.
4. **Standalone App (Tauri 2)**:
   * Jangan buat app bergantung pada server `localhost`. Semua file harus ter-bundle mandiri dalam `dist/`.
   * Hindari penumpukan cache debug rust `target/debug` untuk menghemat ruang disk user.

---

> 💡 **Instruksi untuk AI**: Saat diminta menambah widget, halaman, atau komponen baru, **SELALU** gunakan warna, font, dan komponen dari `src/design-system/` agar konsistensi visual aplikasi tetap terjaga 100%! 💖
