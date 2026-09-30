import { CatalogProduct } from '../../lib/catalog';
import ProductThumb from '../ui/ProductThumb';
import PriceTag from '../ui/PriceTag';
import QtyControl from '../ui/QtyControl';

type Props = { product: CatalogProduct; inCart?: number };

export default function ProductRow({ product, inCart }: Props) {
  return (
    <div
      className={`grid grid-cols-[1fr_auto_auto] gap-3 items-center px-3 sm:px-4 py-2.5 border-b border-gray-100 last:border-0 transition-colors ${
        inCart ? 'bg-brand-magenta/[0.04]' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <ProductThumb product={product} />
        <div className="min-w-0">
          <p className="font-bold text-[13px] sm:text-sm text-brand-navy leading-snug">{product.name}</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>{product.unit}</span>
            {product.isPremium && <span className="text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-px rounded-full text-[10px] font-black uppercase tracking-wide">Premium</span>}
          </p>
        </div>
      </div>
      <PriceTag price={product.discountPrice} mrp={product.mrp} size="sm" />
      <QtyControl product={product} />
    </div>
  );
}
