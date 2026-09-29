import { CheckCircle2 } from 'lucide-react';
import { MIN_ORDER } from '../../constants';
import { useCart } from '../../context/CartContext';
import { formatINR, pluralize } from '../../lib/format';

export default function OrderProgress({ compact = false }: { compact?: boolean }) {
  const { totals } = useCart();
  if (totals.count === 0 && compact) return null;

  return (
    <div className={`card ${compact ? 'px-4 py-2.5' : 'px-5 py-4'}`} aria-live="polite">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
          {totals.count ? `Your order · ${pluralize(totals.count, 'item')}` : 'Your order'}
        </span>
        <span className={`font-black ${compact ? 'text-base' : 'text-lg'} ${totals.meetsMinimum ? 'text-green-600' : 'text-brand-navy'}`}>
          {formatINR(totals.subtotal)}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={MIN_ORDER} aria-valuenow={Math.min(totals.subtotal, MIN_ORDER)} aria-label="Progress towards minimum order">
        <div className={`h-full rounded-full transition-all duration-500 ${totals.meetsMinimum ? 'bg-green-500' : 'bg-brand-magenta'}`} style={{ width: `${totals.progress}%` }} />
      </div>
      <p className="text-xs mt-1.5 font-bold text-gray-500 flex items-center gap-1.5">
        {totals.meetsMinimum ? (
          <><CheckCircle2 size={14} className="text-green-600" /> Minimum order reached — you can place your order.</>
        ) : totals.count ? (
          <>Add {formatINR(totals.remaining)} more to reach the {formatINR(MIN_ORDER)} minimum order.</>
        ) : (
          <>Minimum order {formatINR(MIN_ORDER)} · Tap + on any item to start.</>
        )}
      </p>
    </div>
  );
}
