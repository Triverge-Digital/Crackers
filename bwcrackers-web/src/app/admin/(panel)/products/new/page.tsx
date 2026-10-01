import { requireAdmin } from '@/admin/auth';
import { PageHeader } from '@/admin/ui';
import ProductForm from '@/admin/ProductForm';
import { normalizeSettings } from '@/lib/settings';

export const metadata = { title: 'Add product' };

type Props = { searchParams: Promise<{ category?: string }> };

export default async function NewProductPage({ searchParams }: Props) {
  const { db } = await requireAdmin();
  const { category } = await searchParams;
  const [{ data: categories }, { data: settingsRow }] = await Promise.all([
    db.from('categories').select('id, name').order('sort_order').order('id'),
    db.from('settings').select('data').eq('id', 1).maybeSingle(),
  ]);
  return (
    <>
      <PageHeader back={{ href: '/admin/products', label: 'Products' }} title="Add product" />
      <ProductForm
        categories={categories ?? []}
        discountPct={normalizeSettings(settingsRow?.data).discountPct}
        initial={{ id: null, code: '', name: '', category_id: category ? Number(category) : '', unit: '1 BOX', mrp: 0, price: 0, description: '', image_url: '', gallery: [], is_active: true, in_stock: true, is_premium: false, sort_order: 0 }}
      />
    </>
  );
}
