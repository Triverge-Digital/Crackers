'use client';

import { memo } from 'react';
import { Minus, Plus, ShoppingCart, Sparkles } from 'lucide-react';
import { CatalogProduct, categoryAccent, thumb } from '@/lib/catalog';
import { useCartActions } from '../../context/CartContext';
import { formatINR } from '../../lib/format';

type Props = { product: CatalogProduct; qty: number; showCategory?: boolean };

/** Full-width add button that turns into a quantity stepper once the item is in the cart. */
function CartButton({ product, qty }: { product: CatalogProduct; qty: number }) {
  const { updateQty, setQty } = useCartActions();
  if (!product.inStock) {
    return <div className="w-full rounded-xl bg-gray-100 text-gray-500 text-sm font-bold min-h-[44px] flex items-center justify-center">Sold out</div>;
  }
  if (!qty) {
    return (
      <button
        type="button"
        onClick={() => updateQty(product.code, 1)}
        aria-label={`Add ${product.name} to cart`}
        className="w-full rounded-xl bg-brand-navy text-white text-sm font-black min-h-[44px] inline-flex items-center justify-center gap-2 hover:bg-brand-magenta active:scale-[0.98] transition-all"
      >
        <ShoppingCart size={16} strokeWidth={2.5} /> Add to cart
      </button>
    );
  }
  return (
    <div className="w-full flex items-center rounded-xl bg-brand-magenta text-white min-h-[44px] shadow-md shadow-brand-magenta/25" role="group" aria-label={`${product.name} quantity`}>
      <button type="button" onClick={() => updateQty(product.code, -1)} aria-label={qty === 1 ? `Remove ${product.name}` : `Decrease ${product.name}`} className="w-11 h-11 flex items-center justify-center rounded-l-xl hover:bg-white/10 active:scale-90 transition">
        <Minus size={16} strokeWidth={3} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={999}
        value={qty}
        aria-label={`${product.name} quantity`}
        onChange={e => setQty(product.code, Number(e.target.value) || 0)}
        onFocus={e => e.currentTarget.select()}
        className="flex-1 min-w-0 bg-transparent text-center text-sm font-black focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button type="button" onClick={() => updateQty(product.code, 1)} aria-label={`Increase ${product.name}`} className="w-11 h-11 flex items-center justify-center rounded-r-xl hover:bg-white/10 active:scale-90 transition">
        <Plus size={16} strokeWidth={3} />
      </button>
    </div>
  );
}

/** Store product card: big photo, discount badge, clear price and a one-tap add button. */
export default memo(function ProductCard({ product, qty, showCategory = true }: Props) {
  const off = product.mrp > product.discountPrice ? Math.round((1 - product.discountPrice / product.mrp) * 100) : 0;
  const save = product.mrp - product.discountPrice;
  const accent = categoryAccent(product.categoryId);

  return (
    <article className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-14px_rgba(26,26,78,0.35)] ${qty ? 'border-brand-magenta/40' : 'border-gray-100 shadow-card'}`}>
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-b from-brand-cream to-white">
        {product.image ? (
          <img
            src={product.image}
            srcSet={`${thumb(product.image)} 240w, ${product.image} 1000w`}
            sizes="(min-width: 1280px) 220px, (min-width: 768px) 30vw, 46vw"
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105 ${product.inStock ? '' : 'opacity-50 grayscale'}`}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center" style={{ color: accent, background: `radial-gradient(circle at 50% 40%, ${accent}1f, transparent 70%)` }}>
            <Sparkles size={34} strokeWidth={1.8} />
            <span className="font-black text-[11px] uppercase tracking-wider leading-tight line-clamp-2 opacity-80">{product.name}</span>
          </div>
        )}
        {off > 0 && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-brand-magenta text-white text-[11px] font-black px-2 py-0.5 shadow-md">-{off}%</span>
        )}
        {product.isPremium && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wide px-2 py-0.5 shadow">Premium</span>
        )}
        {qty > 0 && (
          <span className="absolute bottom-2.5 right-2.5 rounded-full bg-brand-navy text-white text-[11px] font-black px-2 py-0.5 shadow">{qty} in cart</span>
        )}
      </div>

      <div className="flex-1 flex flex-col p-3 sm:p-4">
        {showCategory && (
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider truncate" style={{ color: accent }}>{product.categoryName}</p>
        )}
        <h3 className="font-extrabold text-[13px] sm:text-[15px] text-brand-navy leading-snug mt-0.5 line-clamp-2 min-h-[2.5em]">{product.name}</h3>
        <div className="mt-2 flex items-baseline flex-wrap gap-x-2">
          <span className="text-xl sm:text-2xl font-black text-brand-magenta tabular-nums">{formatINR(product.discountPrice)}</span>
          {off > 0 && <span className="text-xs sm:text-sm text-gray-400 line-through tabular-nums"><span className="sr-only">MRP </span>{formatINR(product.mrp)}</span>}
        </div>
        <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
          per {product.unit.replace(/^1\s*/, '1 ').toLowerCase()}
          {save > 0 && <span className="text-green-700 font-bold"> · save {formatINR(save)}</span>}
        </p>
        <div className="mt-auto pt-3">
          <CartButton product={product} qty={qty} />
        </div>
      </div>
    </article>
  );
});
