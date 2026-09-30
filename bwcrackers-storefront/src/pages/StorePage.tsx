import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { categories, allProducts, findCategoryBySlug, matchesSearch } from '../lib/catalog';
import { useCart } from '../context/CartContext';
import { formatINR, pluralize } from '../lib/format';
import Seo from '../components/ui/Seo';
import CategoryAccordion from '../components/store/CategoryAccordion';
import CategoryPills from '../components/store/CategoryPills';
import SearchBox from '../components/store/SearchBox';
import WhatsAppIcon from '../components/icons/WhatsAppIcon';

type Sort = 'default' | 'price-asc' | 'price-desc';
type View = 'list' | 'grid';

export default function StorePage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { totals, openCheckout } = useCart();

  const selectedCategory = findCategoryBySlug(categorySlug);
  const query = params.get('q') ?? '';
  const sort = (params.get('sort') as Sort) || 'default';
  const [view, setView] = useState<View>(() => (window.localStorage.getItem('bw-view') as View) || 'list');

  useEffect(() => { window.localStorage.setItem('bw-view', view); }, [view]);

  // Unknown slug → back to the full store rather than a blank page.
  useEffect(() => {
    if (categorySlug && !selectedCategory) navigate('/store', { replace: true });
  }, [categorySlug, selectedCategory, navigate]);

  const setQuery = (q: string) => {
    const next = new URLSearchParams(params);
    if (q) next.set('q', q); else next.delete('q');
    setParams(next, { replace: true });
  };
  const setSort = (s: Sort) => {
    const next = new URLSearchParams(params);
    if (s === 'default') next.delete('sort'); else next.set('sort', s);
    setParams(next, { replace: true });
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
  }, [selectedCategory, query, sort]);

  const resultCount = grouped.reduce((n, c) => n + c.products.length, 0);
  const title = selectedCategory ? selectedCategory.name : 'Store';

  return (
    <div className="max-w-5xl mx-auto w-full px-3 md:px-6 pb-32 pt-4">
      <Seo
        title={selectedCategory ? `${selectedCategory.name} – 80% off` : 'Store – 2026 price list'}
        description={selectedCategory
          ? `${selectedCategory.name} from B&W Crackers Sivakasi at 80% off MRP. ${selectedCategory.products.length} items from ${formatINR(Math.min(...selectedCategory.products.map(p => p.discountPrice)))}.`
          : 'Browse all 165 items in the B&W Crackers 2026 price list. Every price is 80% off MRP. Order on WhatsApp, pay after confirmation.'}
      />

      <nav aria-label="Breadcrumb" className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5">
        <Link to="/" className="hover:text-brand-navy">Home</Link><span aria-hidden="true">/</span>
        {selectedCategory ? (<><Link to="/store" className="hover:text-brand-navy">Store</Link><span aria-hidden="true">/</span><span className="text-brand-navy">{selectedCategory.name}</span></>) : <span className="text-brand-navy">Store</span>}
      </nav>
      <h1 className="section-title mb-3">{title}</h1>

      <div data-sticky-toolbar className="sticky top-[var(--header-h,96px)] z-30 -mx-3 md:-mx-6 px-3 md:px-6 pt-3 pb-2 bg-brand-cream space-y-2 shadow-[0_8px_12px_-12px_rgba(26,26,78,0.35)]">
        <div className="flex gap-2">
          <div className="flex-1"><SearchBox value={query} onChange={setQuery} /></div>
          <div className="hidden sm:flex items-center card overflow-hidden" role="group" aria-label="View mode">
            <button type="button" onClick={() => setView('list')} aria-pressed={view === 'list'} aria-label="List view" className={`icon-btn rounded-none ${view === 'list' ? 'bg-brand-navy text-white' : 'text-gray-500 hover:text-brand-navy'}`}><List size={18} /></button>
            <button type="button" onClick={() => setView('grid')} aria-pressed={view === 'grid'} aria-label="Grid view" className={`icon-btn rounded-none ${view === 'grid' ? 'bg-brand-navy text-white' : 'text-gray-500 hover:text-brand-navy'}`}><LayoutGrid size={18} /></button>
          </div>
          <label className="card flex items-center gap-1.5 px-2 text-xs font-black text-gray-600 min-h-[44px]">
            <SlidersHorizontal size={14} aria-hidden="true" />
            <span className="sr-only">Sort</span>
            <select value={sort} onChange={e => setSort(e.target.value as Sort)} className="bg-transparent focus:outline-none pr-1 max-w-[110px]">
              <option value="default">Catalog order</option>
              <option value="price-asc">Price: low → high</option>
              <option value="price-desc">Price: high → low</option>
            </select>
          </label>
        </div>
        <CategoryPills
          selected={selectedCategory?.id ?? 'all'}
          onSelect={id => navigate(id === 'all' ? `/store${params.toString() ? `?${params}` : ''}` : `/store/${categories.find(c => c.id === id)!.slug}${params.toString() ? `?${params}` : ''}`)}
        />
      </div>

      <p className="text-xs font-black text-gray-500 mt-4 mb-3" aria-live="polite">
        {pluralize(resultCount, 'item')}{query.trim() ? ` for "${query.trim()}"` : ''}{selectedCategory ? ` in ${selectedCategory.name}` : ` across ${grouped.length} categories`}
      </p>

      {grouped.length === 0 ? (
        <div className="card text-center py-16 px-6">
          <p className="font-black text-brand-navy text-lg">Nothing matches "{query.trim()}"</p>
          <p className="text-sm text-gray-500 mt-1">Try "sparkler", "rocket", "flower pot", "bomb" or "gift box".</p>
          <div className="flex gap-3 justify-center mt-5">
            <button type="button" onClick={() => setQuery('')} className="btn-outline min-h-[40px]">Clear search</button>
            {selectedCategory && <Link to="/store" className="btn-navy min-h-[40px]">Search all categories</Link>}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(cat => (
            <CategoryAccordion
              key={cat.id}
              id={cat.id}
              name={cat.name}
              products={cat.products}
              view={view}
            />
          ))}
        </div>
      )}

      <div className="mt-8 card p-6 text-center">
        <p className="font-black text-brand-navy text-lg">
          {totals.count ? `${pluralize(totals.count, 'item')} · ${formatINR(totals.subtotal)}` : 'Your order is empty'}
        </p>
        <p className="text-sm text-gray-600 mt-1 mb-4">
          {totals.meetsMinimum ? 'Ready to place your order on WhatsApp.' : `Minimum order ${formatINR(totals.subtotal + totals.remaining)}${totals.count ? ` — add ${formatINR(totals.remaining)} more.` : '.'}`}
        </p>
        <button type="button" onClick={openCheckout} disabled={!totals.meetsMinimum} className="btn-whatsapp min-h-[50px] px-8">
          <WhatsAppIcon className="w-5 h-5" /> Place order
        </button>
      </div>
    </div>
  );
}
