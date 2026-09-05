import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const targets = [
  { name: 'Tauri Rust Target', path: 'src-tauri/target' },
  { name: 'Vite Dist Build', path: 'dist' },
  { name: 'Android App Build', path: 'android/app/build' },
  { name: 'Android Root Build', path: 'android/build' },
  { name: 'Android Gradle Cache', path: 'android/.gradle' },
  { name: 'Node Vite Cache', path: 'node_modules/.vite' }
];

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  const kb = bytes / 1024;
  if (kb >= 1) return `${kb.toFixed(2)} KB`;
  return `${bytes} B`;
}

function cleanRecursively(itemPath) {
  let freed = 0;
  if (!fs.existsSync(itemPath)) return freed;

  let stats;
  try {
    stats = fs.lstatSync(itemPath);
  } catch {
    return freed;
  }

  if (stats.isDirectory()) {
    let entries = [];
    try {
      entries = fs.readdirSync(itemPath);
    } catch {
      return freed;
    }

    for (const entry of entries) {
      freed += cleanRecursively(path.join(itemPath, entry));
    }

    try {
      fs.rmdirSync(itemPath);
    } catch {
      // Directory may not be empty if some locked/protected files remained
    }
  } else {
    try {
      freed += stats.size;
      fs.chmodSync(itemPath, 0o666);
      fs.unlinkSync(itemPath);
    } catch {
      // File could be locked or permission restricted
    }
  }

  return freed;
}

console.log('🧹 [Glow Clean Service] Memulai pembersihan cache proyek...');

let totalFreed = 0;

for (const target of targets) {
  const fullTarget = path.join(rootDir, target.path);
  if (fs.existsSync(fullTarget)) {
    const freed = cleanRecursively(fullTarget);
    totalFreed += freed;
    if (freed > 0) {
      console.log(`✅ ${target.name} (${target.path}) berhasil dibersihkan! [Hemat: ${formatBytes(freed)}]`);
    } else {
      console.log(`✨ ${target.name} (${target.path}) sudah bersih.`);
    }
  } else {
    console.log(`✨ ${target.name} (${target.path}) sudah bersih.`);
  }
}

console.log('--------------------------------------------------');
console.log(`🎉 Pembersihan selesai! Total ruang disk yang dihemat: ${formatBytes(totalFreed)}`);
console.log('💖 Proyek Cece Yori Glow Tracker kinclong kembali!');
