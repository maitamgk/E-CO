/**
 * Chuyển ảnh trong src/assets sang WebP và giới hạn kích thước.
 *
 * Trước khi tối ưu, thư mục assets nặng ~27MB — riêng art-portrait.png đã 4.9MB.
 * Khách dùng 4G phải tải nguyên khối đó chỉ để xem một trang sản phẩm.
 *
 * Cách dùng:
 *   node scripts/optimize-images.mjs           # chuyển ảnh + ghi file .webp
 *   node scripts/optimize-images.mjs --dry     # chỉ xem trước, không ghi gì
 *
 * Script KHÔNG tự sửa import — chạy xong dùng scripts/rewrite-image-imports.mjs.
 */
import { readdirSync, statSync, unlinkSync, existsSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = resolve(ROOT, 'src/assets');
const DRY = process.argv.includes('--dry');

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;
const SOURCE_EXT = new Set(['.png', '.jpg', '.jpeg']);

const walk = dir =>
  readdirSync(dir).flatMap(entry => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const mb = bytes => (bytes / 1024 / 1024).toFixed(2);

const files = walk(ASSETS).filter(file => SOURCE_EXT.has(extname(file).toLowerCase()));

let before = 0;
let after = 0;

for (const file of files) {
  const originalSize = statSync(file).size;
  const target = file.replace(/\.(png|jpe?g)$/i, '.webp');

  const image = sharp(file);
  const meta = await image.metadata();
  const resize = meta.width && meta.width > MAX_WIDTH ? { width: MAX_WIDTH } : null;

  const buffer = await (resize ? image.resize(resize) : image)
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toBuffer();

  before += originalSize;
  after += buffer.length;

  const label = `${file.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`;
  console.log(
    `${label}: ${mb(originalSize)}MB → ${mb(buffer.length)}MB` +
      (resize ? ` (${meta.width}px → ${MAX_WIDTH}px)` : ''),
  );

  if (!DRY) {
    await sharp(buffer).toFile(target);
    if (existsSync(target) && target !== file) unlinkSync(file);
  }
}

console.log(
  `\n${files.length} ảnh: ${mb(before)}MB → ${mb(after)}MB ` +
    `(giảm ${Math.round((1 - after / before) * 100)}%)${DRY ? ' [dry-run]' : ''}`,
);
