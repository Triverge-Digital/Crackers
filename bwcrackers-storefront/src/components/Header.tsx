import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ShoppingCart, X, Menu } from 'lucide-react';
import { MIN_ORDER, Totals } from '../constants';

type HeaderProps = {
  activeView: string;
  setActiveView: (v: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  totals: Totals;
};

export default function Header({ activeView, setActiveView, isMenuOpen, setIsMenuOpen, totals }: HeaderProps) {
  // Scroll-spy: highlight Home / About based on scroll position while on the home view.
  const [activeSection, setActiveSection] = React.useState<'home' | 'about'>('home');

  React.useEffect(() => {
    if (activeView !== 'home') return;
    const onScroll = () => {
      const offset = 140; // sticky header height
      const aboutTop = document.getElementById('about')?.getBoundingClientRect().top ?? Infinity;
      setActiveSection(aboutTop <= offset ? 'about' : 'home');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeView]);

  const navActive = (key: 'home' | 'order' | 'collections' | 'about' | 'payment') => {
    if (key === 'order' || key === 'collections') return activeView === key;
    return activeView === 'home' && activeSection === key;
  };

  const scrollToPayment = () => {
    setActiveView('home');
    setTimeout(() => document.getElementById('payment-info')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      <div className="bg-brand-purple py-2 overflow-hidden border-b border-brand-gold/20 sticky top-0 z-[60]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="whitespace-nowrap flex gap-12 text-[10px] md:text-xs font-black uppercase tracking-widest text-brand-gold"
        >
          {[1, 2, 3, 4].map((_, i) => (
            <React.Fragment key={i}>
              <span>🔥 FLAT 80% DISCOUNT ON ALL CRACKERS 🎇</span>
              <span>🚚 DIRECT SIVAKASI DELIVERY 📦</span>
              <span>✨ MINIMUM ORDER VALUE ₹{MIN_ORDER} ONLY ✨</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* HEADER */}
      <header className="relative bg-gradient-to-r from-[#1A1A4E] to-[#2D1B6B] text-white py-3 px-4 sticky top-[32px] z-50 shadow-lg border-b border-white/10 overflow-hidden">
        {/* Sparkle doodles in header background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none select-none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          {/* 4-point stars — gold */}
          <g fill="none" stroke="#FFD700" strokeLinecap="round">
            <path d="M220 12 L220 6 M220 12 L220 18 M220 12 L214 12 M220 12 L226 12" strokeWidth="1.2" opacity="0.45"/>
            <circle cx="220" cy="12" r="1.5" fill="#FFD700" opacity="0.5"/>
            <path d="M480 8 L480 3 M480 8 L480 13 M480 8 L475 8 M480 8 L485 8" strokeWidth="1" opacity="0.35"/>
            <circle cx="480" cy="8" r="1.2" fill="#FFD700" opacity="0.4"/>
            <path d="M760 14 L760 8 M760 14 L760 20 M760 14 L754 14 M760 14 L766 14" strokeWidth="1.2" opacity="0.4"/>
            <circle cx="760" cy="14" r="1.5" fill="#FFD700" opacity="0.45"/>
            <path d="M1050 10 L1050 4 M1050 10 L1050 16 M1050 10 L1044 10 M1050 10 L1056 10" strokeWidth="1" opacity="0.35"/>
            <circle cx="1050" cy="10" r="1.2" fill="#FFD700" opacity="0.4"/>
          </g>
          {/* diagonal sparkle arms */}
          <g fill="none" stroke="#FFD700" strokeLinecap="round">
            <path d="M220 12 L216 8 M220 12 L224 16 M220 12 L224 8 M220 12 L216 16" strokeWidth="0.7" opacity="0.3"/>
            <path d="M760 14 L756 10 M760 14 L764 18 M760 14 L764 10 M760 14 L756 18" strokeWidth="0.7" opacity="0.28"/>
          </g>
          {/* tiny white dots scattered */}
          <circle cx="340" cy="16" r="1.2" fill="#ffffff" opacity="0.2"/>
          <circle cx="600" cy="9"  r="1"   fill="#FFD700" opacity="0.25"/>
          <circle cx="880" cy="17" r="1.2" fill="#ffffff" opacity="0.18"/>
          <circle cx="1150" cy="8" r="1"   fill="#FFD700" opacity="0.22"/>
          <circle cx="140"  cy="10" r="1"  fill="#FFD700" opacity="0.2"/>
          <circle cx="1300" cy="14" r="1.2" fill="#ffffff" opacity="0.18"/>
        </svg>
        <div className="max-w-6xl mx-auto flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('home')}>
              <img src="/logo.png" alt="B&W Crackers" className="h-10 md:h-14 w-auto object-contain drop-shadow-lg" />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => setActiveView('home')} className={`text-xs font-black uppercase tracking-widest hover:text-brand-gold transition-colors ${navActive('home') ? 'text-brand-gold' : 'text-white/70'}`}>Home</button>
            <button onClick={() => setActiveView('order')} className={`text-xs font-black uppercase tracking-widest hover:text-brand-gold transition-colors ${navActive('order') ? 'text-brand-gold' : 'text-white/70'}`}>Store</button>
            <button onClick={() => setActiveView('collections')} className={`text-xs font-black uppercase tracking-widest hover:text-brand-gold transition-colors ${navActive('collections') ? 'text-brand-gold' : 'text-white/70'}`}>Collections</button>
            <button onClick={() => { setActiveView('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className={`text-xs font-black uppercase tracking-widest hover:text-brand-gold transition-colors ${navActive('about') ? 'text-brand-gold' : 'text-white/70'}`}>About</button>
            <button onClick={scrollToPayment} className={`text-xs font-black uppercase tracking-widest hover:text-brand-gold transition-colors ${navActive('payment') ? 'text-brand-gold' : 'text-white/70'}`}>How to Pay</button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('cart')}
              className="relative bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all active:scale-95"
              aria-label="Cart"
            >
              <ShoppingCart size={20} className="text-white" />
              {totals.count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-magenta text-[10px] font-black text-white shadow-lg border-2 border-[#1A1A4E]">
                  {totals.count}
                </span>
              )}
            </button>
            <a
              href="/BW-Crackers-Pricelist-2025.pdf"
              download="BW-Crackers-Pricelist-2025.pdf"
              className="bg-red-600 px-4 py-2 rounded-xl shadow-lg font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition-all active:scale-95"
            >
              <Download size={16} />
              <span className="hidden xs:inline">Pricelist</span>
              <span className="xs:hidden">List</span>
            </a>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#1A1A4E] border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-4 gap-2">
                {[
                  { label: 'Home', view: 'home' },
                  { label: 'Store', view: 'order' },
                  { label: 'Collections', view: 'collections' },
                  { label: 'About', action: () => { setActiveView('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
                  { label: 'How to Pay', action: scrollToPayment }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.view) setActiveView(item.view);
                      if (item.action) item.action();
                      setIsMenuOpen(false);
                    }}
                    className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-white/70 hover:text-brand-gold hover:bg-white/5 rounded-xl transition-all"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
