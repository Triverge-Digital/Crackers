// Applies supabase/migrations/*.sql in order, once each, recording them in
// private._migrations (outside the API-exposed public schema). Needs SUPABASE_DB_URL in .env.local.
//   yarn db:migrate
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pg from 'pg';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: path.join(root, '.env.local') });

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('SUPABASE_DB_URL is missing from .env.local');
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();
await client.query('create schema if not exists private');
await client.query('create table if not exists private._migrations (name text primary key, applied_at timestamptz not null default now())');
const { rows } = await client.query('select name from private._migrations');
const applied = new Set(rows.map(r => r.name));

const dir = path.join(root, 'supabase', 'migrations');
const files = (await readdir(dir)).filter(f => f.endsWith('.sql')).sort();
for (const file of files) {
  if (applied.has(file)) { console.log(`skip   ${file}`); continue; }
  const sql = await readFile(path.join(dir, file), 'utf8');
  try {
    await client.query('begin');
    await client.query(sql);
    await client.query('insert into private._migrations (name) values ($1)', [file]);
    await client.query('commit');
    console.log(`apply  ${file}`);
  } catch (err) {
    await client.query('rollback');
    console.error(`failed ${file}: ${err.message}`);
    process.exit(1);
  }
}
await client.end();
console.log('migrations up to date');
