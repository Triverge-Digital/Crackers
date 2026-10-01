import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { serverClient } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/supabase/env';

/**
 * Verifies the session once per request. `getClaims()` checks the JWT signature
 * locally against the project's public signing key (no network round-trip), and
 * React `cache` shares the result between the layout and the page.
 */
const loadAdmin = cache(async () => {
  const db = await serverClient();
  const { data } = await db.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return { db, userId: null, email: null, admin: null };
  const { data: admin } = await db.from('admins').select('user_id, name').eq('user_id', userId).maybeSingle();
  return { db, userId, email: (data.claims.email as string | undefined) ?? null, admin };
});

/**
 * Session-bound Supabase client for the signed-in admin, or a redirect to the
 * login page. Row-level security still applies to every query made with it.
 */
export async function requireAdmin() {
  if (!supabaseConfigured) redirect('/admin/login?setup=1');
  const { db, userId, email, admin } = await loadAdmin();
  if (!userId) redirect('/admin/login');
  if (!admin) redirect('/admin/login?denied=1');
  return { db, userId, adminName: admin.name || email || 'Admin' };
}

/** Same check for server actions: throws instead of redirecting. */
export async function adminClient() {
  const { db, userId, admin } = await loadAdmin();
  if (!userId) throw new Error('Your session has expired. Please sign in again.');
  if (!admin) throw new Error('This account does not have admin access.');
  return { db, user: { id: userId } };
}
