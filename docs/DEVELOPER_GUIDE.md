# 💻 Panduan Developer — Cece Yori Glow Tracker

Dokumen ini berisi panduan untuk developer yang ingin menjalankan, menguji, dan meng-compile aplikasi.

---

## 🛠️ Prasyarat
* **Node.js**: Versi 18+ (disarankan Node 20+)
* **Rust & Cargo**: Versi stable terbaru (`rustc --version`)
* **WebView2 Runtime**: Bawaan di Windows 10/11

---

## 🚀 Perintah Dasar

### 1. Menjalankan Mode Development
```bash
# Menjalankan frontend React di browser (port 5173)
npm run dev

# Menjalankan aplikasi desktop Tauri dengan hot-reload
npm run tauri:dev
```

### 2. Kompilasi Standalone Release Binary (`.exe`)
Untuk menghasilkan executable produksi tunggal yang mandiri (tanpa membutuhkan server localhost):
```bash
npx tauri build --no-bundle
```
Hasil executable akan berada di:
`src-tauri/target/release/glow.exe`

### 3. Membersihkan Cache Build (Menghemat Disk Space)
Kompilasi Rust dapat menghasilkan cache debug yang besar. Jalankan skrip pembersih:
```powershell
powershell -ExecutionPolicy Bypass -File "clean-cache-and-finalize.ps1"
```

---

## 📦 Struktur Komponen UI (`src/`)

```
src/
├── components/
│   ├── TitleBar.jsx          # Window drag & controls (min/max/close)
│   ├── ProgressBar.jsx       # Lingkaran dan bar progres
│   ├── RoutineList.jsx       # Kontainer kartu rutinitas
│   ├── TaskItem.jsx          # Item checklist produk
│   ├── StreakCounter.jsx     # Logika & UI streak harian
│   ├── TonerToggle.jsx       # Kontrol switch jadwal toner
│   ├── ProductShelfModal.jsx # Modal kelola shelf produk
│   ├── DailyHistoryModal.jsx # Modal riwayat & export data
│   ├── NightSlideshow.jsx    # Slideshow foto malam
│   ├── ClockWidget.jsx       # Widget jam digital
│   └── WeatherAlert.jsx      # Widget cuaca & UV alert
├── data/
│   └── skincareData.js       # Master data produk & logic CRUD
├── utils/
│   └── dateHelper.js         # Format tanggal & helper hari
└── design-system/            # Token & komponen standar UI
```

---

## 🎨 Menambahkan Komponen Baru
Pastikan selalu menggunakan warna dan token dari `src/design-system/`:
```jsx
import { Button, Card, Badge, colors } from '../design-system';

export default function MyWidget() {
  return (
    <Card variant="glass">
      <Badge variant="rose">Baru</Badge>
      <h3 className="font-display text-[#3D1F2A] font-bold">Judul Widget</h3>
      <Button variant="primary">Aksi</Button>
    </Card>
  );
}
```
