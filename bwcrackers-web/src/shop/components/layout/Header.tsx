'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ShoppingCart, X, Menu, PackageSearch } from 'lucide-react';
import { SITE_NAME } from '../../constants';
import { useShopConstants } from '../../context/ShopContext';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../lib/format';
import { scrollToId } from '../ui/ScrollManager';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Store', to: '/store' },
  { label: 'Collections', to: '/collections' },
  { label: 'How to Pay', to: '/#payment-info', hash: 'payment-info' },
  { label: 'FAQ', to: '/#faq', hash: 'faq' },
  { label: 'Track Order', to: '/track' },
];

export default function Header() {
  const { ANNOUNCEMENT } = useShopConstants();
  const [menuOpen, setMenuOpen] = useState(false);
  const { totals } = useCart();
  const pathname = usePathname();
  const [hash, setHash] = useState('');
  const barRef = useRef<HTMLDivElement>(null);

  // Publish the real header height so sticky toolbars and scroll offsets sit flush under it.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty('--header-h', `${Math.round(el.getBoundingClientRect().height)}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [pathname]);

  useEffect(() => { setMenuOpen(false); }, [pathname, hash]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const onHashLink = (e: React.MouseEvent, hash: string) => {
    // Already on the home page: scroll instead of pushing a new history entry.
    if (pathname === '/') {
      e.preventDefault();
      scrollToId(hash);
      window.history.replaceState(null, '', `#${hash}`);
      setHash(`#${hash}`);
    }
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-black uppercase tracking-widest transition-colors py-2 ${isActive ? 'text-brand-gold' : 'text-white/75 hover:text-brand-gold'}`;

  return (
    <div ref={barRef} className="sticky top-0 z-[60] w-full">
      {/* Announcement bar — CSS marquee (pauses under prefers-reduced-motion) */}
      <div className="bg-brand-magenta py-2 overflow-hidden" aria-label="Offers">
        <div className="flex w-max animate-marquee whitespace-nowrap gap-10 text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] text-white">
          {[0, 1].map(i => (
            <React.Fragment key={i}>
              {ANNOUNCEMENT.map(text => (
                <React.Fragment key={text}>
                  <span aria-hidden={i === 1}>{text}</span>
                  <span className="text-brand-gold" aria-hidden="true">✦</span>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <header className="relative bg-gradient-to-r from-brand-navy to-[#2D1B6B] text-white shadow-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 px-3 sm:px-4 py-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="lg:hidden icon-btn hover:bg-white/10"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex items-center gap-2 rounded-lg" aria-label={`${SITE_NAME} home`}>
              <img src="/logo.webp" alt="" width={112} height={100} className="h-10 md:h-12 w-auto object-contain drop-shadow-lg" />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Main">
            {NAV.map(item =>
              item.hash ? (
                <Link key={item.label} href={item.to} onClick={e => onHashLink(e, item.hash!)} className={linkCls({ isActive: pathname === '/' && hash === `#${item.hash}` })}>
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.label}
                  href={item.to}
                  className={linkCls({ isActive: item.to === '/' ? pathname === '/' && !hash : pathname.startsWith(item.to) })}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="/BW-Crackers-Pricelist-2026.pdf"
              download="BW-Crackers-Pricelist-2026.pdf"
              className="hidden xs:inline-flex btn-ghost min-h-[44px] px-3 text-xs uppercase tracking-widest"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Price list</span>
              <span className="sm:hidden">PDF</span>
            </a>
            <Link
              href="/cart"
              className="relative icon-btn bg-white/10 hover:bg-white/20"
              aria-label={totals.count ? `Cart, ${totals.count} items, ${formatINR(totals.subtotal)}` : 'Cart, empty'}
            >
              <ShoppingCart size={22} />
              {totals.count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-brand-magenta text-[11px] font-black text-white shadow-lg border-2 border-brand-navy">
                  {totals.count > 99 ? '99+' : totals.count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close menu"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
                className="lg:hidden fixed inset-0 top-[var(--header-h,96px)] bg-black/50 backdrop-blur-sm z-40 cursor-default"
              />
              <motion.nav
                id="mobile-menu"
                aria-label="Mobile"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="lg:hidden absolute left-0 right-0 top-full bg-brand-navy border-t border-white/10 shadow-float z-50"
              >
                <div className="flex flex-col p-3 gap-1">
                  {NAV.map(item => (
                    <Link
                      key={item.label}
                      href={item.to}
                      onClick={e => { if (item.hash) onHashLink(e, item.hash); setMenuOpen(false); }}
                      className="flex items-center justify-between px-4 min-h-[48px] text-sm font-black uppercase tracking-widest text-white/85 hover:text-brand-gold hover:bg-white/5 rounded-xl transition-colors"
                    >
                      {item.label}
                      {item.to === '/track' && <PackageSearch size={18} className="text-white/40" />}
                    </Link>
                  ))}
                  <a
                    href="/BW-Crackers-Pricelist-2026.pdf"
                    download="BW-Crackers-Pricelist-2026.pdf"
                    className="xs:hidden flex items-center gap-3 px-4 min-h-[48px] text-sm font-black uppercase tracking-widest text-white/85 hover:text-brand-gold hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <Download size={18} /> Download price list (PDF)
                  </a>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
