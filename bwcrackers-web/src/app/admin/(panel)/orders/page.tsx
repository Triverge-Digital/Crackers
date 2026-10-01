import Link from 'next/link';
import { requireAdmin } from '@/admin/auth';
import { Card, EmptyState, PageHeader, StatusBadge, inputCls, btnSecondary, phoneDisplay, rupees, shortDate } from '@/admin/ui';
import { ORDER_STATUSES, STATUS_LABEL } from '@/lib/orders';

export const metadata = { title: 'Orders' };

/** "Musical Rocket ×10, 120 Shot ×1 +2 more" */
function itemSummary(items: { name: string; quantity: number }[] | null) {
  const list = items ?? [];
  const title = (n: string) => n.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase());
  const head = list.slice(0, 2).map(i => `${title(i.name)} ×${i.quantity}`).join(', ');
  return list.length > 2 ? `${head} +${list.length - 2} more` : head || '—';
}
const PAGE = 30;

type Props = { searchParams: Promise<{ status?: string; q?: string; page?: string }> };

export default async function OrdersPage({ searchParams }: Props) {
  const { db } = await requireAdmin();
  const { status = 'all', q = '', page = '1' } = await searchParams;
  const pageNo = Math.max(1, Number(page) || 1);
  const term = q.trim().replace(/[%,()]/g, ' ');

  let query = db
    .from('orders')
    .select('id, reference, customer_name, phone, city, grand_total, status, created_at, order_items(name, quantity)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((pageNo - 1) * PAGE, pageNo * PAGE - 1);
  if (status !== 'all') query = query.eq('status', status);
  if (term) {
    const digits = term.replace(/\D/g, '');
    const ors = [`customer_name.ilike.%${term}%`, `reference.ilike.%${term.replace(/^#/, '')}%`];
    if (digits.length >= 4) ors.push(`phone.ilike.%${digits}%`);
    query = query.or(ors.join(','));
  }

  // One small query for the tab counts instead of one request per status.
  const [{ data: orders, count }, { data: statuses }] = await Promise.all([query, db.from('orders').select('status')]);
  const counts = Object.fromEntries(ORDER_STATUSES.map(s => [s, 0])) as Record<string, number>;
  for (const r of statuses ?? []) counts[r.status] = (counts[r.status] ?? 0) + 1;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE));
  const link = (p: Record<string, string>) => `/admin/orders?${new URLSearchParams({ ...(status !== 'all' ? { status } : {}), ...(q ? { q } : {}), ...p })}`;

  return (
    <>
      <PageHeader title="Orders" subtitle={`${total} orders in total`} />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
        {[['all', 'All', total] as const, ...ORDER_STATUSES.map(s => [s, STATUS_LABEL[s], counts[s]] as const)].map(([key, label, n]) => (
          <Link
            key={key}
            href={`/admin/orders?${new URLSearchParams({ ...(key !== 'all' ? { status: key } : {}), ...(q ? { q } : {}) })}`}
            className={`flex-shrink-0 rounded-full px-3.5 min-h-[36px] inline-flex items-center gap-1.5 text-sm font-bold border ${status === key ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
          >
            {label} <span className={`text-xs ${status === key ? 'text-white/70' : 'text-gray-400'}`}>{n}</span>
          </Link>
        ))}
      </div>

      <form className="flex gap-2 mb-4" action="/admin/orders">
        {status !== 'all' && <input type="hidden" name="status" value={status} />}
        <input name="q" defaultValue={q} placeholder="Search name, phone or order number" className={inputCls} />
        <button className={btnSecondary}>Search</button>
      </form>

      <Card>
        {orders?.length ? (
          <>
            <table className="w-full text-sm hidden md:table">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="px-5 py-3 font-bold">Order</th>
                  <th className="px-3 py-3 font-bold">Customer</th>
                  <th className="px-3 py-3 font-bold">Products</th>
                  <th className="px-3 py-3 font-bold text-right">Total</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-extrabold text-brand-navy hover:text-brand-magenta">#{o.reference}</Link>
                      <p className="text-xs text-gray-500">{shortDate(o.created_at)}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-bold">{o.customer_name}</p>
                      <p className="text-xs text-gray-500">{phoneDisplay(o.phone)}{o.city ? ` · ${o.city}` : ''}</p>
                    </td>
                    <td className="px-3 py-3 text-gray-600 text-xs max-w-[260px]">{itemSummary(o.order_items)}</td>
                    <td className="px-3 py-3 text-right font-extrabold tabular-nums">{rupees(o.grand_total)}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="md:hidden divide-y divide-gray-100">
              {orders.map(o => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="block px-4 py-3 active:bg-gray-50">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-extrabold text-brand-navy">#{o.reference}</p>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-sm font-bold truncate">{o.customer_name} <span className="text-gray-400 font-medium">· {phoneDisplay(o.phone)}</span></p>
                      <p className="font-extrabold text-sm tabular-nums">{rupees(o.grand_total)}</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">{itemSummary(o.order_items)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{shortDate(o.created_at)}{o.city ? ` · ${o.city}` : ''}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState title={q || status !== 'all' ? 'No orders match' : 'No orders yet'} text={q || status !== 'all' ? 'Try a different search or status.' : 'Orders placed on the website appear here instantly.'} />
        )}
      </Card>

      {pages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          {pageNo > 1 ? <Link href={link({ page: String(pageNo - 1) })} className={btnSecondary}>← Newer</Link> : <span />}
          <span className="text-gray-500">Page {pageNo} of {pages}</span>
          {pageNo < pages ? <Link href={link({ page: String(pageNo + 1) })} className={btnSecondary}>Older →</Link> : <span />}
        </div>
      )}
    </>
  );
}
