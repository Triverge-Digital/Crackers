// Loads the 2026 catalog, product photos and default settings into Supabase.
// Safe to re-run: existing products/categories are left untouched unless you
// pass --force (which overwrites names, prices and photos from the files).
//   yarn db:seed            # first import
//   yarn db:seed --force    # re-import over admin edits
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import { ASSIGN, PHOTO_FOLDER, NEW_PRODUCTS } from './data/photo-map.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: path.join(root, '.env.local') });
const force = process.argv.includes('--force');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = 'products';

const slugify = s => s.toLowerCase().replace(/&/g, ' and ').replace(/₹/g, 'rs').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const must = (res, what) => { if (res.error) throw new Error(`${what}: ${res.error.message}`); return res.data; };

// --- categories --------------------------------------------------------------
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'scripts/data/catalog.json'), 'utf8'));
const categoryNames = [...catalog.map(c => c.name)];
for (const p of NEW_PRODUCTS) if (!categoryNames.includes(p.category)) categoryNames.push(p.category);

const existingCats = must(await db.from('categories').select('id, name, slug'), 'read categories');
const catBySlug = new Map(existingCats.map(c => [c.slug, c]));
for (const [i, name] of categoryNames.entries()) {
  const slug = slugify(name);
  if (catBySlug.has(slug) && !force) continue;
  const row = must(await db.from('categories').upsert({ name, slug, sort_order: (i + 1) * 10, is_active: true }, { onConflict: 'slug' }).select('id, name, slug').single(), `category ${name}`);
  catBySlug.set(slug, row);
}
const catId = name => catBySlug.get(slugify(name)).id;
console.log(`categories: ${catBySlug.size}`);

// --- products ----------------------------------------------------------------
const existing = must(await db.from('products').select('code'), 'read products');
const have = new Set(existing.map(p => p.code));
const rows = [];
for (const cat of catalog) {
  cat.products.forEach((p, i) => {
    if (have.has(p.code) && !force) return;
    rows.push({ code: p.code, name: p.name, unit: p.unit, mrp: p.mrp, price: p.price, is_premium: p.isPremium, category_id: catId(cat.name), sort_order: (i + 1) * 10, is_active: true });
  });
}
NEW_PRODUCTS.forEach((p, i) => {
  if (have.has(p.code) && !force) return;
  rows.push({ code: p.code, name: p.name, unit: p.unit, mrp: 0, price: 0, is_premium: false, category_id: catId(p.category), sort_order: 1000 + i * 10, is_active: false });
});
if (rows.length) must(await db.from('products').upsert(rows, { onConflict: 'code' }), 'upsert products');
console.log(`products written: ${rows.length}`);

// --- photos ------------------------------------------------------------------
async function uploadWebp(file, dest) {
  const input = fs.readFileSync(path.join(PHOTO_FOLDER, file));
  const big = await sharp(input).rotate().resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  const small = await sharp(input).rotate().resize({ width: 240, height: 240, fit: 'cover' }).webp({ quality: 72 }).toBuffer();
  const opts = { contentType: 'image/webp', upsert: true, cacheControl: '31536000' };
  must(await db.storage.from(BUCKET).upload(`${dest}.webp`, big, opts), `upload ${dest}`);
  must(await db.storage.from(BUCKET).upload(`${dest}-sm.webp`, small, opts), `upload ${dest}-sm`);
  return db.storage.from(BUCKET).getPublicUrl(`${dest}.webp`).data.publicUrl;
}

const photosByCode = {};
for (const [file, code] of Object.entries(ASSIGN)) (photosByCode[code] ||= []).push(file);

const withImage = new Set(must(await db.from('products').select('code, image_url'), 'read images').filter(p => p.image_url).map(p => p.code));
let uploaded = 0;
for (const [code, files] of Object.entries(photosByCode)) {
  if (withImage.has(code) && !force) continue;
  const urls = [];
  for (const [i, file] of files.entries()) urls.push(await uploadWebp(file, `catalog/${slugify(code)}-${i + 1}`));
  must(await db.from('products').update({ image_url: urls[0], gallery: urls.slice(1) }).eq('code', code), `set image ${code}`);
  uploaded += files.length;
  process.stdout.write('.');
}
console.log(`\nproduct photos uploaded: ${uploaded}`);

// Unassigned photos go to the admin photo library.
const assigned = new Set(Object.keys(ASSIGN));
let library = 0;
for (const dir of fs.readdirSync(PHOTO_FOLDER)) {
  for (const f of fs.readdirSync(path.join(PHOTO_FOLDER, dir))) {
    const rel = `${dir}/${f}`;
    if (assigned.has(rel)) continue;
    await uploadWebp(rel, `library/${slugify(dir)}--${slugify(f.replace(/\.\w+$/, ''))}`);
    library++;
  }
}
console.log(`library photos uploaded: ${library}`);

// --- settings ----------------------------------------------------------------
const current = must(await db.from('settings').select('data').eq('id', 1).single(), 'read settings');
if (force || !current.data || Object.keys(current.data).length === 0) {
  must(await db.from('settings').update({
    data: {
      orderingEnabled: true,
      minOrder: 3000,
      packingFeePct: 2,
      discountPct: 80,
      dispatchDeadline: '2026-11-03T23:59',
      announcement: ['Flat 80% discount on all crackers', 'Direct dispatch from Sivakasi', 'Minimum order ₹3,000', 'Pay after order confirmation · UPI & bank transfer'],
      contact: { primaryPhone: '9363036289', secondaryPhone: '7867036289', whatsapp: '9363036289', email: 'bwcrackers@gmail.com', instagram: 'https://www.instagram.com/bwcrackers/', address: 'Sivakasi, Virudhunagar District, Tamil Nadu' },
      bank: { name: 'WAHIDH HUSSAIN S', account: '003100050344099', bank: 'TamilNadu Mercantile Bank', branch: 'Sivakasi', type: 'Savings Account', ifsc: 'TMBL0000003', upi: '7867036289' },
      delivery: { dispatchWindow: '2–4 working days after payment confirmation', transitTime: '3–7 days depending on your city' },
      orderEmails: ['bwcrackers@gmail.com', 'gmhussainnsui@gmail.com'],
    },
  }).eq('id', 1), 'write settings');
  console.log('settings: defaults written');
} else {
  console.log('settings: kept existing');
}
console.log('seed complete');
