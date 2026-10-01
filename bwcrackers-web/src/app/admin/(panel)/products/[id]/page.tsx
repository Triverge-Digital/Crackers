import { notFound } from 'next/navigation';
import { requireAdmin } from '@/admin/auth';
import { PageHeader } from '@/admin/ui';
import ProductForm from '@/admin/ProductForm';
import { normalizeSettings } from '@/lib/settings';

export const metadata = { title: 'Edit product' };

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const { db } = await requireAdmin();
  const [{ data: p }, { data: categories }, { data: settingsRow }] = await Promise.all([
    db.from('products').select('*').eq('id', Number(id)).maybeSingle(),
    db.from('categories').select('id, name').order('sort_order').order('id'),
    db.from('settings').select('data').eq('id', 1).maybeSingle(),
  ]);
  if (!p) notFound();
  return (
    <>
      <PageHeader back={{ href: '/admin/products', label: 'Products' }} title={p.name} subtitle={`#${p.code}`} />
      <ProductForm
        categories={categories ?? []}
        discountPct={normalizeSettings(settingsRow?.data).discountPct}
        initial={{
          id: p.id,
          code: p.code,
          name: p.name,
          category_id: p.category_id,
          unit: p.unit,
          mrp: Number(p.mrp),
          price: Number(p.price),
          description: p.description ?? '',
          image_url: p.image_url ?? '',
          gallery: p.gallery ?? [],
          is_active: p.is_active,
          in_stock: p.in_stock,
          is_premium: p.is_premium,
          sort_order: p.sort_order,
        }}
      />
    </>
  );
}
