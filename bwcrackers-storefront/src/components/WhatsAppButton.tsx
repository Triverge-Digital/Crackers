import { motion } from 'framer-motion';
import { WHATSAPP_LINK, CONTACT, PRIMARY_PHONE_INTL } from '../constants';

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col gap-3 items-center">
      {/* Call button */}
      <motion.a
        href={`tel:+${PRIMARY_PHONE_INTL}`}
        aria-label={`Call us: ${CONTACT.primaryPhone}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1A1A4E] shadow-[0_6px_20px_rgba(26,26,78,0.4)] ring-4 ring-white/30"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
        </svg>
      </motion.a>

      {/* WhatsApp button */}
      <motion.a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on WhatsApp: ${CONTACT.primaryPhone}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-[0_8px_24px_rgba(37,211,102,0.5)] ring-4 ring-white/30"
      >
        <span className="absolute inline-flex h-14 w-14 rounded-full bg-[#25D366] opacity-60 animate-ping" />
        <svg viewBox="0 0 32 32" className="relative w-8 h-8 fill-white" aria-hidden="true">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.048 9.38L1.05 31.32l6.156-1.968A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.824 32 16S24.826 0 16.004 0zm9.32 22.598c-.386 1.09-1.92 1.994-3.142 2.258-.836.178-1.928.32-5.604-1.204-4.7-1.948-7.726-6.724-7.962-7.034-.226-.31-1.9-2.53-1.9-4.826 0-2.296 1.166-3.424 1.636-3.904.386-.394.846-.572 1.388-.572.174 0 .33.008.472.016.402.018.604.042.87.68.33.79 1.13 2.74 1.226 2.94.098.2.196.47.062.78-.124.32-.234.46-.434.708-.2.248-.39.438-.59.704-.182.232-.388.482-.166.864.222.376 1.014 1.672 2.18 2.708 1.5 1.336 2.74 1.752 3.164 1.93.31.13.68.1.91-.144.29-.31.65-.826 1.016-1.334.26-.366.59-.41.93-.282.35.124 2.21 1.042 2.588 1.23.378.188.628.28.72.434.094.156.094.886-.292 1.97z" />
        </svg>
      </motion.a>
    </div>
  );
}
