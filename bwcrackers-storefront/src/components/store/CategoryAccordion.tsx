import { ChevronDown } from 'lucide-react';
import { CATEGORY_HEX } from '../../constants';
import { CatalogProduct } from '../../lib/catalog';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../lib/format';
import ProductRow from './ProductRow';
import ProductCard from './ProductCard';

type Props = {
  id: number;
  name: string;
  products: CatalogProduct[];
  view?: 'list' | 'grid';
  /** When set, the header toggles the product list open and closed. */
  collapsible?: boolean;
  open?: boolean;
  onToggle?: () => void;
};

export default function CategoryAccordion({ id, name, products, view = 'list', collapsible = false, open = true, onToggle }: Props) {
  const { cart } = useCart();
  const accent = CATEGORY_HEX[id] || '#57534e';
  const inCartCount = products.reduce((n, p) => n + (cart[p.code] ? 1 : 0), 0);
  const fromPrice = Math.min(...products.map(p => p.discountPrice));
  const expanded = !collapsible || open;
  const panelId = `cat-${id}-items`;

  const headerInner = (
    <>
      <span className="w-1.5 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: accent }} aria-hidden="true" />
      <span className="flex-1 min-w-0 text-left">
        <span className="block font-black text-sm md:text-base text-brand-navy uppercase tracking-wide leading-tight">{name}</span>
        <span className="block text-xs font-bold text-gray-500 mt-0.5">
          {products.length} {products.length === 1 ? 'item' : 'items'} · from {formatINR(fromPrice)}
        </span>
      </span>
      {inCartCount > 0 && (
        <span className="bg-brand-magenta/10 text-brand-magenta text-xs font-black px-2.5 py-1 rounded-full whitespace-nowrap">{inCartCount} in cart</span>
      )}
      {collapsible && (
        <ChevronDown size={20} className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
      )}
    </>
  );

  const headerCls = `flex items-center gap-3 w-full px-3 sm:px-4 py-3 min-h-[60px] ${expanded ? 'border-b border-gray-100' : ''}`;

  return (
    <section id={`cat-${id}`} className="card overflow-hidden">
      <h3 className="m-0">
        {collapsible ? (
          <button type="button" onClick={onToggle} aria-expanded={expanded} aria-controls={panelId} className={`${headerCls} hover:bg-gray-50/80 transition-colors`}>
            {headerInner}
          </button>
        ) : (
          <div className={headerCls}>{headerInner}</div>
        )}
      </h3>

      {expanded && (
        view === 'list' ? (
          <div id={panelId}>
            {products.map(p => (
              <ProductRow key={p.code} product={p} inCart={cart[p.code]} />
            ))}
          </div>
        ) : (
          <div id={panelId} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-3 bg-gray-50/60">
            {products.map(p => <ProductCard key={p.code} product={p} />)}
          </div>
        )
      )}
    </section>
  );
}
