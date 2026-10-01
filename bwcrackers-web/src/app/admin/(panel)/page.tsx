import Link from 'next/link';
import { requireAdmin } from '@/admin/auth';
import { Card, EmptyState, PageHeader, Stat, StatusBadge, phoneDisplay, rupees, shortDate } from '@/admin/ui';

export const metadata = { title: 'Dashboard' };

/** Start of "today" and of this month in India time, as UTC ISO strings. */
function istStarts() {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 3600_000);
  const day = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) - 5.5 * 3600_000);
  const month = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), 1) - 5.5 * 3600_000);
  return { today: day.toISOString(), month: month.toISOString() };
}

export default async function Dashboard() {
  const { db, adminName } = await requireAdmin();
  const { today, month } = istStarts();

  const [todayOrders, pending, monthOrders, customers, recent, hidden] = await Promise.all([
    db.from('orders').select('grand_total, status').gte('created_at', today),
    db.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('orders').select('grand_total, status').gte('created_at', month),
    db.from('customers').select('id', { count: 'exact', head: true }),
    db.from('orders').select('id, reference, customer_name, phone, grand_total, status, created_at').order('created_at', { ascending: false }).limit(8),
    db.from('products').select('id', { count: 'exact', head: true }).eq('is_active', false),
  ]);

  const live = (rows: { grand_total: number; status: string }[] | null) => (rows ?? []).filter(r => r.status !== 'cancelled');
  const todayLive = live(todayOrders.data);
  const monthLive = live(monthOrders.data);
  const sum = (rows: { grand_total: number }[]) => rows.reduce((s, r) => s + Number(r.grand_total), 0);

  return (
    <>
      <PageHeader title={`Hello, ${adminName.split(/[@\s]/)[0]}`} subtitle="Here's how the shop is doing" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Stat label="New orders to confirm" value={pending.count ?? 0} href="/admin/orders?status=pending" hint="Tap to see them" />
        <Stat label="Orders today" value={todayLive.length} hint={rupees(sum(todayLive))} />
        <Stat label="Sales this month" value={rupees(sum(monthLive))} hint={`${monthLive.length} orders`} />
        <Stat label="Customers" value={customers.count ?? 0} href="/admin/customers" />
      </div>

      {(hidden.count ?? 0) > 0 && (
        <Link href="/admin/products?show=hidden" className="block mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 hover:bg-amber-100">
          <span className="font-extrabold">{hidden.count} products are hidden from the website</span> — new items such as gift boxes and night packs need a price before you switch them on. <span className="font-bold underline">Review them</span>
        </Link>
      )}

      <Card title="Latest orders" action={<Link href="/admin/orders" className="text-sm font-bold text-brand-magenta">See all</Link>}>
        {recent.data?.length ? (
          <ul className="divide-y divide-gray-100 mt-2">
            {recent.data.map(o => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-gray-50">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-gray-900 truncate">{o.customer_name} <span className="text-gray-400 font-medium">· {phoneDisplay(o.phone)}</span></p>
                    <p className="text-xs text-gray-500">#{o.reference} · {shortDate(o.created_at)}</p>
                  </div>
                  <p className="font-extrabold text-sm tabular-nums">{rupees(o.grand_total)}</p>
                  <StatusBadge status={o.status} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No orders yet" text="Orders placed on the website appear here instantly." />
        )}
      </Card>
    </>
  );
}
