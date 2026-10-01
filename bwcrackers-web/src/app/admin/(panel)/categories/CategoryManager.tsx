'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Check, Pencil, Trash2, X } from 'lucide-react';
import { deleteCategory, moveCategory, saveCategory } from '@/admin/actions/catalog';
import { btnPrimary, inputCls } from '@/admin/ui';

type Cat = { id: number; name: string; slug: string; is_active: boolean; total: number; visible: number };

export default function CategoryManager({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [newName, setNewName] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const run = (fn: () => Promise<{ ok: boolean; message?: string; error?: string }>, after?: () => void) =>
    start(async () => {
      const r = await fn();
      setMsg(r.ok ? (r.message ? { ok: true, text: r.message } : null) : { ok: false, text: r.error ?? 'Something went wrong' });
      if (r.ok) { after?.(); router.refresh(); }
    });

  return (
    <div>
      <form
        onSubmit={e => { e.preventDefault(); run(() => saveCategory(null, newName), () => setNewName('')); }}
        className="flex gap-2 p-4 sm:p-5 border-b border-gray-100"
      >
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New category name, e.g. Gift Boxes" className={inputCls} />
        <button type="submit" disabled={pending || !newName.trim()} className={btnPrimary}>Add</button>
      </form>
      {msg && <p className={`px-5 pt-3 text-sm font-bold ${msg.ok ? 'text-green-700' : 'text-red-700'}`} role="status">{msg.text}</p>}

      <ul className="divide-y divide-gray-100">
        {categories.map((c, i) => (
          <li key={c.id} className={`flex flex-wrap sm:flex-nowrap items-center gap-3 px-4 sm:px-5 py-3 ${c.is_active ? '' : 'bg-gray-50'}`}>
            <div className="flex flex-col">
              <button type="button" aria-label={`Move ${c.name} up`} disabled={pending || i === 0} onClick={() => run(() => moveCategory(c.id, -1))} className="p-1 rounded text-gray-400 hover:text-brand-navy disabled:opacity-30"><ArrowUp size={16} /></button>
              <button type="button" aria-label={`Move ${c.name} down`} disabled={pending || i === categories.length - 1} onClick={() => run(() => moveCategory(c.id, 1))} className="p-1 rounded text-gray-400 hover:text-brand-navy disabled:opacity-30"><ArrowDown size={16} /></button>
            </div>

            <div className="flex-1 min-w-[160px]">
              {editing === c.id ? (
                <div className="flex gap-2">
                  <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} className={inputCls} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); run(() => saveCategory(c.id, draft, c.is_active), () => setEditing(null)); } }} />
                  <button type="button" aria-label="Save name" onClick={() => run(() => saveCategory(c.id, draft, c.is_active), () => setEditing(null))} className="p-2 rounded-lg text-green-700 hover:bg-green-50"><Check size={18} /></button>
                  <button type="button" aria-label="Cancel" onClick={() => setEditing(null)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><X size={18} /></button>
                </div>
              ) : (
                <>
                  <p className="font-bold text-sm text-gray-900">{c.name}{!c.is_active && <span className="ml-2 text-xs font-bold text-amber-700">Hidden</span>}</p>
                  <p className="text-xs text-gray-500">
                    <Link href={`/admin/products?category=${c.id}`} className="hover:text-brand-magenta">{c.total} products · {c.visible} on website</Link>
                  </p>
                </>
              )}
            </div>

            {editing !== c.id && (
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => run(() => saveCategory(c.id, c.name, !c.is_active))} disabled={pending} className={`rounded-lg px-3 min-h-[36px] text-xs font-bold border ${c.is_active ? 'border-gray-200 text-gray-700 hover:bg-gray-50' : 'border-green-200 text-green-700 hover:bg-green-50'}`}>
                  {c.is_active ? 'Hide' : 'Show'}
                </button>
                <button type="button" aria-label={`Rename ${c.name}`} onClick={() => { setEditing(c.id); setDraft(c.name); }} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><Pencil size={16} /></button>
                <button
                  type="button"
                  aria-label={`Delete ${c.name}`}
                  disabled={pending}
                  onClick={() => { if (window.confirm(`Delete the category "${c.name}"?`)) run(() => deleteCategory(c.id)); }}
                  className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
