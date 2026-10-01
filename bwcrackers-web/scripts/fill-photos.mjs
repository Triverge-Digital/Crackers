// One-off photo fixes after checking every candidate image by eye (2026-10-01).
// Several old-website files were mislabelled, so these are matched by what the
// photo actually shows, not by file name.
//   node scripts/fill-photos.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: path.join(root, '.env.local'), quiet: true });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const PHOTOS = 'C:/Users/Athiban/Downloads/Price List Photos/Price List Photos';
const OLD = path.join(root, '../bwcrackers-storefront/public/images/products');

const sparklers = path.join(PHOTOS, 'kambi/Sparklers.jpg');
const FIXES = [
  // [product codes, source file, note]
  [['68'], path.join(OLD, 'bw-1-2-3-4-kuruvi.webp'), 'box reads "Ashrafi Small"'],
  [['69'], path.join(PHOTOS, 'sky sowers/Asrafi.jpg'), 'Gold Ashrafi'],
  [['79'], path.join(PHOTOS, 'fancy items/12shoot.jpg'), 'catalogue page shows 12 Shot Colour and 12 Shot Crackling'],
  [['146'], path.join(OLD, 'bw-30-tim-tam.webp'), 'box reads "Madurai Malli"'],
  [['30'], path.join(OLD, 'bw-28-bat-and-ball.webp'), 'bat-and-ball cracker'],
  [['75'], path.join(PHOTOS, 'hollywood fountation/5in1Multi_Color.jpg'), '"Five Rangers" 5-in-1'],
  [['111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126'], sparklers, 'sparklers pack (same product in different lengths/colours)'],
];

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

for (const [codes, file, note] of FIXES) {
  const input = fs.readFileSync(file);
  const dest = `catalog/fix-${slug(path.basename(file, path.extname(file)))}`;
  const big = await sharp(input).rotate().resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  const small = await sharp(input).rotate().resize({ width: 240, height: 240, fit: 'cover' }).webp({ quality: 72 }).toBuffer();
  const opts = { contentType: 'image/webp', upsert: true, cacheControl: '31536000' };
  for (const [p, buf] of [[`${dest}.webp`, big], [`${dest}-sm.webp`, small]]) {
    const { error } = await db.storage.from('products').upload(p, buf, opts);
    if (error) throw new Error(`${p}: ${error.message}`);
  }
  const url = db.storage.from('products').getPublicUrl(`${dest}.webp`).data.publicUrl;
  const { error } = await db.from('products').update({ image_url: url }).in('code', codes);
  if (error) throw new Error(error.message);
  console.log(`${codes.join(',')} ← ${path.basename(file)} (${note})`);
}

const { count } = await db.from('products').select('id', { count: 'exact', head: true }).is('image_url', null);
console.log(`products still without a photo: ${count}`);
