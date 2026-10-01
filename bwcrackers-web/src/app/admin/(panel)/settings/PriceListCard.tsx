'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPriceListUpload, setPriceList } from '@/admin/actions/settings';
import { BUNDLED_PRICE_LIST, type ShopSettings } from '@/lib/settings';
import { SUPABASE_ANON_KEY } from '@/lib/supabase/env';
import { Card, btnPrimary } from '@/admin/ui';

const MAX_MB = 45; // Supabase free plan accepts files up to 50 MB

/** PUT the file to the signed Storage URL, reporting progress as 0–100. */
function sendFile(url: string, file: File, onProgress: (pct: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('apikey', SUPABASE_ANON_KEY);
    xhr.setRequestHeader('authorization', `Bearer ${SUPABASE_ANON_KEY}`);
    xhr.setRequestHeader('content-type', 'application/pdf');
    xhr.setRequestHeader('cache-control', 'max-age=31536000');
    xhr.upload.onprogress = e => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status}). Please try again.`)));
    xhr.onerror = () => reject(new Error('Upload failed — check your internet connection and try again.'));
    xhr.send(file);
  });
}

export default function PriceListCard({ priceList }: { priceList: ShopSettings['priceList'] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const busy = progress !== null;

  async function upload(file: File) {
    setMsg(null);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return setMsg({ ok: false, text: 'Please choose a PDF file.' });
    if (file.size > MAX_MB * 1024 * 1024) return setMsg({ ok: false, text: `This PDF is ${(file.size / 1048576).toFixed(0)} MB. Please keep it under ${MAX_MB} MB.` });

    setProgress(0);
    try {
      const link = await createPriceListUpload();
      if (!link.ok) throw new Error(link.error);
      await sendFile(link.signedUrl, file, setProgress);
      const saved = await setPriceList(link.path, file.name);
      if (!saved.ok) throw new Error(saved.error);
      setMsg({ ok: true, text: 'New price list is live on the website' });
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setProgress(null);
      if (input.current) input.current.value = '';
    }
  }

  async function reset() {
    if (!confirm('Remove the uploaded PDF and go back to the original price list?')) return;
    setMsg(null);
    setProgress(0);
    const r = await setPriceList(null);
    setProgress(null);
    setMsg(r.ok ? { ok: true, text: 'Website is using the original price list again' } : { ok: false, text: r.error });
    if (r.ok) router.refresh();
  }

  const updated = priceList?.updatedAt ? new Date(priceList.updatedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : null;

  return (
    <Card title="Price list PDF" className="max-w-3xl mb-4">
      <div className="px-4 sm:px-5 py-4 space-y-3">
        <p className="text-xs text-gray-500">This is the file customers get when they tap “Price list” at the top of the website.</p>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-50 text-[11px] font-extrabold text-red-600">PDF</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-gray-800">{priceList ? priceList.name : 'Original price list (2026)'}</p>
            <p className="text-xs text-gray-500">{priceList ? `Uploaded ${updated ?? ''}` : 'Built into the website — upload a PDF to replace it'}</p>
          </div>
          <a href={priceList?.url ?? BUNDLED_PRICE_LIST} target="_blank" rel="noreferrer" className="shrink-0 text-sm font-bold text-brand-magenta hover:underline">View</a>
        </div>

        {busy && (
          <div aria-live="polite">
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full bg-brand-magenta transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-gray-500">{progress! < 100 ? `Uploading… ${progress}%` : 'Finishing…'} Keep this page open.</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <input ref={input} type="file" accept="application/pdf,.pdf" className="hidden" onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />
          <button type="button" disabled={busy} onClick={() => input.current?.click()} className={btnPrimary}>{priceList ? 'Upload a new PDF' : 'Upload PDF'}</button>
          {priceList && <button type="button" disabled={busy} onClick={reset} className="text-sm font-bold text-gray-500 hover:text-red-600 disabled:opacity-50">Use original</button>}
          {msg && <p className={`text-sm font-bold ${msg.ok ? 'text-green-700' : 'text-red-700'}`} role="status">{msg.text}</p>}
        </div>
      </div>
    </Card>
  );
}
