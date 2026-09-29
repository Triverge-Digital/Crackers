import { CATEGORY_COLORS } from '../../constants';
import { CatalogProduct } from '../../lib/catalog';
import { useCart } from '../../context/CartContext';
import ProductRow from './ProductRow';
import ProductCard from './ProductCard';

type Props = {
  id: number;
  name: string;
  products: CatalogProduct[];
  view?: 'list' | 'grid';
};

export default function CategoryAccordion({ id, name, products, view = 'list' }: Props) {
  const { cart } = useCart();
  const headerColor = CATEGORY_COLORS[id] || 'bg-gray-700';
  const inCartCount = products.reduce((n, p) => n + (cart[p.code] ? 1 : 0), 0);

  return (
    <section id={`cat-${id}`} className="card overflow-hidden scroll-mt-40">
      <h3 className={`flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 text-white ${headerColor} min-h-[52px] m-0`}>
        <span className="flex items-center gap-2.5 min-w-0 text-left">
          <span className="font-black text-sm md:text-base uppercase tracking-wide leading-tight">{name}</span>
          <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">{products.length} items</span>
          {inCartCount > 0 && (
            <span className="bg-white text-brand-navy text-xs font-black px-2 py-0.5 rounded-full whitespace-nowrap">{inCartCount} in cart</span>
          )}
        </span>
      </h3>

      {view === 'list' ? (
        <div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-3 sm:px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-black uppercase tracking-widest text-gray-500">
            <span>Product</span>
            <span className="text-right">Price</span>
            <span className="text-right pr-1">Qty</span>
          </div>
          {products.map((p, idx) => (
            <ProductRow key={p.code} product={p} striped={idx % 2 === 1} inCart={cart[p.code]} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-3 bg-gray-50/60">
          {products.map(p => <ProductCard key={p.code} product={p} />)}
        </div>
      )}
    </section>
  );
}
