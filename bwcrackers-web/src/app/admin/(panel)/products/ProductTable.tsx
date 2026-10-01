'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { ImageOff, Pencil } from 'lucide-react';
import { quickUpdateProduct } from '@/admin/actions/catalog';
import { thumb } from '@/lib/catalog';

export type AdminProductRow = {
  id: number;
  code: string;
  name: string;
  unit: string;
  mrp: number;
  price: number;
  image_url: string | null;
  is_active: boolean;
  in_stock: boolean;
  category_id: number;
  category: string;
  sort_order: number;
};

function Toggle({ on, label, onChange, disabled }: { on: boolean; label: string; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full transition-colors disabled:opacity-50 ${on ? 'bg-green-500' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
    </button>
  );
}

function PriceInput({ value, label, onSave }: { value: number; label: string; onSave: (n: number) => void }) {
  const [v, setV] = useState(String(value));
  const commit = () => {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) { setV(String(value)); return; }
    if (n !== value) onSave(n);
  };
  return (
    <div className="relative">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">₹</span>
      <input
        aria-label={label}
        inputMode="decimal"
        value={v}
        onChange={e => setV(e.target.value.replace(/[^\d.]/g, ''))}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
        className="w-20 rounded-lg border border-gray-200 bg-white pl-5 pr-2 py-1.5 text-sm font-bold tabular-nums focus:outline-none focus:border-brand-magenta focus:ring-2 focus:ring-brand-magenta/20"
      />
    </div>
  );
}

export default function ProductTable({ rows: initial }: { rows: AdminProductRow[] }) {
  const [rows, setRows] = useState(initial);
  const [pending, start] = useTransition();
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  const update = (id: number, patch: Partial<AdminProductRow>) => {
    const before = rows;
    setRows(rs => rs.map(r => (r.id === id ? { ...r, ...patch } : r))); // optimistic
    start(async () => {
      const res = await quickUpdateProduct(id, patch);
      if (!res.ok) { setRows(before); setToast({ ok: false, text: res.error }); }
      else setToast({ ok: true, text: 'Saved — live on the website' });
      window.setTimeout(() => setToast(null), 2500);
    });
  };

  let lastCategory = '';
  return (
    <div className="relative">
      <ul className="divide-y divide-gray-100">
        {rows.map(p => {
          const header = p.category !== lastCategory ? (lastCategory = p.category) : null;
          const off = p.mrp > 0 ? Math.round((1 - p.price / p.mrp) * 100) : 0;
          return (
            <li key={p.id}>
              {header && <p className="px-4 sm:px-5 pt-4 pb-1 text-xs font-extrabold uppercase tracking-wider text-gray-400 bg-gray-50/60">{header}</p>}
              <div className={`flex flex-wrap sm:flex-nowrap items-center gap-3 px-4 sm:px-5 py-3 ${p.is_active ? '' : 'bg-gray-50'}`}>
                {p.image_url ? (
                  <img src={thumb(p.image_url)} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0" loading="lazy" />
                ) : (
                  <span className="w-12 h-12 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center flex-shrink-0" title="No photo"><ImageOff size={18} /></span>
                )}
                <div className="flex-1 min-w-[140px]">
                  <Link href={`/admin/products/${p.id}`} className="font-bold text-sm text-gray-900 hover:text-brand-magenta">{p.name}</Link>
                  <p className="text-xs text-gray-500">#{p.code} · {p.unit}{p.mrp > 0 ? ` · ${off}% off` : ''}{!p.is_active && <span className="ml-1 font-bold text-amber-700">· Hidden</span>}{!p.in_stock && <span className="ml-1 font-bold text-red-600">· Out of stock</span>}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 mb-0.5">MRP</p>
                    <PriceInput value={p.mrp} label={`${p.name} MRP`} onSave={n => update(p.id, { mrp: n })} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 mb-0.5">Price</p>
                    <PriceInput value={p.price} label={`${p.name} price`} onSave={n => update(p.id, { price: n })} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-gray-400">
                    Website
                    <Toggle on={p.is_active} label={`Show ${p.name} on website`} disabled={pending} onChange={() => update(p.id, { is_active: !p.is_active })} />
                  </label>
                  <label className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-gray-400">
                    In stock
                    <Toggle on={p.in_stock} label={`${p.name} in stock`} disabled={pending} onChange={() => update(p.id, { in_stock: !p.in_stock })} />
                  </label>
                  <Link href={`/admin/products/${p.id}`} aria-label={`Edit ${p.name}`} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-navy"><Pencil size={18} /></Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {toast && (
        <div className={`fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl px-4 py-2.5 text-sm font-bold shadow-lg ${toast.ok ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'}`} role="status">
          {toast.text}
        </div>
      )}
    </div>
  );
}
