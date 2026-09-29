import { Sparkles } from 'lucide-react';
import { CATEGORY_COLORS } from '../../constants';
import { CatalogProduct, ownPhoto, thumb } from '../../lib/catalog';

type Props = {
  product: CatalogProduct;
  size?: 'sm' | 'lg';
  className?: string;
};

/**
 * Product photo when we have one for this exact SKU, otherwise a category-
 * coloured tile — never a photo of a different product.
 */
export default function ProductThumb({ product, size = 'sm', className = '' }: Props) {
  const photo = ownPhoto(product);
  const base = size === 'sm' ? 'w-11 h-11 rounded-lg' : 'w-full aspect-square rounded-xl';

  if (photo) {
    return (
      <img
        src={size === 'sm' ? thumb(photo) : photo}
        alt={product.name}
        loading="lazy"
        decoding="async"
        width={size === 'sm' ? 44 : undefined}
        height={size === 'sm' ? 44 : undefined}
        className={`${base} object-cover flex-shrink-0 border border-gray-100 bg-gray-50 ${className}`}
      />
    );
  }

  const color = CATEGORY_COLORS[product.categoryId] || 'bg-gray-600';
  return (
    <div
      aria-hidden="true"
      className={`${base} ${color} flex-shrink-0 flex items-center justify-center text-white relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
      {size === 'sm' ? (
        <span className="relative font-black text-xs leading-none" title={`Catalog no. ${product.code}`}>{product.code}</span>
      ) : (
        <div className="relative flex flex-col items-center gap-2 px-3 text-center">
          <Sparkles size={28} className="opacity-90" />
          <span className="font-black text-xs uppercase tracking-wide leading-tight line-clamp-2">{product.name}</span>
        </div>
      )}
    </div>
  );
}
