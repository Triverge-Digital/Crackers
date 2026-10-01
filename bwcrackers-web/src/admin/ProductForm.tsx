'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Trash2, X, Star } from 'lucide-react';
import { saveProduct, deleteProduct } from './actions/catalog';
import PhotoPicker from './PhotoPicker';
import { Card, btnDanger, btnPrimary, btnSecondary, inputCls, labelCls } from './ui';

export type ProductFormValues = {
  id: number | null;
  code: string;
  name: string;
  category_id: number | '';
  unit: string;
  mrp: number;
  price: number;
  description: string;
  image_url: string;
  gallery: string[];
  is_active: boolean;
  in_stock: boolean;
  is_premium: boolean;
  sort_order: number;
};

const UNITS = ['1 PKT', '1 BOX', '1 BAG', '1 PCE'];

export default function ProductForm({ initial, categories, discountPct }: { initial: ProductFormValues; categories: { id: number; name: string }[]; discountPct: number }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [picker, setPicker] = useState<null | 'main' | 'gallery'>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const set = <K extends keyof ProductFormValues>(k: K, val: ProductFormValues[K]) => setV(prev => ({ ...prev, [k]: val }));

  const submit = (form: FormData) =>
    start(async () => {
      form.set('gallery', JSON.stringify(v.gallery));
      form.set('image_url', v.image_url);
      const r = await saveProduct(v.id, form);
      setMsg({ ok: r.ok, text: r.ok ? 'Saved — live on the website' : r.error });
      if (r.ok && !v.id && r.data) router.replace(`/admin/products/${r.data.id}`);
      else if (r.ok) router.refresh();
    });

  const remove = () => {
    if (!v.id || !window.confirm(`Delete "${v.name}"? Past orders keep their copy of it. To just take it off the website, switch off "Show on website" instead.`)) return;
    start(async () => {
      const r = await deleteProduct(v.id!);
      if (r.ok) router.replace('/admin/products');
      else setMsg({ ok: false, text: r.error });
    });
  };

  const off = v.mrp > 0 && v.price > 0 ? Math.round((1 - v.price / v.mrp) * 100) : null;

  return (
    <form action={submit} className="grid lg:grid-cols-[1fr_320px] gap-4 items-start">
      <div className="space-y-4">
        <Card title="Details">
          <div className="px-4 sm:px-5 py-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="name">Product name</label>
              <input id="name" name="name" required value={v.name} onChange={e => set('name', e.target.value)} className={inputCls} placeholder='e.g. 4" LAKSHMI' />
            </div>
            <div>
              <label className={labelCls} htmlFor="code">Price-list number</label>
              <input id="code" name="code" required value={v.code} onChange={e => set('code', e.target.value.toUpperCase())} className={inputCls} placeholder="e.g. 42 or GB1" />
            </div>
            <div>
              <label className={labelCls} htmlFor="category_id">Category</label>
              <select id="category_id" name="category_id" required value={v.category_id} onChange={e => set('category_id', Number(e.target.value))} className={inputCls}>
                <option value="">Choose…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="unit">Sold as</label>
              <input id="unit" name="unit" list="units" value={v.unit} onChange={e => set('unit', e.target.value.toUpperCase())} className={inputCls} />
              <datalist id="units">{UNITS.map(u => <option key={u} value={u} />)}</datalist>
            </div>
            <div>
              <label className={labelCls} htmlFor="sort_order">Position in category</label>
              <input id="sort_order" name="sort_order" type="number" min={0} value={v.sort_order} onChange={e => set('sort_order', Number(e.target.value))} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="description">Description (optional)</label>
              <textarea id="description" name="description" rows={3} value={v.description} onChange={e => set('description', e.target.value)} className={inputCls} placeholder="Effect, duration, pieces in the box…" />
            </div>
          </div>
        </Card>

        <Card title="Price">
          <div className="px-4 sm:px-5 py-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="mrp">MRP (printed price) ₹</label>
              <input id="mrp" name="mrp" type="number" min={0} step="1" inputMode="numeric" value={v.mrp || ''} onChange={e => set('mrp', Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="price">Selling price ₹</label>
              <input id="price" name="price" type="number" min={0} step="1" inputMode="numeric" value={v.price || ''} onChange={e => set('price', Number(e.target.value))} className={inputCls} />
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-2 text-sm">
              <button type="button" disabled={!v.mrp} onClick={() => set('price', Math.round(v.mrp * (1 - discountPct / 100)))} className={btnSecondary}>
                Set price to {discountPct}% off MRP
              </button>
              {off !== null && <span className="text-gray-500">Customer sees <span className="font-bold text-green-700">{off}% off</span></span>}
            </div>
          </div>
        </Card>

        <Card title="Photos">
          <div className="px-4 sm:px-5 py-4">
            <div className="flex flex-wrap gap-3">
              <div className="w-36">
                <p className={labelCls}>Main photo</p>
                {v.image_url ? (
                  <div className="relative">
                    <img src={v.image_url} alt="" className="w-36 h-36 rounded-2xl object-cover border border-gray-200" />
                    <button type="button" onClick={() => set('image_url', '')} aria-label="Remove main photo" className="absolute top-1.5 right-1.5 bg-white/90 rounded-full p-1 shadow"><X size={14} /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setPicker('main')} className="w-36 h-36 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-brand-magenta hover:text-brand-magenta flex flex-col items-center justify-center gap-1 text-xs font-bold">
                    <ImagePlus size={24} /> Add photo
                  </button>
                )}
                {v.image_url && <button type="button" onClick={() => setPicker('main')} className="mt-2 text-xs font-bold text-brand-magenta">Change</button>}
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className={labelCls}>More photos</p>
                <div className="flex flex-wrap gap-2">
                  {v.gallery.map(url => (
                    <div key={url} className="relative">
                      <img src={url} alt="" className="w-20 h-20 rounded-xl object-cover border border-gray-200" />
                      <div className="absolute inset-x-1 bottom-1 flex justify-between">
                        <button type="button" title="Make main photo" onClick={() => setV(p => ({ ...p, image_url: url, gallery: [...p.gallery.filter(g => g !== url), ...(p.image_url ? [p.image_url] : [])] }))} className="bg-white/90 rounded-full p-1 shadow"><Star size={12} /></button>
                        <button type="button" title="Remove" onClick={() => set('gallery', v.gallery.filter(g => g !== url))} className="bg-white/90 rounded-full p-1 shadow"><X size={12} /></button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => setPicker('gallery')} className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand-magenta hover:text-brand-magenta flex items-center justify-center" aria-label="Add another photo">
                    <ImagePlus size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4 lg:sticky lg:top-5">
        <Card title="Visibility">
          <div className="px-4 sm:px-5 py-4 space-y-3 text-sm">
            {([
              ['is_active', 'Show on website', 'Customers can see and order it'],
              ['in_stock', 'In stock', 'Switch off when sold out'],
              ['is_premium', 'Premium badge', 'Shows a "Premium" tag'],
            ] as const).map(([key, label, hint]) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" name={key} checked={v[key]} onChange={e => set(key, e.target.checked)} className="mt-0.5 h-5 w-5 rounded accent-brand-magenta" />
                <span><span className="font-bold text-gray-900">{label}</span><span className="block text-xs text-gray-500">{hint}</span></span>
              </label>
            ))}
          </div>
        </Card>

        <div className="space-y-2">
          <button type="submit" disabled={pending} className={`${btnPrimary} w-full`}>{pending ? 'Saving…' : v.id ? 'Save changes' : 'Create product'}</button>
          {msg && <p className={`text-sm font-bold text-center ${msg.ok ? 'text-green-700' : 'text-red-700'}`} role="status">{msg.text}</p>}
          {v.id && <button type="button" onClick={remove} disabled={pending} className={`${btnDanger} w-full`}><Trash2 size={16} /> Delete product</button>}
        </div>
      </div>

      {picker && (
        <PhotoPicker
          onClose={() => setPicker(null)}
          onPick={url => {
            if (picker === 'main') setV(p => ({ ...p, image_url: url, gallery: p.gallery.filter(g => g !== url) }));
            else setV(p => (p.gallery.includes(url) || p.image_url === url ? p : { ...p, gallery: [...p.gallery, url] }));
            setPicker(null);
          }}
        />
      )}
    </form>
  );
}
