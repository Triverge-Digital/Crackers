import Link from 'next/link';
import { Plus } from 'lucide-react';
import { requireAdmin } from '@/admin/auth';
import { Card, EmptyState, PageHeader, btnPrimary, btnSecondary, inputCls } from '@/admin/ui';
import ProductTable, { AdminProductRow } from './ProductTable';

export const metadata = { title: 'Products' };

type Props = { searchParams: Promise<{ category?: string; q?: string; show?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { db } = await requireAdmin();
  const { category = '', q = '', show = 'all' } = await searchParams;

  const [{ data: categories }, productsRes] = await Promise.all([
    db.from('categories').select('id, name').order('sort_order').order('id'),
    (() => {
      let query = db
        .from('products')
        .select('id, code, name, unit, mrp, price, image_url, is_active, in_stock, category_id, sort_order')
        .order('sort_order')
        .order('id');
      if (category) query = query.eq('category_id', Number(category));
      if (show === 'visible') query = query.eq('is_active', true);
      if (show === 'hidden') query = query.eq('is_active', false);
      if (show === 'nophoto') query = query.is('image_url', null);
      const term = q.trim().replace(/[%,()]/g, ' ');
      if (term) query = query.or(`name.ilike.%${term}%,code.ilike.%${term}%`);
      return query;
    })(),
  ]);

  const catName = new Map((categories ?? []).map(c => [c.id, c.name]));
  const rows: AdminProductRow[] = (productsRes.data ?? []).map(p => ({ ...p, mrp: Number(p.mrp), price: Number(p.price), category: catName.get(p.category_id) ?? '' }));
  // Keep the list in the same order as the website: by category, then product order.
  const catOrder = new Map((categories ?? []).map((c, i) => [c.id, i]));
  rows.sort((a, b) => (catOrder.get(a.category_id) ?? 0) - (catOrder.get(b.category_id) ?? 0) || a.sort_order - b.sort_order || a.id - b.id);

  const filters = [
    ['all', 'All'],
    ['visible', 'On website'],
    ['hidden', 'Hidden'],
    ['nophoto', 'No photo'],
  ] as const;

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${rows.length} shown · change prices right in the list, changes go live instantly`}
        actions={<Link href="/admin/products/new" className={btnPrimary}><Plus size={16} /> Add product</Link>}
      />

      <form className="grid gap-2 sm:grid-cols-[1fr_220px_auto] mb-3" action="/admin/products">
        <input name="q" defaultValue={q} placeholder="Search by name or code" className={inputCls} />
        <select name="category" defaultValue={category} className={inputCls}>
          <option value="">All categories</option>
          {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {show !== 'all' && <input type="hidden" name="show" value={show} />}
        <button className={btnSecondary}>Filter</button>
      </form>

      <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
        {filters.map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/products?${new URLSearchParams({ ...(key !== 'all' ? { show: key } : {}), ...(category ? { category } : {}), ...(q ? { q } : {}) })}`}
            className={`flex-shrink-0 rounded-full px-3.5 min-h-[36px] inline-flex items-center text-sm font-bold border ${show === key ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-gray-700 border-gray-200'}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <Card>
        {rows.length ? <ProductTable key={`${category}|${q}|${show}`} rows={rows} /> : <EmptyState title="No products match" text="Try another search or filter." />}
      </Card>
    </>
  );
}
