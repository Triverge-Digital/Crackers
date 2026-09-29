import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { WHATSAPP_LINK, CONTACT } from '../../constants';
import { useCart } from '../../context/CartContext';
import WhatsAppIcon from '../icons/WhatsAppIcon';

/** Chat FAB. Moves up when the order bar is showing so the two never overlap. */
export default function WhatsAppButton() {
  const { totals } = useCart();
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const barVisible = totals.count > 0 && pathname !== '/cart' && pathname !== '/track';

  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp: +91 ${CONTACT.primaryPhone}`}
      initial={reduce ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, bottom: barVisible ? 88 : 20 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed right-4 z-[55] flex items-center justify-center w-14 h-14 rounded-full bg-brand-whatsapp text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] ring-4 ring-white/40"
      style={{ bottom: barVisible ? 88 : 20 }}
    >
      <WhatsAppIcon className="w-8 h-8" />
    </motion.a>
  );
}
