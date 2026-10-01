import { NextResponse } from 'next/server';
import { BUNDLED_PRICE_LIST, normalizeSettings, priceListFile } from '@/lib/settings';
import { publicClient } from '@/lib/supabase/public';
import { supabaseConfigured } from '@/lib/supabase/env';

export const dynamic = 'force-dynamic';

/**
 * The website's "Price list" button points here. The current PDF is looked up
 * at click time, so a PDF uploaded in /admin/settings is served straight away —
 * no cached page or already-open tab can keep handing out the previous file.
 */
export async function GET(req: Request) {
  let target = BUNDLED_PRICE_LIST;
  if (supabaseConfigured) {
    const { data } = await publicClient().from('settings').select('data').eq('id', 1).maybeSingle();
    target = priceListFile(normalizeSettings(data?.data));
  }
  const res = NextResponse.redirect(new URL(target, req.url), 307);
  res.headers.set('Cache-Control', 'no-store, max-age=0');
  return res;
}
