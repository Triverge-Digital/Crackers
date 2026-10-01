import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Phone } from 'lucide-react';
import { requireAdmin } from '@/admin/auth';
import { Card, PageHeader, StatusBadge, Stat, phoneDisplay, rupees, shortDate } from '@/admin/ui';
import CustomerForm from './CustomerForm';

export const metadata = { title: 'Customer' };

type Props = { params: Promise<{ id: string }> };

export default async function CustomerPage({ params }: Props) {
  const { id } = await params;
  const { db } = await requireAdmin();
  const [{ data: c }, { data: orders }] = await Promise.all([
    db.from('customers').select('*').eq('id', id).maybeSingle(),
    db.from('orders').select('id, reference, grand_total, status, created_at').eq('customer_id', id).order('created_at', { ascending: false }),
  ]);
  if (!c) notFound();
  const live = (orders ?? []).filter(o => o.status !== 'cancelled');
  const spent = live.reduce((s, o) => s + Number(o.grand_total), 0);
  const wa = `https://wa.me/${c.phone.replace(/\D/g, '')}`;

  return (
    <>
      <PageHeader
        back={{ href: '/admin/customers', label: 'Customers' }}
        title={c.name}
        subtitle={`${phoneDisplay(c.phone)} · customer since ${new Date(c.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`}
        actions={
          <>
            <a href={`tel:${c.phone}`} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 min-h-[44px] text-sm font-bold hover:bg-gray-50"><Phone size={16} /> Call</a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 min-h-[44px] text-sm font-bold text-white hover:bg-[#1fbf5a]">WhatsApp</a>
          </>
        }
      />
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Stat label="Orders" value={orders?.length ?? 0} />
        <Stat label="Total spent" value={rupees(spent)} />
        <Stat label="Average order" value={rupees(live.length ? spent / live.length : 0)} />
      </div>
      <div className="grid lg:grid-cols-[1fr_360px] gap-4 items-start">
        <Card title="Orders">
          {orders?.length ? (
            <ul className="divide-y divide-gray-100 mt-2">
              {orders.map(o => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="font-bold text-sm text-brand-navy">#{o.reference}</p>
                      <p className="text-xs text-gray-500">{shortDate(o.created_at)}</p>
                    </div>
                    <p className="font-extrabold text-sm tabular-nums">{rupees(o.grand_total)}</p>
                    <StatusBadge status={o.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-6 text-sm text-gray-500">No orders yet.</p>
          )}
        </Card>
        <CustomerForm customer={{ id: c.id, name: c.name, email: c.email ?? '', address: c.address ?? '', city: c.city ?? '', state: c.state ?? '', pincode: c.pincode ?? '', admin_notes: c.admin_notes ?? '' }} />
      </div>
    </>
  );
}
