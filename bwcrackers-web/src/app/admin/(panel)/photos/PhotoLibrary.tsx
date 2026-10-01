'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { assignPhoto, deletePhoto, listPhotos, uploadPhoto, type LibraryPhoto } from '@/admin/actions/catalog';
import { thumb } from '@/lib/catalog';
import { Card, btnPrimary, inputCls } from '@/admin/ui';

type ProductOption = { id: number; label: string; hasPhoto: boolean };

export default function PhotoLibrary({ products }: { products: ProductOption[] }) {
  const [photos, setPhotos] = useState<LibraryPhoto[] | null>(null);
  const [filter, setFilter] = useState<'unused' | 'all'>('unused');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => listPhotos().then(r => (r.ok ? setPhotos(r.data ?? []) : setMsg({ ok: false, text: r.error }))), []);
  useEffect(() => { load(); }, [load]);

  const act = (fn: () => Promise<{ ok: boolean; message?: string; error?: string }>) =>
    start(async () => {
      const r = await fn();
      setMsg({ ok: r.ok, text: r.ok ? r.message ?? 'Done' : r.error ?? 'Something went wrong' });
      if (r.ok) await load();
    });

  const shown = (photos ?? []).filter(p => filter === 'all' || !p.usedBy);
  const withoutPhoto = products.filter(p => !p.hasPhoto);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => {
            const files = Array.from(e.target.files ?? []);
            if (!files.length) return;
            act(async () => {
              for (const f of files) {
                const fd = new FormData();
                fd.set('file', f);
                fd.set('folder', 'library');
                const r = await uploadPhoto(fd);
                if (!r.ok) return r;
              }
              return { ok: true, message: `${files.length} photo${files.length > 1 ? 's' : ''} uploaded` };
            });
            e.target.value = '';
          }}
        />
        <button type="button" disabled={pending} onClick={() => fileRef.current?.click()} className={btnPrimary}><Upload size={16} /> {pending ? 'Working…' : 'Upload photos'}</button>
        <div className="ml-auto flex rounded-xl border border-gray-200 overflow-hidden text-sm font-bold bg-white">
          {(['unused', 'all'] as const).map(f => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`px-3 min-h-[40px] ${filter === f ? 'bg-brand-navy text-white' : 'text-gray-600'}`}>
              {f === 'unused' ? `Not used yet${photos ? ` (${photos.filter(p => !p.usedBy).length})` : ''}` : 'All photos'}
            </button>
          ))}
        </div>
      </div>
      {msg && <p className={`mb-3 text-sm font-bold ${msg.ok ? 'text-green-700' : 'text-red-700'}`} role="status">{msg.text}</p>}

      <Card>
        {!photos ? (
          <p className="p-5 text-sm text-gray-500">Loading photos…</p>
        ) : shown.length === 0 ? (
          <p className="p-5 text-sm text-gray-500">{filter === 'unused' ? 'Every photo is in use. Nice!' : 'No photos yet.'}</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 sm:p-5">
            {shown.map(p => (
              <li key={p.path} className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
                <img src={thumb(p.url)} alt={p.name} loading="lazy" className="w-full aspect-square object-cover" />
                <div className="p-2.5 space-y-2">
                  <p className="text-xs font-bold text-gray-700 truncate" title={p.name}>{p.usedBy ?? p.name.replace(/^.*--/, '').replace(/-/g, ' ')}</p>
                  {!p.usedBy && (
                    <>
                      <select
                        aria-label="Give this photo to a product"
                        defaultValue=""
                        disabled={pending}
                        onChange={e => { const id = Number(e.target.value); if (id) act(() => assignPhoto(id, p.url)); }}
                        className={`${inputCls} !min-h-[38px] !py-1.5 text-xs`}
                      >
                        <option value="">Use for product…</option>
                        {withoutPhoto.length > 0 && (
                          <optgroup label="Products without a photo">
                            {withoutPhoto.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                          </optgroup>
                        )}
                        <optgroup label="All products (replaces photo)">
                          {products.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                        </optgroup>
                      </select>
                      <button type="button" disabled={pending} onClick={() => { if (window.confirm('Delete this photo?')) act(() => deletePhoto(p.path)); }} className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-red-600 min-h-[32px] rounded-lg hover:bg-red-50">
                        <Trash2 size={13} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
