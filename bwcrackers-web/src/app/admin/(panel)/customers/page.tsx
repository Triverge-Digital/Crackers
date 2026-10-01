import Link from 'next/link';
import { Download } from 'lucide-react';
import { requireAdmin } from '@/admin/auth';
import { Card, EmptyState, PageHeader, btnSecondary, inputCls, phoneDisplay, rupees, shortDate } from '@/admin/ui';

export const metadata = { title: 'Customers' };
const PAGE = 40;

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

export default async function CustomersPage({ searchParams }: Props) {
  const { db } = await requireAdmin();
  const { q = '', page = '1' } = await searchParams;
  const pageNo = Math.max(1, Number(page) || 1);
  const term = q.trim().replace(/[%,()]/g, ' ');

  let query = db
    .from('customers')
    .select('id, name, phone, email, city, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((pageNo - 1) * PAGE, pageNo * PAGE - 1);
  if (term) {
    const digits = term.replace(/\D/g, '');
    const ors = [`name.ilike.%${term}%`, `city.ilike.%${term}%`, `email.ilike.%${term}%`];
    if (digits.length >= 4) ors.push(`phone.ilike.%${digits}%`);
    query = query.or(ors.join(','));
  }
  const { data: customers, count } = await query;

  const ids = (customers ?? []).map(c => c.id);
  const { data: orders } = ids.length
    ? await db.from('orders').select('customer_id, grand_total, status, created_at').in('customer_id', ids)
    : { data: [] as { customer_id: string; grand_total: number; status: string; created_at: string }[] };
  const stats = new Map<string, { orders: number; spent: number; last: string }>();
  for (const o of orders ?? []) {
    const s = stats.get(o.customer_id) ?? { orders: 0, spent: 0, last: o.created_at };
    s.orders++;
    if (o.status !== 'cancelled') s.spent += Number(o.grand_total);
    if (o.created_at > s.last) s.last = o.created_at;
    stats.set(o.customer_id, s);
  }
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE));

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle={`${count ?? 0} customers`}
        actions={<a href="/admin/customers/export" className={btnSecondary}><Download size={16} /> Download (Excel/CSV)</a>}
      />
      <form className="flex gap-2 mb-4" action="/admin/customers">
        <input name="q" defaultValue={q} placeholder="Search name, phone, city or email" className={inputCls} />
        <button className={btnSecondary}>Search</button>
      </form>
      <Card>
        {customers?.length ? (
          <ul className="divide-y divide-gray-100">
            {customers.map(c => {
              const s = stats.get(c.id);
              return (
                <li key={c.id}>
                  <Link href={`/admin/customers/${c.id}`} className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-gray-50">
                    <span className="w-10 h-10 rounded-full bg-brand-navy/10 text-brand-navy font-extrabold flex items-center justify-center flex-shrink-0">{c.name.slice(0, 1).toUpperCase()}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900 truncate">{c.name}</p>
                      <p className="text-xs text-gray-500 truncate">{phoneDisplay(c.phone)}{c.city ? ` · ${c.city}` : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-sm tabular-nums">{rupees(s?.spent ?? 0)}</p>
                      <p className="text-xs text-gray-500">{s?.orders ?? 0} order{s?.orders === 1 ? '' : 's'}{s ? ` · ${shortDate(s.last)}` : ''}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState title={q ? 'No customers match' : 'No customers yet'} text={q ? 'Try another search.' : 'Everyone who orders on the website is saved here automatically.'} />
        )}
      </Card>
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          {pageNo > 1 ? <Link href={`/admin/customers?${new URLSearchParams({ ...(q ? { q } : {}), page: String(pageNo - 1) })}`} className={btnSecondary}>← Previous</Link> : <span />}
          <span className="text-gray-500">Page {pageNo} of {pages}</span>
          {pageNo < pages ? <Link href={`/admin/customers?${new URLSearchParams({ ...(q ? { q } : {}), page: String(pageNo + 1) })}`} className={btnSecondary}>Next →</Link> : <span />}
        </div>
      )}
    </>
  );
}
