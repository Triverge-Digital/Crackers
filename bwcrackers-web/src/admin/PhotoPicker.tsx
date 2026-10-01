'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { listPhotos, uploadPhoto, type LibraryPhoto } from './actions/catalog';
import { thumb } from '@/lib/catalog';
import { btnPrimary, btnSecondary } from './ui';

/** Modal to upload a new photo or pick one already in storage (library, catalog or earlier uploads). */
export default function PhotoPicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [photos, setPhotos] = useState<LibraryPhoto[] | null>(null);
  const [filter, setFilter] = useState<'unused' | 'all'>('unused');
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listPhotos().then(r => (r.ok ? setPhotos(r.data ?? []) : setError(r.error)));
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const upload = (file: File) =>
    start(async () => {
      const fd = new FormData();
      fd.set('file', file);
      const r = await uploadPhoto(fd);
      if (r.ok && r.data) onPick(r.data.url);
      else setError(r.ok ? 'Upload failed' : r.error);
    });

  const shown = (photos ?? []).filter(p => filter === 'all' || !p.usedBy);

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true" aria-label="Choose a photo">
      <div className="bg-white w-full sm:max-w-3xl rounded-t-3xl sm:rounded-3xl max-h-[90dvh] flex flex-col">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-brand-navy">Choose a photo</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 rounded-lg hover:bg-gray-100"><X size={20} /></button>
        </div>
        <div className="px-5 py-3 flex flex-wrap items-center gap-2 border-b border-gray-100">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); }} />
          <button type="button" disabled={pending} onClick={() => fileRef.current?.click()} className={btnPrimary}>
            <Upload size={16} /> {pending ? 'Uploading…' : 'Upload new photo'}
          </button>
          <div className="ml-auto flex rounded-xl border border-gray-200 overflow-hidden text-sm font-bold">
            {(['unused', 'all'] as const).map(f => (
              <button key={f} type="button" onClick={() => setFilter(f)} className={`px-3 min-h-[38px] ${filter === f ? 'bg-brand-navy text-white' : 'text-gray-600'}`}>
                {f === 'unused' ? 'Not used yet' : 'All photos'}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="px-5 pt-3 text-sm font-bold text-red-700">{error}</p>}
        <div className="overflow-y-auto p-5">
          {!photos ? (
            <p className="text-sm text-gray-500">Loading photos…</p>
          ) : shown.length === 0 ? (
            <p className="text-sm text-gray-500">No photos here. Upload one, or switch to “All photos”.</p>
          ) : (
            <ul className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {shown.map(p => (
                <li key={p.path}>
                  <button type="button" onClick={() => onPick(p.url)} className="group block w-full text-left">
                    <span className="relative block aspect-square rounded-xl overflow-hidden border border-gray-200 group-hover:border-brand-magenta">
                      <img src={thumb(p.url)} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                      <span className="absolute inset-0 bg-brand-magenta/0 group-hover:bg-brand-magenta/20 flex items-center justify-center">
                        <Check className="text-white opacity-0 group-hover:opacity-100" />
                      </span>
                    </span>
                    <span className="block text-[11px] text-gray-500 mt-1 truncate">{p.usedBy ?? p.name.replace(/^.*--/, '').replace(/-/g, ' ')}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
          <button type="button" onClick={onClose} className={btnSecondary}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
