import { Sparkles } from 'lucide-react';
import { CATEGORY_HEX } from '../../constants';
import { CatalogProduct, ownPhoto, thumb } from '../../lib/catalog';

type Props = {
  product: CatalogProduct;
  size?: 'sm' | 'lg';
  className?: string;
};

/**
 * Product photo when we have one for this exact SKU, otherwise a soft tile
 * tinted with the category accent — never a photo of a different product.
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

  const accent = CATEGORY_HEX[product.categoryId] || '#57534e';
  return (
    <div
      aria-hidden="true"
      title={`Catalog no. ${product.code}`}
      className={`${base} flex-shrink-0 flex items-center justify-center relative overflow-hidden border ${className}`}
      style={{ backgroundColor: `${accent}14`, borderColor: `${accent}26`, color: accent }}
    >
      {size === 'sm' ? (
        <Sparkles size={18} strokeWidth={2.25} />
      ) : (
        <div className="flex flex-col items-center gap-2 px-3 text-center">
          <Sparkles size={28} />
          <span className="font-black text-xs uppercase tracking-wide leading-tight line-clamp-2">{product.name}</span>
        </div>
      )}
    </div>
  );
}
