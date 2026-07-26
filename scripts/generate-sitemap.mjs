/**
 * Sinh public/sitemap.xml từ danh sách route và catalog sản phẩm.
 *
 * Sitemap trước đây viết tay nên thiếu toàn bộ URL /product/:id — đúng những
 * trang cần được index nhất. Script chạy trước mỗi lần build nên sitemap
 * không bao giờ lệch với catalog.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://e-co.shop';

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/shop', changefreq: 'daily', priority: '0.9' },
  { path: '/pricing', changefreq: 'weekly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog', changefreq: 'weekly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/policies', changefreq: 'yearly', priority: '0.4' },
  { path: '/order-lookup', changefreq: 'monthly', priority: '0.5' },
];

/** Lấy id sản phẩm từ catalog. Đọc dạng text vì file TS có import ảnh, không require được trong Node. */
const readProductIds = () => {
  const source = readFileSync(resolve(ROOT, 'src/data/mockProducts.ts'), 'utf8');
  const ids = [...source.matchAll(/^\s{4}id:\s*'([^']+)'/gm)].map(match => match[1]);

  if (ids.length === 0) {
    throw new Error('Không đọc được id sản phẩm nào từ src/data/mockProducts.ts');
  }
  return ids;
};

const today = new Date().toISOString().slice(0, 10);

const urlEntry = ({ path, changefreq, priority }) =>
  `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const productIds = readProductIds();

const entries = [
  ...STATIC_ROUTES,
  ...productIds.map(id => ({ path: `/product/${id}`, changefreq: 'weekly', priority: '0.8' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(urlEntry).join('\n')}
</urlset>
`;

writeFileSync(resolve(ROOT, 'public/sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml: ${entries.length} URL (${productIds.length} sản phẩm)`);
