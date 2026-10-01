'use client';

import Link from 'next/link';
import { useCatalog } from '../../context/ShopContext';

/** Desktop category list with item counts; the active category is highlighted. */
export default function CategorySidebar({ selectedId }: { selectedId?: number }) {
  const { categories, allProducts } = useCatalog();
  const item = (active: boolean) =>
    `flex items-center justify-between gap-2 rounded-xl px-3 min-h-[42px] text-sm font-bold transition-colors ${
      active ? 'bg-brand-navy text-white shadow' : 'text-gray-700 hover:bg-brand-cream hover:text-brand-navy'
    }`;

  return (
    <nav aria-label="Categories" className="card p-3 sticky top-[calc(var(--header-h,96px)+16px)] max-h-[calc(100vh-var(--header-h,96px)-32px)] overflow-y-auto">
      <p className="px-3 pt-1 pb-2 text-[11px] font-black uppercase tracking-[0.18em] text-brand-magenta">Category</p>
      <ul className="space-y-0.5">
        <li>
          <Link href="/store" className={item(selectedId === undefined)} aria-current={selectedId === undefined ? 'page' : undefined}>
            All crackers <span className={`text-xs ${selectedId === undefined ? 'text-white/70' : 'text-gray-400'}`}>{allProducts.length}</span>
          </Link>
        </li>
        {categories.map(c => {
          const active = c.id === selectedId;
          return (
            <li key={c.id}>
              <Link href={`/store/${c.slug}`} className={item(active)} aria-current={active ? 'page' : undefined}>
                <span className="capitalize leading-tight">{c.name.toLowerCase()}</span>
                <span className={`text-xs ${active ? 'text-white/70' : 'text-gray-400'}`}>{c.products.length}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
