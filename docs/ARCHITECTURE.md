# 🏛️ Arsitektur & Desain Sistem — Cece Yori Glow Tracker

Dokumen ini menjelaskan arsitektur teknis, aliran data, dan prinsip desain aplikasi **Cece Yori Glow Tracker**.

---

## 1. Arsitektur Tingkat Tinggi

Aplikasi ini menggunakan model **Tauri 2 Standalone Architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    DESKTOP ENVIRONMENT                      │
├─────────────────────────────────────────────────────────────┤
│   [ Tauri 2 Native Wrapper (Rust) ]                         │
│   ├── Window Management (Frameless / Custom TitleBar)       │
│   ├── OS Integration (Capabilities & Permissions)           │
│   └── Embedded Production Bundle (dist/ inside glow.exe)    │
├─────────────────────────────────────────────────────────────┤
│   [ WebView2 Web Runtime ]                                  │
│   ├── React 18 UI Components                                │
│   ├── Tailwind CSS Glassmorphic Styling                     │
│   ├── LocalStorage Persistence Engine                       │
│   └── Real-time Interval Time Synchronizer                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Alur Data & State Management

Data aplikasi disimpan secara terstruktur di `localStorage` per peramban WebView2:

| Storage Key | Tipe Data | Deskripsi |
|---|---|---|
| `ceceyori_checked_items` | `Array<string>` | Daftar ID produk yang sudah dicentang hari ini |
| `ceceyori_last_date` | `string (YYYY-MM-DD)` | Tanggal terakhir untuk trigger Midnight Reset |
| `ceceyori_streak_history` | `Array<string>` | Tanggal-tanggal di mana user aktif skincare |
| `ceceyori_custom_products` | `Object` | Produk yang ditambah atau dimodifikasi oleh user |
| `ceceyori_deleted_products`| `Object` | Daftar ID produk bawaan yang telah dihapus user |
| `ceceyori_daily_history` | `Object` | Riwayat lengkap per tanggal (items, mood, notes) |
| `ceceyori_quick_mode` | `'full' \| 'quick'` | Mode tampilan checklist saat ini |

---

## 3. Logika Inti Aplikasi

### A. Real-Time Auto-Switching (`getAutoMode`)
App mengevaluasi jam lokal setiap menit via `setInterval(syncMode, 60000)`:
- `05:00 <= hour < 11:00` → `pagi`
- `11:00 <= hour < 15:00` → `siang`
- `15:00 <= hour < 19:00` → `sore`
- `19:00 <= hour < 05:00` → `malam`

Jika user memilih mode secara manual, flag `manualMode = true` diaktifkan dan akan dipertahankan hingga jam berpindah ke periode berikutnya.

### B. Smart Locked Toner Schedule
Fungsi `isExfoliatingDay()` memeriksa `new Date().getDay()`:
- Hari Minggu (0), Senin (1), Selasa (2), Kamis (4), Jumat (5) → `false` (Tombol switch dinonaktifkan dan terkunci 🔒).
- Hari Rabu (3) & Sabtu (6) → `true` (Toner dapat diaktifkan dan muncul di checklist).

### C. Strict Consecutive Streak
Perhitungan streak dilakukan mundur dari hari paling baru:
- Jika aktivitas terakhir bukan hari ini dan bukan kemarin, streak langsung menjadi `0` dan icon api berubah `grayscale`.
- Setiap hari harus berurutan tanpa ada jeda/gap 1 hari pun.

---

## 4. Standar UI Glassmorphism

Aplikasi mematuhi token `src/design-system/`:
- **Card**: `bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm`
- **Primary Text**: `#3D1F2A` (Deep plum)
- **Primary Accent**: `#D06885` / `#9B4B62` (Blush pink)
- **Canvas Base**: `#FDF5F7`
