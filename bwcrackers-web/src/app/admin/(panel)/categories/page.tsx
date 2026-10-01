import { requireAdmin } from '@/admin/auth';
import { Card, PageHeader } from '@/admin/ui';
import CategoryManager from './CategoryManager';

export const metadata = { title: 'Categories' };

export default async function CategoriesPage() {
  const { db } = await requireAdmin();
  const [{ data: cats }, { data: products }] = await Promise.all([
    db.from('categories').select('id, name, slug, is_active, sort_order').order('sort_order').order('id'),
    db.from('products').select('category_id, is_active'),
  ]);
  const counts = new Map<number, { total: number; visible: number }>();
  for (const p of products ?? []) {
    const c = counts.get(p.category_id) ?? { total: 0, visible: 0 };
    c.total++;
    if (p.is_active) c.visible++;
    counts.set(p.category_id, c);
  }
  return (
    <>
      <PageHeader title="Categories" subtitle="The order here is the order on the website" />
      <Card>
        <CategoryManager categories={(cats ?? []).map(c => ({ ...c, total: counts.get(c.id)?.total ?? 0, visible: counts.get(c.id)?.visible ?? 0 }))} />
      </Card>
    </>
  );
}
