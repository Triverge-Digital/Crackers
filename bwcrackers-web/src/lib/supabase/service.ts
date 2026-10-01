import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from './env';

/**
 * Service-role client: bypasses row-level security. Server-only — used to
 * write orders from the storefront and for admin actions after an admin check.
 */
export function serviceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) throw new Error('Supabase service role is not configured');
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
}
