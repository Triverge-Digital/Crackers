import 'server-only';
import { unstable_cache } from 'next/cache';
import { buildCatalog, Catalog, DbCategory, DbProduct } from './catalog';
import { DEFAULT_SETTINGS, normalizeSettings, ShopSettings } from './settings';
import { publicClient } from './supabase/public';
import { supabaseConfigured } from './supabase/env';
import localCatalog from '../../scripts/data/catalog.json';

export type ShopData = { catalog: Catalog; settings: ShopSettings; source: 'supabase' | 'local' };

/** Cache tag cleared by the admin panel whenever products, categories or settings change. */
export const SHOP_TAG = 'shop-data';

const loadFromSupabase = unstable_cache(
  async (): Promise<ShopData> => {
    const db = publicClient();
    const [cats, products, settings] = await Promise.all([
      db.from('categories').select('id, name, slug, sort_order, is_active').eq('is_active', true),
      db.from('products').select('id, code, name, category_id, unit, mrp, price, image_url, gallery, description, is_active, in_stock, is_premium, sort_order').eq('is_active', true),
      db.from('settings').select('data').eq('id', 1).maybeSingle(),
    ]);
    if (cats.error) throw cats.error;
    if (products.error) throw products.error;
    return {
      catalog: buildCatalog(cats.data as DbCategory[], products.data as DbProduct[]),
      settings: normalizeSettings(settings.data?.data),
      source: 'supabase',
    };
  },
  ['shop-data-v1'],
  { tags: [SHOP_TAG], revalidate: 300 },
);

/** Local price list, used only until Supabase keys are configured (development). */
function loadLocal(): ShopData {
  type LocalCat = { name: string; products: { code: string; name: string; unit: string; mrp: number; price: number; isPremium: boolean }[] };
  const cats: DbCategory[] = [];
  const rows: DbProduct[] = [];
  let pid = 1;
  (localCatalog as LocalCat[]).forEach((c, ci) => {
    const id = ci + 1;
    cats.push({ id, name: c.name, slug: c.name.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), sort_order: id * 10, is_active: true });
    c.products.forEach((p, i) => rows.push({ id: pid++, code: p.code, name: p.name, category_id: id, unit: p.unit, mrp: p.mrp, price: p.price, image_url: null, gallery: [], description: null, is_active: true, in_stock: true, is_premium: p.isPremium, sort_order: i }));
  });
  return { catalog: buildCatalog(cats, rows), settings: DEFAULT_SETTINGS, source: 'local' };
}

export async function getShopData(): Promise<ShopData> {
  if (!supabaseConfigured) return loadLocal();
  return loadFromSupabase();
}
