import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import StorePage from '@/shop/pages/StorePage';
import { getShopData } from '@/lib/shop-data';
import { formatINR } from '@/shop/lib/format';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { catalog } = await getShopData();
  const cat = catalog.categories.find(c => c.slug === slug);
  if (!cat) return {};
  const from = Math.min(...cat.products.map(p => p.discountPrice));
  return {
    title: `${cat.name} – 80% off`,
    description: `${cat.name} from B&W Crackers Sivakasi at 80% off MRP. ${cat.products.length} items from ${formatINR(from)}.`,
    alternates: { canonical: `/store/${cat.slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { catalog } = await getShopData();
  if (!catalog.categories.some(c => c.slug === slug)) notFound();
  return (
    <Suspense>
      <StorePage categorySlug={slug} />
    </Suspense>
  );
}
