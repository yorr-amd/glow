/* global Buffer */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createBmp24(width, height, getPixelBgr) {
  const rowStride = Math.floor((24 * width + 31) / 32) * 4;
  const pixelDataSize = rowStride * height;
  const fileSize = 54 + pixelDataSize;

  const buf = Buffer.alloc(fileSize);

  // BMP Header (14 bytes)
  buf.write('BM', 0);
  buf.writeUInt32LE(fileSize, 2);
  buf.writeUInt16LE(0, 6);
  buf.writeUInt16LE(0, 8);
  buf.writeUInt32LE(54, 10);

  // DIB Header (BITMAPINFOHEADER - 40 bytes)
  buf.writeUInt32LE(40, 14);
  buf.writeInt32LE(width, 18);
  buf.writeInt32LE(height, 22); // positive = bottom to top
  buf.writeUInt16LE(1, 26); // color planes
  buf.writeUInt16LE(24, 28); // bpp
  buf.writeUInt32LE(0, 30); // BI_RGB compression
  buf.writeUInt32LE(pixelDataSize, 34);
  buf.writeInt32LE(2835, 38); // 72 DPI
  buf.writeInt32LE(2835, 42); // 72 DPI
  buf.writeUInt32LE(0, 46);
  buf.writeUInt32LE(0, 50);

  // Pixels bottom-up
  for (let y = 0; y < height; y++) {
    // inverted Y because BMP is bottom-up (y=0 in BMP is bottom of image)
    const actualY = height - 1 - y;
    const rowOffset = 54 + y * rowStride;
    for (let x = 0; x < width; x++) {
      const [b, g, r] = getPixelBgr(x, actualY, width, height);
      const pixelOffset = rowOffset + x * 3;
      buf[pixelOffset] = Math.max(0, Math.min(255, Math.round(b)));
      buf[pixelOffset + 1] = Math.max(0, Math.min(255, Math.round(g)));
      buf[pixelOffset + 2] = Math.max(0, Math.min(255, Math.round(r)));
    }
  }

  return buf;
}

// Generate Sidebar (164x314)
function generateSidebar() {
  const width = 164;
  const height = 314;

  const buf = createBmp24(width, height, (x, y, w, h) => {
    const normY = y / h;
    const normX = x / w;

    // Base background gradient: Top soft blush (#FDF5F7) -> Mid rose gold (#F5D0DA) -> Bottom plum blush (#D890A5)
    let r = 253 - normY * 45;
    let g = 245 - normY * 95;
    let b = 247 - normY * 80;

    // Glowing circle in center (serum essence glow)
    const cx = w * 0.5;
    const cy = h * 0.42;
    const dist = Math.hypot(x - cx, y - cy);
    if (dist < 55) {
      const glowFactor = (1 - dist / 55) * 0.45;
      r = r * (1 - glowFactor) + 255 * glowFactor;
      g = g * (1 - glowFactor) + 220 * glowFactor;
      b = b * (1 - glowFactor) + 235 * glowFactor;
    }

    // Bottle silhouette at center
    // Bottle body: x between cx - 18 and cx + 18, y between cy - 10 and cy + 40
    if (x >= cx - 18 && x <= cx + 18 && y >= cy - 10 && y <= cy + 42) {
      // Glass border or liquid
      const isBorder = x === Math.round(cx - 18) || x === Math.round(cx + 18) || y === Math.round(cy + 42) || y === Math.round(cy - 10);
      if (isBorder) {
        // Deep Rose border
        r = 155; g = 75; b = 98;
      } else {
        // Liquid inside (#E8829F)
        r = 232; g = 130; b = 159;
      }
    }
    // Dropper cap: x between cx - 8 and cx + 8, y between cy - 26 and cy - 10
    if (x >= cx - 8 && x <= cx + 8 && y >= cy - 26 && y <= cy - 10) {
      r = 90; g = 40; b = 60; // Deep plum
    }
    // Pipette tip
    if (x >= cx - 4 && x <= cx + 4 && y >= cy - 32 && y <= cy - 26) {
      r = 255; g = 240; b = 245;
    }

    // Sparkling stars / petals pattern
    const sparkle1 = Math.hypot(x - 30, y - 60);
    if (sparkle1 < 4) { r = 255; g = 255; b = 255; }
    const sparkle2 = Math.hypot(x - 130, y - 80);
    if (sparkle2 < 3.5) { r = 255; g = 255; b = 255; }
    const sparkle3 = Math.hypot(x - 40, y - 220);
    if (sparkle3 < 3) { r = 255; g = 255; b = 255; }
    const sparkle4 = Math.hypot(x - 125, y - 240);
    if (sparkle4 < 4) { r = 255; g = 255; b = 255; }

    // Bottom decorative bar
    if (y >= h - 25) {
      r = 61; g = 31; b = 42; // Romantic plum (#3D1F2A)
    } else if (y >= h - 28) {
      r = 208; g = 104; b = 133; // Rose accent line (#D06885)
    }

    // Convert RGB to BGR for BMP
    return [b, g, r];
  });

  const outPath = path.resolve(__dirname, '../src-tauri/icons/nsis-sidebar.bmp');
  fs.writeFileSync(outPath, buf);
  console.log(`Generated: ${outPath} (${buf.length} bytes)`);
}

// Generate Header (150x57)
function generateHeader() {
  const width = 150;
  const height = 57;

  const buf = createBmp24(width, height, (x, y, w, h) => {
    const normX = x / w;
    // Horizontal gradient: blush pink to deep romantic rose
    let r = 253 - normX * 40;
    let g = 245 - normX * 80;
    let b = 247 - normX * 65;

    // Glowing flower/icon on the left (x ~ 25, y ~ 28)
    const iconDist = Math.hypot(x - 24, y - 28);
    if (iconDist < 12) {
      r = 208; g = 104; b = 133;
    }
    if (iconDist < 6) {
      r = 255; g = 255; b = 255;
    }

    // Top border line
    if (y < 2) {
      r = 208; g = 104; b = 133;
    }
    // Bottom border line
    if (y >= h - 2) {
      r = 155; g = 75; b = 98;
    }

    return [b, g, r];
  });

  const outPath = path.resolve(__dirname, '../src-tauri/icons/nsis-header.bmp');
  fs.writeFileSync(outPath, buf);
  console.log(`Generated: ${outPath} (${buf.length} bytes)`);
}

generateSidebar();
generateHeader();
