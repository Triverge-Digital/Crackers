import { CatalogProduct } from '../../lib/catalog';
import ProductThumb from '../ui/ProductThumb';
import PriceTag from '../ui/PriceTag';
import QtyControl from '../ui/QtyControl';

export default function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="p-2 pb-0">
        <ProductThumb product={product} size="lg" />
      </div>
      <div className="p-3 flex-1 flex flex-col gap-2">
        <div>
          <h3 className="font-black text-sm text-brand-navy leading-tight">{product.name}</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {product.unit}
            {product.isPremium && <span className="ml-2 text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-px rounded-full text-[11px] font-black uppercase">Premium</span>}
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2">
          <PriceTag price={product.discountPrice} mrp={product.mrp} align="left" />
          <QtyControl product={product} />
        </div>
      </div>
    </div>
  );
}
