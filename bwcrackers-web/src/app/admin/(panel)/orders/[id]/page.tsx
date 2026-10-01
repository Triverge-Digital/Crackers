import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FileText, ImageOff, MapPin, MessageCircle, Phone } from 'lucide-react';
import { requireAdmin } from '@/admin/auth';
import { Card, PageHeader, StatusBadge, btnSecondary, phoneDisplay, rupees, shortDate } from '@/admin/ui';
import { normalizeSettings } from '@/lib/settings';
import { thumb } from '@/lib/catalog';
import { STATUS_LABEL, OrderStatus } from '@/lib/orders';
import OrderActions from './OrderActions';
import PrintButton from './PrintButton';
import MobileOrderBar from './MobileOrderBar';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata() {
  return { title: 'Order' };
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const { db } = await requireAdmin();
  const [{ data: order }, { data: items }, { data: events }, { data: settingsRow }] = await Promise.all([
    db.from('orders').select('*').eq('id', id).maybeSingle(),
    db.from('order_items').select('id, code, name, unit, price, mrp, quantity, line_total, product_id, products(image_url)').eq('order_id', id).order('id'),
    db.from('order_events').select('id, status, note, created_at').eq('order_id', id).order('created_at', { ascending: false }),
    db.from('settings').select('data').eq('id', 1).maybeSingle(),
  ]);
  if (!order) notFound();
  const settings = normalizeSettings(settingsRow?.data);
  const address = [order.address, order.city, order.state, order.pincode].filter(Boolean).join(', ');
  const total = Number(order.grand_total);
  const paid = Number(order.amount_paid);
  const due = Math.max(0, total - paid);
  const units = (items ?? []).reduce((n, i) => n + i.quantity, 0);
  const invoiceUrl = `/admin/orders/${order.id}/invoice`;
  const waLink = `https://wa.me/${order.phone.replace(/\D/g, '')}`;

  return (
    <>
      <PageHeader
        back={{ href: '/admin/orders', label: 'Orders' }}
        title={`Order #${order.reference}`}
        subtitle={<span className="inline-flex flex-wrap items-center gap-2">Placed {shortDate(order.created_at)} <StatusBadge status={order.status} /></span>}
        actions={
          <div className="hidden sm:flex gap-2 print:hidden">
            <a href={invoiceUrl} target="_blank" rel="noopener noreferrer" className={btnSecondary}><FileText size={16} /> Invoice PDF</a>
            <PrintButton />
          </div>
        }
      />

      {/* At-a-glance summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          ['Total', rupees(total), 'text-brand-navy'],
          ['Received', rupees(paid), 'text-green-700'],
          ['Balance', rupees(due), due > 0 ? 'text-amber-700' : 'text-gray-400'],
          ['Items', `${items?.length ?? 0} products · ${units} pcs`, 'text-brand-navy'],
        ].map(([label, value, cls]) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200/80 px-4 py-3">
            <p className="text-xs font-bold text-gray-500">{label}</p>
            <p className={`font-extrabold tabular-nums mt-0.5 ${label === 'Items' ? 'text-sm' : 'text-xl'} ${cls}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-4 items-start">
        <div className="space-y-4 min-w-0">
          {/* Customer */}
          <Card>
            <div className="px-4 sm:px-5 py-4 flex flex-wrap items-start gap-3">
              <span className="w-11 h-11 rounded-full bg-brand-navy/10 text-brand-navy font-extrabold flex items-center justify-center flex-shrink-0">{order.customer_name.slice(0, 1).toUpperCase()}</span>
              <div className="flex-1 min-w-[180px] text-sm">
                <p className="font-extrabold text-gray-900">
                  {order.customer_id ? <Link href={`/admin/customers/${order.customer_id}`} className="hover:text-brand-magenta">{order.customer_name}</Link> : order.customer_name}
                </p>
                <p className="text-gray-600">{phoneDisplay(order.phone)}{order.email ? ` · ${order.email}` : ''}</p>
                <p className="text-gray-600 flex gap-1.5 mt-0.5"><MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />{address}</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto print:hidden">
                <a href={`tel:${order.phone}`} className={`${btnSecondary} flex-1 sm:flex-none`}><Phone size={16} /> Call</a>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 min-h-[44px] text-sm font-bold text-white hover:bg-[#1fbf5a]"><MessageCircle size={16} /> WhatsApp</a>
              </div>
              {order.customer_notes && (
                <p className="w-full rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900"><span className="font-bold">Customer note:</span> {order.customer_notes}</p>
              )}
            </div>
          </Card>

          {/* Products ordered */}
          <Card title={`Products ordered (${items?.length ?? 0})`}>
            <ul className="divide-y divide-gray-100 mt-2">
              {items?.map(it => {
                const img = (it.products as unknown as { image_url: string | null } | null)?.image_url;
                const row = (
                  <>
                    {img ? (
                      <img src={thumb(img)} alt="" loading="lazy" className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                    ) : (
                      <span className="w-14 h-14 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center flex-shrink-0"><ImageOff size={18} /></span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900 leading-snug">{it.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">#{it.code} · {it.unit} · {rupees(it.price)} each{Number(it.mrp) > 0 && <span className="line-through ml-1">{rupees(it.mrp)}</span>}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-500">× {it.quantity}</p>
                      <p className="font-extrabold text-sm tabular-nums">{rupees(it.line_total)}</p>
                    </div>
                  </>
                );
                return (
                  <li key={it.id}>
                    {it.product_id ? (
                      <Link href={`/admin/products/${it.product_id}`} className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-gray-50">{row}</Link>
                    ) : (
                      <div className="flex items-center gap-3 px-4 sm:px-5 py-3">{row}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <dl className="border-t border-gray-100 px-4 sm:px-5 py-3 space-y-1.5 text-sm bg-gray-50 rounded-b-2xl">
              <div className="flex justify-between"><dt className="text-gray-600">MRP total</dt><dd className="tabular-nums text-gray-400 line-through">{rupees(order.mrp_total)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Items total</dt><dd className="font-bold tabular-nums">{rupees(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Packing fee</dt><dd className="font-bold tabular-nums">{rupees(order.packing_fee)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Transport</dt><dd className="text-gray-500 text-xs">Paid at parcel office</dd></div>
              <div className="flex justify-between text-base pt-1.5 border-t border-gray-200"><dt className="font-extrabold">Total</dt><dd className="font-extrabold tabular-nums">{rupees(total)}</dd></div>
            </dl>
          </Card>

          {/* History — desktop shows it here; phones see it at the very end */}
          <div className="hidden lg:block"><History events={events ?? []} /></div>
        </div>

        <div className="space-y-4">
          <OrderActions
            order={{
              id: order.id,
              reference: order.reference,
              status: order.status,
              phone: order.phone,
              customer_name: order.customer_name,
              grand_total: total,
              amount_paid: paid,
              transporter: order.transporter,
              tracking_number: order.tracking_number,
              admin_notes: order.admin_notes,
            }}
            payment={{ upi: settings.bank.upi, account: settings.bank.account, ifsc: settings.bank.ifsc, name: settings.bank.name, bank: settings.bank.bank }}
          />
          <div className="lg:hidden"><History events={events ?? []} /></div>
        </div>
      </div>

      <div className="h-16 lg:hidden" aria-hidden="true" />
      <MobileOrderBar orderId={order.id} status={order.status} invoiceUrl={invoiceUrl} />
    </>
  );
}

function History({ events }: { events: { id: number; status: string | null; note: string | null; created_at: string }[] }) {
  return (
    <Card title="History">
      <ol className="px-4 sm:px-5 py-3 space-y-3">
        {events.map(ev => (
          <li key={ev.id} className="flex gap-3 text-sm">
            <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-magenta flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900">{ev.status ? STATUS_LABEL[ev.status as OrderStatus] : 'Note'}{ev.note ? <span className="font-medium text-gray-600"> — {ev.note}</span> : null}</p>
              <p className="text-xs text-gray-500">{shortDate(ev.created_at)}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
