// One-off: extracts the 2026 price list from the old storefront into
// scripts/data/catalog.json for seeding, and checks the photo mapping.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ASSIGN, PHOTO_FOLDER, NEW_PRODUCTS } from './data/photo-map.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = fs.readFileSync(path.join(root, '../bwcrackers-storefront/src/data/pricelist.ts'), 'utf8');

const cats = [];
let cat = null;
for (const line of src.split('\n')) {
  const c = line.match(/^\s*name:\s*"([^"]+)",\s*$/);
  if (c) { cat = { name: c[1], products: [] }; cats.push(cat); }
  const m = line.match(/code:\s*"([^"]+)",\s*name:\s*"((?:[^"\\]|\\.)*)",\s*unit:\s*"([^"]+)",\s*mrp:\s*(\d+),\s*discountPrice:\s*(\d+)/);
  if (m) cat.products.push({ code: m[1], name: m[2].replace(/\\"/g, '"'), unit: m[3], mrp: +m[4], price: +m[5], isPremium: /isPremium:\s*true/.test(line) });
}
fs.writeFileSync(path.join(root, 'scripts/data/catalog.json'), JSON.stringify(cats, null, 1) + '\n');
const products = cats.flatMap(c => c.products);
console.log(`${cats.length} categories, ${products.length} products, ${products.filter(p => p.isPremium).length} premium`);

const codes = new Set([...products.map(p => p.code), ...NEW_PRODUCTS.map(p => p.code)]);
const files = [];
for (const d of fs.readdirSync(PHOTO_FOLDER)) for (const f of fs.readdirSync(path.join(PHOTO_FOLDER, d))) files.push(`${d}/${f}`);
const missingFile = Object.keys(ASSIGN).filter(k => !files.includes(k));
const badCode = Object.entries(ASSIGN).filter(([, v]) => !codes.has(v));
const library = files.filter(f => !(f in ASSIGN));
console.log(`photos ${files.length}, assigned ${Object.keys(ASSIGN).length}, products with a photo ${new Set(Object.values(ASSIGN)).size}`);
console.log('missing files:', missingFile);
console.log('unknown codes:', badCode);
console.log(`library (unassigned) ${library.length}: ${library.join(' | ')}`);
