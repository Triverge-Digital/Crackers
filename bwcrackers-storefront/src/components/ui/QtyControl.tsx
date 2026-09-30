import { memo } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useCart, useCartActions } from '../../context/CartContext';
import { CatalogProduct } from '../../lib/catalog';

type Props = {
  product: Pick<CatalogProduct, 'code' | 'name'>;
  size?: 'md' | 'lg';
};

/** Add / increment / decrement control with 44px touch targets and labelled buttons. */
export default function QtyControl({ product, size = 'md' }: Props) {
  const { cart } = useCart();
  return <QtyStepper product={product} qty={cart[product.code] || 0} size={size} />;
}

/**
 * The control itself, driven by a `qty` prop. Long lists render this directly
 * so a tap only re-renders the row whose quantity changed.
 */
export const QtyStepper = memo(function QtyStepper({ product, qty, size = 'md' }: Props & { qty: number }) {
  const { updateQty, setQty } = useCartActions();
  const btn = size === 'lg' ? 'w-11 h-11' : 'w-10 h-10';
  const icon = size === 'lg' ? 18 : 16;

  if (!qty) {
    return (
      <button
        type="button"
        onClick={() => updateQty(product.code, 1)}
        aria-label={`Add ${product.name}`}
        className={`${btn} rounded-xl bg-brand-magenta text-white flex items-center justify-center shadow-md shadow-brand-magenta/25 hover:bg-[#c9006e] active:scale-90 transition-all`}
      >
        <Plus size={icon} strokeWidth={3} />
      </button>
    );
  }

  return (
    <div className="inline-flex items-center bg-brand-navy rounded-xl p-0.5 shadow-md" role="group" aria-label={`${product.name} quantity`}>
      <button
        type="button"
        onClick={() => updateQty(product.code, -1)}
        aria-label={qty === 1 ? `Remove ${product.name}` : `Decrease ${product.name} quantity`}
        className={`${btn} rounded-[10px] text-white/90 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all`}
      >
        <Minus size={icon} strokeWidth={3} />
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
        className="w-9 bg-transparent text-center text-sm font-black text-white focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => updateQty(product.code, 1)}
        aria-label={`Increase ${product.name} quantity`}
        className={`${btn} rounded-[10px] bg-brand-magenta text-white flex items-center justify-center hover:bg-[#c9006e] active:scale-90 transition-all`}
      >
        <Plus size={icon} strokeWidth={3} />
      </button>
    </div>
  );
});
