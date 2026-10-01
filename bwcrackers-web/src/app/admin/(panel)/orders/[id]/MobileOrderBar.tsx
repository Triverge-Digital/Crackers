'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { setOrderStatus } from '@/admin/actions/orders';
import { OrderStatus, STATUS_LABEL } from '@/lib/orders';

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = { pending: 'confirmed', confirmed: 'paid', paid: 'packed', packed: 'dispatched', dispatched: 'delivered' };

/** Phones: the next step and the invoice always within thumb reach, above the bottom navigation. */
export default function MobileOrderBar({ orderId, status, invoiceUrl }: { orderId: string; status: string; invoiceUrl: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const next = NEXT[status as OrderStatus];
  return (
    <div className="lg:hidden print:hidden fixed inset-x-0 bottom-[calc(58px+env(safe-area-inset-bottom))] z-20 bg-white/95 backdrop-blur border-t border-gray-200 px-3 py-2 flex gap-2">
      <a href={invoiceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 px-3 min-h-[46px] text-sm font-bold text-gray-800">
        <FileText size={16} /> Invoice
      </a>
      {next ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => start(async () => { const r = await setOrderStatus(orderId, next); if (r.ok) router.refresh(); else alert(r.error); })}
          className="flex-1 rounded-xl bg-brand-magenta text-white font-bold text-sm min-h-[46px] disabled:opacity-60"
        >
          {pending ? 'Updating…' : `Mark as ${STATUS_LABEL[next]}`}
        </button>
      ) : (
        <p className="flex-1 self-center text-center text-sm font-bold text-gray-500">{STATUS_LABEL[status as OrderStatus] ?? status}</p>
      )}
    </div>
  );
}
