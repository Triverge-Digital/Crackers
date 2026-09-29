import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { DISCOUNT_PCT, MIN_ORDER } from '../../constants';
import { categories, allProducts, matchesSearch } from '../../lib/catalog';
import { formatINR } from '../../lib/format';
import { useCart } from '../../context/CartContext';
import CategoryAccordion from '../store/CategoryAccordion';
import CategoryPills from '../store/CategoryPills';
import SearchBox from '../store/SearchBox';
import OrderProgress from '../store/OrderProgress';
import { scrollToId } from '../ui/ScrollManager';
import WhatsAppIcon from '../icons/WhatsAppIcon';

const DEFAULT_OPEN = 3;

export default function PriceListSection() {
  const { totals, openCheckout } = useCart();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Set<number>>(() => new Set(categories.slice(0, DEFAULT_OPEN).map(c => c.id)));

  const grouped = useMemo(() => {
    const q = query.trim();
    return categories
      .map(cat => ({ ...cat, products: allProducts.filter(p => p.categoryId === cat.id && (!q || matchesSearch(p, q))) }))
      .filter(cat => cat.products.length > 0);
  }, [query]);

  const searching = query.trim().length > 0;
  const allOpen = grouped.every(c => open.has(c.id) || searching);

  const toggle = (id: number) => setOpen(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const jumpTo = (id: number | 'all') => {
    if (id === 'all') return;
    setOpen(prev => new Set(prev).add(id));
    window.setTimeout(() => scrollToId(`cat-${id}`), 30);
  };

  return (
    <section id="pricelist" className="bg-brand-cream py-10 px-3 md:px-6 scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <p className="eyebrow mb-2">2026 price list · 165 items</p>
          <h2 className="section-title">Full price list</h2>
          <p className="text-sm text-gray-600 font-medium mt-2">
            Every price already includes the <span className="text-brand-magenta font-black">{DISCOUNT_PCT}% discount</span> on MRP · Minimum order {formatINR(MIN_ORDER)}
          </p>
        </div>

        <div className="sticky top-[104px] z-30 -mx-3 md:-mx-6 px-3 md:px-6 py-3 bg-brand-cream/95 backdrop-blur-sm space-y-3 border-b border-brand-magenta/10">
          <SearchBox value={query} onChange={setQuery} />
          {!searching && <CategoryPills selected="all" showAll={false} onSelect={jumpTo} />}
          <OrderProgress compact />
        </div>

        <div className="flex items-center justify-between mt-4 mb-3 text-xs font-black text-gray-500">
          <span>{searching ? `${grouped.reduce((n, c) => n + c.products.length, 0)} results for "${query.trim()}"` : `${categories.length} categories`}</span>
          {!searching && (
            <button
              type="button"
              onClick={() => setOpen(allOpen ? new Set() : new Set(categories.map(c => c.id)))}
              className="inline-flex items-center gap-1 text-brand-navy hover:text-brand-magenta min-h-[36px] px-2 rounded-lg"
            >
              {allOpen ? <><ChevronsDownUp size={14} /> Collapse all</> : <><ChevronsUpDown size={14} /> Expand all</>}
            </button>
          )}
        </div>

        {grouped.length === 0 ? (
          <div className="card text-center py-14 px-6">
            <p className="font-black text-brand-navy">No products match "{query.trim()}"</p>
            <p className="text-sm text-gray-500 mt-1">Try "sparkler", "rocket", "flower pot", "bomb" or "gift box".</p>
            <button type="button" onClick={() => setQuery('')} className="btn-outline mt-4 min-h-[40px]">Clear search</button>
          </div>
        ) : (
          <div className="space-y-3">
            {grouped.map(cat => (
              <CategoryAccordion
                key={cat.id}
                id={cat.id}
                name={cat.name}
                products={cat.products}
                open={searching || open.has(cat.id)}
                onToggle={() => toggle(cat.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-8 bg-brand-navy rounded-3xl p-6 md:p-8 text-center text-white">
          <p className="font-black text-xl mb-1">Ready to order?</p>
          <p className="text-white/70 text-sm mb-5">
            {totals.meetsMinimum
              ? `Your order of ${formatINR(totals.subtotal)} is ready — place it now on WhatsApp.`
              : totals.count
                ? `Add ${formatINR(totals.remaining)} more to reach the ${formatINR(MIN_ORDER)} minimum.`
                : `Add items above, then place your order on WhatsApp. Pay only after we confirm.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button type="button" onClick={openCheckout} disabled={!totals.meetsMinimum} className="btn-whatsapp min-h-[50px] px-8">
              <WhatsAppIcon className="w-5 h-5" /> Place order
            </button>
            <Link to="/store" className="btn-ghost">Open full store view</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
