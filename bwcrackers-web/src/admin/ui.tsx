// Small UI kit for the admin panel: calm greys, brand navy/magenta accents,
// large touch targets so it works well on a phone at the counter.
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ORDER_STATUSES, OrderStatus, STATUS_LABEL, STATUS_STYLE } from '@/lib/orders';

export function PageHeader({ title, subtitle, actions, back }: { title: string; subtitle?: ReactNode; actions?: ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-5">
      {back && (
        <Link href={back.href} className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-brand-navy mb-2">
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({ children, className = '', title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <section className={`bg-white rounded-2xl border border-gray-200/80 shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 pt-4">
          <h2 className="text-sm font-extrabold text-gray-800">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = (ORDER_STATUSES as readonly string[]).includes(status) ? (status as OrderStatus) : 'pending';
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${STATUS_STYLE[s]}`}>{STATUS_LABEL[s]}</span>;
}

export function Stat({ label, value, hint, href }: { label: string; value: ReactNode; hint?: string; href?: string }) {
  const body = (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 h-full hover:border-brand-magenta/40 transition-colors">
      <p className="text-xs font-bold text-gray-500">{label}</p>
      <p className="text-2xl font-extrabold text-brand-navy mt-1 tabular-nums">{value}</p>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="text-center py-14 px-6">
      <p className="font-extrabold text-gray-800">{title}</p>
      {text && <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export const inputCls =
  'w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-magenta focus:ring-2 focus:ring-brand-magenta/20 min-h-[44px] disabled:bg-gray-50';
export const labelCls = 'block text-xs font-bold text-gray-600 mb-1';
export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-brand-magenta px-4 min-h-[44px] text-sm font-bold text-white hover:bg-[#c9006e] disabled:opacity-50 transition-colors';
export const btnSecondary =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 min-h-[44px] text-sm font-bold text-gray-800 hover:bg-gray-50 disabled:opacity-50 transition-colors';
export const btnDanger =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 min-h-[44px] text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50 transition-colors';

export const rupees = (n: number | string | null | undefined) => `₹${Math.round(Number(n ?? 0)).toLocaleString('en-IN')}`;
export const shortDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true });
export const phoneDisplay = (p: string) => {
  const d = p.replace(/^\+91/, '');
  return d.length === 10 ? `${d.slice(0, 5)} ${d.slice(5)}` : p;
};
