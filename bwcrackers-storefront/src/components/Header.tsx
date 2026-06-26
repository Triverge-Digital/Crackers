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
      <header className="bg-gradient-to-r from-[#1A1A4E] to-[#2D1B6B] text-white py-3 px-4 sticky top-[32px] z-50 shadow-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
            <button onClick={() => setActiveView('home')} className={`text-xs font-black uppercase tracking-widest hover:text-brand-gold transition-colors ${activeView === 'home' ? 'text-brand-gold' : 'text-white/70'}`}>Home</button>
            <button onClick={() => setActiveView('order')} className={`text-xs font-black uppercase tracking-widest hover:text-brand-gold transition-colors ${activeView === 'order' ? 'text-brand-gold' : 'text-white/70'}`}>Store</button>
            <button onClick={() => { setActiveView('home'); setTimeout(() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-xs font-black uppercase tracking-widest text-white/70 hover:text-brand-gold transition-colors">Collections</button>
            <button onClick={() => { setActiveView('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-xs font-black uppercase tracking-widest text-white/70 hover:text-brand-gold transition-colors">About</button>
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
                  { label: 'Collections', action: () => { setActiveView('home'); setTimeout(() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
                  { label: 'About', action: () => { setActiveView('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); } }
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
