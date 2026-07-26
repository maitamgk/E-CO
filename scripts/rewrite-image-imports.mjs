/**
 * Đổi mọi import ảnh trong src từ .png/.jpg/.jpeg sang .webp
 * sau khi chạy scripts/optimize-images.mjs.
 *
 * Chỉ đổi đường dẫn trỏ vào thư mục assets — không đụng tới ảnh trong public/
 * (favicon, og-image) vì các file đó được tham chiếu từ index.html và
 * manifest.json, nơi một số trình đọc link chưa hỗ trợ WebP.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'src');
const CODE_EXT = new Set(['.ts', '.tsx', '.css']);

const walk = dir =>
  readdirSync(dir).flatMap(entry => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

// Chỉ khớp đường dẫn assets, ví dụ: '@/assets/products/logo.png' hoặc './art-fan.jpg'
const PATTERN = /(assets\/[A-Za-z0-9._/-]+?)\.(png|jpe?g)(?=['")])/g;

let changedFiles = 0;
let changedRefs = 0;

for (const file of walk(SRC).filter(f => CODE_EXT.has(extname(f)))) {
  const source = readFileSync(file, 'utf8');
  const updated = source.replace(PATTERN, (_match, path) => {
    changedRefs += 1;
    return `${path}.webp`;
  });

  if (updated !== source) {
    writeFileSync(file, updated, 'utf8');
    changedFiles += 1;
    console.log(`cập nhật ${file.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`);
  }
}

console.log(`\n${changedRefs} đường dẫn ảnh trong ${changedFiles} file đã đổi sang .webp`);
