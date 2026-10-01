'use client';

import { formatINR } from '../../lib/format';

type Props = { price: number; mrp: number; size?: 'sm' | 'md' | 'lg'; align?: 'left' | 'right' };

export default function PriceTag({ price, mrp, size = 'md', align = 'right' }: Props) {
  const priceCls = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <p className={`font-black text-brand-navy leading-none ${priceCls}`}>{formatINR(price)}</p>
      <p className="text-xs text-gray-400 line-through leading-none mt-1">
        <span className="sr-only">MRP </span>{formatINR(mrp)}
      </p>
    </div>
  );
}
