// Copies the two Supabase keys from .env.local into the linked Vercel project
// (Production). Run it yourself: node scripts/push-keys-to-vercel.mjs
// Values are piped to the Vercel CLI and never printed.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: path.join(root, '.env.local'), quiet: true });

const keys = [
  ['NEXT_PUBLIC_SUPABASE_ANON_KEY', ['--no-sensitive', '--yes']], // public by design (sent to browsers), so not marked sensitive
  ['SUPABASE_SERVICE_ROLE_KEY', ['--sensitive', '--yes']], // server-only secret
];

for (const [name, extra] of keys) {
  const value = process.env[name];
  if (!value) { console.error(`${name} is missing from .env.local`); process.exit(1); }
  const r = spawnSync('vercel', ['env', 'add', name, 'production', ...extra], { cwd: root, input: value, encoding: 'utf8', shell: true });
  const out = `${r.stdout}${r.stderr}`;
  if (/already exists/i.test(out)) console.log(`${name}: already set in Vercel`);
  else if (r.status === 0) console.log(`${name}: added`);
  else { console.error(`${name}: failed\n${out.replace(value, '[hidden]')}`); process.exit(1); }
}
console.log('Done — tell Claude to deploy.');
