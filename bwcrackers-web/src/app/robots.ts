import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shop/constants';

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/cart', '/order-success'] }], sitemap: `${SITE_URL}/sitemap.xml` };
}
