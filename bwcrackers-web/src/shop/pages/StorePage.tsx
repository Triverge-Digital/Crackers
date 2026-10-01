'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { matchesSearch } from '@/lib/catalog';
import { useCatalog, useShopConstants } from '../context/ShopContext';
import { useCart } from '../context/CartContext';
import { formatINR, pluralize } from '../lib/format';
import CategoryAccordion from '../components/store/CategoryAccordion';
import ProductCard from '../components/store/ProductCard';
import CategorySidebar from '../components/store/CategorySidebar';
import CategoryPills from '../components/store/CategoryPills';
import SearchBox from '../components/store/SearchBox';
import WhatsAppIcon from '../components/icons/WhatsAppIcon';

type Sort = 'default' | 'price-asc' | 'price-desc';
type View = 'list' | 'grid';

export default function StorePage({ categorySlug }: { categorySlug?: string }) {
  const { categories, allProducts, findCategoryBySlug } = useCatalog();
  const router = useRouter();
  const params = useSearchParams();
  // Search and sort live in the URL; replaceState updates it without a server round-trip per keystroke.
  const setParams = (next: URLSearchParams) => {
    const qs = next.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
  };
  const { cart, totals, openCheckout } = useCart();
  const { DISCOUNT_PCT, MIN_ORDER } = useShopConstants();

  const selectedCategory = findCategoryBySlug(categorySlug);
  // Category pages have no search box, so ignore any leftover ?q= from a shared link.
  const query = selectedCategory ? '' : params.get('q') ?? '';
  const sort = (params.get('sort') as Sort) || 'default';
  // Photo grid by default; list view stays one tap away for quick price-list browsing.
  const [view, setView] = useState<View>('grid');

  useEffect(() => {
    try { if (window.localStorage.getItem('bw-view') === 'list') setView('list'); } catch { /* storage blocked */ }
  }, []);
  const changeView = (v: View) => {
    setView(v);
    try { window.localStorage.setItem('bw-view', v); } catch { /* storage blocked */ }
  };

  const setQuery = (q: string) => {
    const next = new URLSearchParams(params);
    if (q) next.set('q', q); else next.delete('q');
    setParams(next);
  };
  const setSort = (s: Sort) => {
    const next = new URLSearchParams(params);
    if (s === 'default') next.delete('sort'); else next.set('sort', s);
    setParams(next);
  };

  const grouped = useMemo(() => {
    const q = query.trim();
    return categories
      .filter(cat => !selectedCategory || cat.id === selectedCategory.id)
      .map(cat => {
        const products = allProducts.filter(p => p.categoryId === cat.id && (!q || matchesSearch(p, q)));
        if (sort === 'price-asc') products.sort((a, b) => a.discountPrice - b.discountPrice);
        if (sort === 'price-desc') products.sort((a, b) => b.discountPrice - a.discountPrice);
        return { ...cat, products };
      })
      .filter(cat => cat.products.length > 0);
  }, [categories, allProducts, selectedCategory, query, sort]);

  const resultCount = grouped.reduce((n, c) => n + c.products.length, 0);
  const title = selectedCategory ? selectedCategory.name : 'Store';

  return (
    <div className="max-w-7xl mx-auto w-full px-3 md:px-6 pb-32 pt-4">
      <nav aria-label="Breadcrumb" className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-navy">Home</Link><span aria-hidden="true">/</span>
        {selectedCategory ? (<><Link href="/store" className="hover:text-brand-navy">Shop</Link><span aria-hidden="true">/</span><span className="text-brand-navy">{selectedCategory.name}</span></>) : <span className="text-brand-navy">Shop</span>}
      </nav>
      <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-brand-navy leading-none">{selectedCategory ? selectedCategory.name : 'All crackers'}</h1>
      <p className="text-sm text-gray-600 font-medium mt-2">
        {pluralize(selectedCategory ? selectedCategory.products.length : allProducts.length, 'product')} · flat {DISCOUNT_PCT}% off · minimum order {formatINR(MIN_ORDER)}
      </p>

      <div className="lg:grid lg:grid-cols-[250px_1fr] lg:gap-6 mt-5">
        <aside className="hidden lg:block"><CategorySidebar selectedId={selectedCategory?.id} /></aside>

        <div className="min-w-0">
          <div data-sticky-toolbar className={`sticky top-[var(--header-h,96px)] z-30 -mx-3 md:-mx-6 lg:mx-0 px-3 md:px-6 lg:px-0 pt-2 pb-2 bg-brand-cream space-y-2 ${selectedCategory ? 'lg:hidden' : ''}`}>
            {!selectedCategory && (
              <>
            <div className="flex gap-2">
              <div className="flex-1"><SearchBox value={query} onChange={setQuery} /></div>
              <div className="hidden sm:flex items-center card overflow-hidden" role="group" aria-label="View mode">
                <button type="button" onClick={() => changeView('grid')} aria-pressed={view === 'grid'} aria-label="Grid view" className={`icon-btn rounded-none ${view === 'grid' ? 'bg-brand-navy text-white' : 'text-gray-500 hover:text-brand-navy'}`}><LayoutGrid size={18} /></button>
                <button type="button" onClick={() => changeView('list')} aria-pressed={view === 'list'} aria-label="List view" className={`icon-btn rounded-none ${view === 'list' ? 'bg-brand-navy text-white' : 'text-gray-500 hover:text-brand-navy'}`}><List size={18} /></button>
              </div>
              <label className="card flex items-center gap-1.5 px-2 text-xs font-black text-gray-600 min-h-[44px]">
                <SlidersHorizontal size={14} aria-hidden="true" />
                <span className="sr-only">Sort</span>
                <select value={sort} onChange={e => setSort(e.target.value as Sort)} className="bg-transparent focus:outline-none pr-1 max-w-[110px]">
                  <option value="default">Popular</option>
                  <option value="price-asc">Price: low → high</option>
                  <option value="price-desc">Price: high → low</option>
                </select>
              </label>
            </div>
              </>
            )}
            <div className="lg:hidden">
              <CategoryPills
                selected={selectedCategory?.id ?? 'all'}
                onSelect={id => router.push(id === 'all' ? `/store${params.toString() ? `?${params}` : ''}` : `/store/${categories.find(c => c.id === id)!.slug}${params.toString() ? `?${params}` : ''}`)}
              />
            </div>
          </div>

          {query.trim() && (
            <p className="text-xs font-black text-gray-500 mt-3" aria-live="polite">
              {pluralize(resultCount, 'result')} for &ldquo;{query.trim()}&rdquo;{selectedCategory ? ` in ${selectedCategory.name.toLowerCase()}` : ''}
            </p>
          )}

          {grouped.length === 0 ? (
            <div className="card text-center py-16 px-6 mt-4">
              <p className="font-black text-brand-navy text-lg">Nothing matches &ldquo;{query.trim()}&rdquo;</p>
              <p className="text-sm text-gray-500 mt-1">Try sparkler, rocket, flower pot, bomb or gift box.</p>
              <div className="flex gap-3 justify-center mt-5">
                <button type="button" onClick={() => setQuery('')} className="btn-outline min-h-[40px]">Clear search</button>
                {selectedCategory && <Link href="/store" className="btn-navy min-h-[40px]">Search all categories</Link>}
              </div>
            </div>
          ) : view === 'list' && !selectedCategory ? (
            <div className="space-y-4 mt-4">
              {grouped.map(cat => (
                <CategoryAccordion key={cat.id} id={cat.id} name={cat.name} products={cat.products} view="list" />
              ))}
            </div>
          ) : selectedCategory ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-4">
              {grouped[0].products.map(p => <ProductCard key={p.code} product={p} qty={cart[p.code] || 0} showCategory={false} />)}
            </div>
          ) : (
            <div className="space-y-10 mt-4">
              {grouped.map(cat => (
                <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-40" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 900px' }}>
                  <div className="flex items-end justify-between gap-3 mb-3">
                    <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wide text-brand-navy leading-none">
                      {cat.name} <span className="font-sans text-xs font-bold text-gray-400 normal-case tracking-normal align-middle">{pluralize(cat.products.length, 'item')}</span>
                    </h2>
                    <Link href={`/store/${cat.slug}`} className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-black text-brand-magenta hover:underline">View all <ArrowRight size={14} /></Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {cat.products.map(p => <ProductCard key={p.code} product={p} qty={cart[p.code] || 0} showCategory={false} />)}
                  </div>
                </section>
              ))}
            </div>
          )}

            <div className="mt-10 card p-6 text-center">
              <p className="font-black text-brand-navy text-lg">
                {totals.count ? `${pluralize(totals.count, 'item')} · ${formatINR(totals.subtotal)}` : 'Your order is empty'}
              </p>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                {totals.meetsMinimum ? 'Ready to place your order.' : `Minimum order ${formatINR(totals.subtotal + totals.remaining)}${totals.count ? ` — add ${formatINR(totals.remaining)} more.` : '.'}`}
              </p>
              <button type="button" onClick={openCheckout} disabled={!totals.meetsMinimum} className="btn-primary min-h-[50px] px-8"> Place order
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
