// Gives an existing Supabase Auth user access to /admin.
// Create the user first in Supabase → Authentication → Users → Add user.
//   yarn admin:grant owner@example.com "Owner name"
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: path.join(root, '.env.local') });

const [email, name] = process.argv.slice(2);
if (!email) { console.error('Usage: yarn admin:grant <email> [name]'); process.exit(1); }

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
let user = null;
for (let page = 1; !user; page++) {
  const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
  if (error) throw error;
  user = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  if (data.users.length < 200) break;
}
if (!user) { console.error(`No Supabase user with email ${email}. Add it under Authentication → Users first.`); process.exit(1); }
const { error } = await db.from('admins').upsert({ user_id: user.id, name: name ?? null });
if (error) throw error;
console.log(`${email} can now sign in at /admin`);
