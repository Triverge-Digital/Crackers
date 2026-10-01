import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env';

/** Anonymous client for public reads (active catalog, settings). No session, safe anywhere. */
export function publicClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
}
