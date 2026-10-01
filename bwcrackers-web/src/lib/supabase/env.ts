export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** False until .env.local / Vercel env has the Supabase project keys. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
