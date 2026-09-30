import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { WHATSAPP_LINK, CONTACT } from '../../constants';
import { useCart } from '../../context/CartContext';
import WhatsAppIcon from '../icons/WhatsAppIcon';

/** Chat FAB. Hidden while the order bar is showing — the bar has its own chat shortcut. */
export default function WhatsAppButton() {
  const { totals } = useCart();
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const barVisible = totals.count > 0 && pathname !== '/cart' && pathname !== '/track';
  // The cart page has its own pinned checkout bar on phones.
  const hideOnPhones = pathname === '/cart' && totals.count > 0;

  return (
    <AnimatePresence>
      {!barVisible && (
        <motion.a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat with us on WhatsApp: +91 ${CONTACT.primaryPhone}`}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className={`fixed right-4 bottom-5 z-[55] ${hideOnPhones ? 'hidden lg:flex' : 'flex'} items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-whatsapp text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] ring-4 ring-white/40`}
        >
          <WhatsAppIcon className="w-7 h-7 md:w-8 md:h-8" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
