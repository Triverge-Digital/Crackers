import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR, pluralize } from '../../lib/format';
import WhatsAppIcon from '../icons/WhatsAppIcon';

/**
 * Single bottom action bar shown whenever the cart has items. Replaces the
 * separate floating pill + WhatsApp FAB that previously overlapped on mobile.
 */
export default function FloatingOrderBar() {
  const { totals, openCheckout, lastAdded } = useCart();
  const { pathname } = useLocation();
  const visible = totals.count > 0 && pathname !== '/cart' && pathname !== '/track';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed bottom-0 inset-x-0 z-50 px-3 pb-3 safe-bottom pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto max-w-lg bg-brand-navy text-white rounded-2xl shadow-float border border-white/10 flex items-center gap-3 pl-4 pr-2 py-2">
            <Link to="/cart" className="flex items-center gap-3 flex-1 min-w-0 rounded-lg" aria-label="View cart">
              <div className="relative">
                <ShoppingBag size={24} className="text-brand-gold" />
                <motion.span
                  key={totals.count}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-magenta text-[11px] font-black flex items-center justify-center"
                >
                  {totals.count}
                </motion.span>
              </div>
              <div className="min-w-0">
                <p className="font-black text-base leading-none tabular-nums">{formatINR(totals.subtotal)}</p>
                <p className="text-xs text-white/60 font-bold mt-0.5 truncate">
                  {lastAdded ? 'Added to order' : totals.meetsMinimum ? pluralize(totals.count, 'item') + ' · ready to order' : `Add ${formatINR(totals.remaining)} more for min. order`}
                </p>
              </div>
            </Link>

            {totals.meetsMinimum ? (
              <button type="button" onClick={openCheckout} className="btn-whatsapp min-h-[44px] px-4 text-xs sm:text-sm">
                <WhatsAppIcon className="w-4 h-4" /> Place order
              </button>
            ) : (
              <Link to="/cart" className="btn-ghost min-h-[44px] px-4 text-xs sm:text-sm">
                View cart <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
