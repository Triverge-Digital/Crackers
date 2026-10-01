import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shop/constants';
import { getShopData } from '@/lib/shop-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { catalog } = await getShopData();
  const pages = ['', '/store', '/collections', '/track'].map(p => ({ url: `${SITE_URL}${p}`, changeFrequency: 'weekly' as const, priority: p ? 0.8 : 1 }));
  return [...pages, ...catalog.categories.map(c => ({ url: `${SITE_URL}/store/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.7 }))];
}
