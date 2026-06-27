import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, ShieldCheck, Truck,
  Headphones, Award, Instagram, MessageCircle,
  Facebook, Mail, Phone, MapPin, Plus, Minus, ChevronDown, ChevronUp,
  Search, X
} from 'lucide-react';
import { pricelist } from '../data/pricelist';
import { POSTERS, FALLBACK_IMG, MIN_ORDER, Brand, CONTACT, WHATSAPP_LINK, PRIMARY_PHONE_INTL, Totals } from '../constants';
import OrderModal from './OrderModal';

type HomeViewProps = {
  setActiveView: (v: string) => void;
  currentPoster: number;
  setCurrentPoster: React.Dispatch<React.SetStateAction<number>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | number>>;
  brands: Brand[];
  cart: Record<string, number>;
  updateQty: (code: string, delta: number) => void;
  totals: Totals;
};

export default function HomeView({
  setActiveView, currentPoster, setCurrentPoster,
  setSelectedCategory, brands, cart, updateQty, totals
}: HomeViewProps) {
  const [openCategories, setOpenCategories] = useState<Set<number>>(
    new Set(pricelist.map(c => c.id))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const filteredPricelist = pricelist.map(cat => ({
    ...cat,
    products: cat.products.filter(p =>
      !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.products.length > 0);

  // Auto-play carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => setCurrentPoster(p => (p + 1) % POSTERS.length), 5000);
    return () => clearInterval(timer);
  }, [setCurrentPoster]);

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) setCurrentPoster(p => (p - 1 + POSTERS.length) % POSTERS.length);
    else if (dx < -50) setCurrentPoster(p => (p + 1) % POSTERS.length);
    touchStartX.current = null;
  };

  const toggleCategory = (id: number) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const goToCategory = (categoryId: string | number) => {
    setSelectedCategory(categoryId);
    setActiveView('order');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const progress = Math.min((totals.total / MIN_ORDER) * 100, 100);
  const remaining = Math.max(MIN_ORDER - totals.total, 0);

  const catColors: Record<number, string> = {
    1: 'bg-red-600', 2: 'bg-blue-600', 3: 'bg-green-600', 4: 'bg-purple-600',
    5: 'bg-orange-500', 6: 'bg-pink-600', 7: 'bg-indigo-600', 8: 'bg-yellow-600',
    9: 'bg-teal-600', 10: 'bg-rose-600', 11: 'bg-cyan-600', 12: 'bg-amber-600',
  };

  return (
    <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">

      {/* ── HERO CAROUSEL ── */}
      <section
        className="relative w-full overflow-hidden bg-[#1A1A4E] touch-pan-y aspect-[3/1]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Base image always visible — prevents background from ever showing */}
        <img
          src={POSTERS[currentPoster]}
          onError={e => { e.currentTarget.src = FALLBACK_IMG; }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />

        {/* Sparkle doodle overlay — viewBox coords so stars scale to any screen width */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }} viewBox="0 0 300 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          {/* TOP-LEFT cluster */}
          <g opacity="0.55" fill="none" stroke="#FFD700" strokeLinecap="round">
            <path d="M15 18 L15 10 M15 18 L15 26 M15 18 L7 18 M15 18 L23 18" strokeWidth="0.6"/>
            <path d="M15 18 L11 14 M15 18 L19 22 M15 18 L11 22 M15 18 L19 14" strokeWidth="0.35"/>
            <circle cx="15" cy="18" r="1" fill="#FFD700" opacity="0.8"/>
          </g>
          <g opacity="0.4" fill="none" stroke="#FFD700" strokeLinecap="round">
            <path d="M28 35 L28 29 M28 35 L28 41 M28 35 L22 35 M28 35 L34 35" strokeWidth="0.5"/>
            <circle cx="28" cy="35" r="0.8" fill="#FFD700" opacity="0.7"/>
          </g>
          <g opacity="0.35" fill="none" stroke="#ffffff" strokeLinecap="round">
            <path d="M8 55 L8 49 M8 55 L8 61 M8 55 L2 55 M8 55 L14 55" strokeWidth="0.45"/>
            <circle cx="8" cy="55" r="0.7" fill="#ffffff" opacity="0.6"/>
          </g>

          {/* TOP-RIGHT cluster */}
          <g opacity="0.55" fill="none" stroke="#FFD700" strokeLinecap="round">
            <path d="M285 18 L285 10 M285 18 L285 26 M285 18 L277 18 M285 18 L293 18" strokeWidth="0.6"/>
            <path d="M285 18 L281 14 M285 18 L289 22 M285 18 L281 22 M285 18 L289 14" strokeWidth="0.35"/>
            <circle cx="285" cy="18" r="1" fill="#FFD700" opacity="0.8"/>
          </g>
          <g opacity="0.4" fill="none" stroke="#ffffff" strokeLinecap="round">
            <path d="M272 38 L272 32 M272 38 L272 44 M272 38 L266 38 M272 38 L278 38" strokeWidth="0.5"/>
            <circle cx="272" cy="38" r="0.8" fill="#ffffff" opacity="0.6"/>
          </g>
          <g opacity="0.35" fill="none" stroke="#FFD700" strokeLinecap="round">
            <path d="M294 55 L294 49 M294 55 L294 61 M294 55 L288 55 M294 55 L300 55" strokeWidth="0.45"/>
            <circle cx="294" cy="55" r="0.7" fill="#FFD700" opacity="0.5"/>
          </g>

          {/* BOTTOM-LEFT */}
          <g opacity="0.3" fill="none" stroke="#ffffff" strokeLinecap="round">
            <path d="M18 80 L18 74 M18 80 L18 86 M18 80 L12 80 M18 80 L24 80" strokeWidth="0.45"/>
            <circle cx="18" cy="80" r="0.7" fill="#ffffff" opacity="0.5"/>
          </g>

          {/* BOTTOM-RIGHT */}
          <g opacity="0.3" fill="none" stroke="#FFD700" strokeLinecap="round">
            <path d="M282 80 L282 74 M282 80 L282 86 M282 80 L276 80 M282 80 L288 80" strokeWidth="0.45"/>
            <circle cx="282" cy="80" r="0.7" fill="#FFD700" opacity="0.5"/>
          </g>

          {/* Scattered centre dots */}
          <circle cx="75"  cy="12" r="0.8" fill="#FFD700" opacity="0.45"/>
          <circle cx="150" cy="8"  r="0.9" fill="#ffffff" opacity="0.35"/>
          <circle cx="225" cy="14" r="0.8" fill="#FFD700" opacity="0.4"/>
          <circle cx="110" cy="85" r="0.7" fill="#FFD700" opacity="0.3"/>
          <circle cx="190" cy="88" r="0.8" fill="#ffffff" opacity="0.28"/>
          <circle cx="60"  cy="70" r="0.6" fill="#FFD700" opacity="0.25"/>
          <circle cx="245" cy="72" r="0.6" fill="#ffffff" opacity="0.25"/>
        </svg>
        <AnimatePresence initial={false}>
          <motion.img
            key={currentPoster}
            src={POSTERS[currentPoster]}
            onError={e => { e.currentTarget.src = FALLBACK_IMG; }}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 1 }}
          />
        </AnimatePresence>
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 hidden md:flex justify-between z-20">
          <button onClick={() => setCurrentPoster(p => (p - 1 + POSTERS.length) % POSTERS.length)} className="w-10 h-10 bg-brand-magenta/80 text-white rounded-full flex items-center justify-center hover:bg-brand-magenta transition-colors shadow-lg"><ChevronLeft size={24} /></button>
          <button onClick={() => setCurrentPoster(p => (p + 1) % POSTERS.length)} className="w-10 h-10 bg-brand-magenta/80 text-white rounded-full flex items-center justify-center hover:bg-brand-magenta transition-colors shadow-lg"><ChevronRight size={24} /></button>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {POSTERS.map((_, i) => (
            <div key={i} onClick={() => setCurrentPoster(i)} className={`w-3 h-3 border border-white cursor-pointer transition-all ${i === currentPoster ? 'bg-brand-magenta scale-110' : 'bg-white/40'}`} />
          ))}
        </div>
      </section>

      {/* ── FESTIVAL OFFER BANNER ── */}
      <AnimatePresence>
        {!bannerDismissed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-brand-gold flex items-center justify-between px-4 py-2.5 gap-3">
              <div className="flex items-center gap-2 flex-1 justify-center">
                <span className="text-brand-purple font-black text-xs md:text-sm uppercase tracking-wide text-center">
                  🎆 Festival Special — Flat 80% Off on all Sivakasi crackers! Order now &amp; celebrate big 🎆
                </span>
              </div>
              <button onClick={() => setBannerDismissed(true)} className="text-brand-purple hover:opacity-70 flex-shrink-0 transition-opacity">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HOW TO ORDER — 3 STEPS ── */}
      <section className="bg-[#1A1A4E] py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-white font-black text-lg md:text-2xl uppercase tracking-wide mb-4">
            Order in 3 Simple Steps
          </h2>
          {/* Steps — horizontal on ALL screen sizes */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-5">
            {[
              { step: '1', title: 'Browse & Add', desc: 'Tap + on any item you want' },
              { step: '2', title: 'Check Total', desc: 'Min. order Rs.3,000' },
              { step: '3', title: 'WhatsApp Order', desc: 'Green button sends your list' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white/10 rounded-xl p-3 flex flex-col items-center text-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-brand-magenta text-white font-black text-base flex items-center justify-center flex-shrink-0">{step}</div>
                <p className="text-white font-black text-[11px] md:text-sm leading-tight">{title}</p>
                <p className="text-white/60 text-[10px] md:text-xs font-medium leading-tight hidden sm:block">{desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-black px-6 py-3 rounded-xl transition-colors shadow-lg text-sm w-full sm:w-auto"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.855L.057 23.882l6.173-1.616A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.005-1.366l-.358-.213-3.714.974 1.01-3.61-.234-.373A9.783 9.783 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
              Chat & Order on WhatsApp
            </a>
            <a
              href={`tel:+${PRIMARY_PHONE_INTL}`}
              className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-black px-6 py-3 rounded-xl transition-colors text-sm w-full sm:w-auto"
            >
              <Phone size={16} /> Call: {CONTACT.primaryPhone}
            </a>
          </div>
        </div>
      </section>

      {/* ── ALL PRODUCTS PRICE LIST ── */}
      <section className="bg-[#FDF0F6] py-8 px-3 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-5">
            <h2 className="text-2xl md:text-3xl font-black text-[#1A1A4E] uppercase tracking-tight">Full Price List</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              All prices after <span className="text-brand-magenta font-black">80% discount</span> on MRP &nbsp;·&nbsp; Min. order Rs.{MIN_ORDER.toLocaleString()}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search any product..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-sm font-medium focus:outline-none focus:border-brand-magenta/50 shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Progress bar (visible when cart has items) */}
          {totals.count > 0 && (
            <div className="mb-5 bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Your Total</span>
                <span className={`font-black text-lg ${totals.total >= MIN_ORDER ? 'text-green-600' : 'text-[#1A1A4E]'}`}>₹{totals.total.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${totals.total >= MIN_ORDER ? 'bg-green-500' : 'bg-pink-500'}`} style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[11px] mt-1.5 font-bold text-gray-400">
                {totals.total >= MIN_ORDER ? 'Ready to order! Tap the WhatsApp button below.' : `Add Rs.${remaining.toLocaleString()} more to reach minimum order`}
              </p>
            </div>
          )}

          {/* Category jump pills */}
          {!searchQuery && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
              {pricelist.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    const el = document.getElementById(`cat-${cat.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    if (!openCategories.has(cat.id)) toggleCategory(cat.id);
                  }}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[11px] font-black uppercase tracking-wide text-[#1A1A4E] hover:bg-brand-magenta hover:text-white hover:border-brand-magenta transition-colors shadow-sm"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Category sections */}
          {filteredPricelist.length === 0 && (
            <div className="text-center py-12 text-gray-400 font-bold">No products found for "{searchQuery}"</div>
          )}
          <div className="space-y-3">
            {filteredPricelist.map((cat, catIdx) => {
              const isOpen = openCategories.has(cat.id);
              const headerColor = catColors[cat.id] || 'bg-gray-700';
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.03 }}
                  id={`cat-${cat.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                >
                  {/* Category header */}
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 text-white ${headerColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-black text-sm md:text-base uppercase tracking-wide">{cat.name}</span>
                      <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">{cat.products.length} items</span>
                    </div>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {/* Products */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {/* Table header */}
                        <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <span>Product</span>
                          <span className="text-right">Price</span>
                          <span className="text-right">Add</span>
                        </div>

                        {cat.products.map((p, idx) => (
                          <div
                            key={p.code}
                            className={`grid grid-cols-[1fr_auto_auto] gap-2 items-center px-3 py-2.5 border-b border-gray-100 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                          >
                            {/* Name + image (image hidden on mobile) */}
                            <div className="flex items-center gap-2 min-w-0">
                              {p.showImage !== false && (
                                <img
                                  src={p.image || FALLBACK_IMG}
                                  alt={p.name}
                                  onError={e => { e.currentTarget.src = FALLBACK_IMG; }}
                                  className="hidden sm:block w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                                />
                              )}
                              <div className="min-w-0">
                                <p className="font-black text-[12px] sm:text-[13px] text-[#1A1A4E] leading-tight">{p.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{p.unit}{p.isPremium ? ' · Premium' : ''}</p>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="font-black text-sm text-[#1A1A4E] leading-none">Rs.{p.discountPrice}</p>
                              <p className="text-[10px] text-gray-400 line-through leading-none mt-0.5">Rs.{p.mrp}</p>
                            </div>

                            {/* Qty */}
                            <div className="flex items-center justify-end">
                              {cart[p.code] ? (
                                <div className="flex items-center gap-0.5 bg-[#1A1A4E] rounded-lg px-1 py-0.5">
                                  <button onClick={() => updateQty(p.code, -1)} className="w-7 h-7 rounded-md bg-white/10 text-white flex items-center justify-center active:scale-90"><Minus size={11} /></button>
                                  <span className="w-5 text-center text-xs font-black text-white">{cart[p.code]}</span>
                                  <button onClick={() => updateQty(p.code, 1)} className="w-7 h-7 rounded-md bg-pink-500 text-white flex items-center justify-center active:scale-90"><Plus size={11} /></button>
                                </div>
                              ) : (
                                <button onClick={() => updateQty(p.code, 1)} className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow active:scale-90"><Plus size={16} /></button>
                              )}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom order CTA */}
          <div className="mt-8 bg-[#1A1A4E] rounded-2xl p-6 text-center">
            <p className="text-white font-black text-lg mb-1">Ready to order?</p>
            <p className="text-white/60 text-sm mb-4">Add items above, then place your order on WhatsApp. It's that simple!</p>
            <button
              onClick={() => setModalOpen(true)}
              disabled={totals.count === 0}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black px-8 py-3.5 rounded-xl transition-colors shadow-lg"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.855L.057 23.882l6.173-1.616A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.005-1.366l-.358-.213-3.714.974 1.01-3.61-.234-.373A9.783 9.783 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
              Place Order via WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* ── ABOUT / 80% DISCOUNT IMAGE ── */}
      <section id="about" className="w-full bg-white border-t border-gray-100 md:grid md:grid-cols-2 scroll-mt-28">
        <div className="bg-[#1A1A4E] flex items-center justify-center p-0">
          <img
            src="/discount.webp"
            alt="80% Discount on MRP"
            onError={e => { e.currentTarget.style.display = 'none'; }}
            className="w-full h-auto block"
          />
        </div>
        <div className="bg-[#FDF0F6] p-8 md:p-14 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <h2 className="text-4xl md:text-5xl text-brand-magenta uppercase tracking-wide leading-none mb-6 font-brand">
            BW CRACKERS<br /><span className="text-2xl md:text-3xl">SIVAKASI PATTASU</span>
          </h2>
          <div className="space-y-4 text-gray-700 font-bold text-sm leading-relaxed">
            <p>Welcome to BW Crackers, your premier destination for high-quality firecrackers and fireworks. Based in Sivakasi, the fireworks capital of India, we have been bringing joy and light to celebrations for over a decade.</p>
            <p>Our commitment to safety, quality, and customer satisfaction sets us apart. All our products are certified and tested to ensure a spectacular yet safe experience for your family and loved ones.</p>
            <p>We source directly from the finest manufacturers in Sivakasi, ensuring that every product meets the highest standards of quality while offering the best prices in the market with our signature <span className="text-brand-magenta font-black">80% discount on MRP</span>.</p>
          </div>
          <div className="mt-6 flex gap-3">
            <div className="bg-brand-magenta text-white rounded-2xl px-5 py-3 text-center">
              <p className="font-black text-2xl leading-none">80%</p>
              <p className="text-[10px] font-bold uppercase tracking-wider mt-1">Discount on MRP</p>
            </div>
            <div className="bg-[#1A1A4E] text-white rounded-2xl px-5 py-3 text-center">
              <p className="font-black text-2xl leading-none">100%</p>
              <p className="text-[10px] font-bold uppercase tracking-wider mt-1">Sivakasi Direct</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR PRODUCTS (CIRCULAR CARDS) ── */}
      <section id="categories" className="py-16 bg-gray-50 border-t border-brand-magenta/5 scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-brand-magenta uppercase tracking-tighter mb-2 italic font-display">Our Products</h2>
            <div className="w-24 h-1.5 bg-brand-gold mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">
            {pricelist.slice(0, 6).map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.04 }}
                onClick={() => { setSelectedCategory(cat.id); setActiveView('order'); }}
                className="relative flex flex-col items-center cursor-pointer group"
              >
                <div className="absolute -right-2 top-0 z-20 bg-brand-gold text-brand-purple p-2 rounded-xl shadow-xl border-2 border-white rotate-12 flex flex-col items-center font-black scale-75 group-hover:scale-100 transition-transform">
                  <span className="text-[8px] uppercase">{cat.products.length}</span>
                  <span className="text-xs uppercase leading-none">Items</span>
                </div>
                <div className="absolute -left-2 bottom-1/4 z-20 bg-red-600 text-white px-2 py-0.5 rounded-lg shadow-xl border-2 border-white -rotate-12 flex items-center font-black scale-75 group-hover:scale-100 transition-transform">
                  <span className="text-[9px] uppercase italic">Shop Now!</span>
                </div>
                <div className="ornate-frame w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 shadow-2xl">
                  <div className="ornate-frame-inner">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src={cat.products[0]?.image || FALLBACK_IMG}
                        alt={cat.name}
                        onError={e => { e.currentTarget.src = FALLBACK_IMG; }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="font-black text-base md:text-xl uppercase tracking-tighter text-brand-magenta group-hover:scale-105 transition-transform">{cat.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                    {cat.products.length} varieties · from Rs.{Math.min(...cat.products.map(p => p.discountPrice))}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FESTIVE COLLECTIONS ── */}
      <section className="py-16 bg-gray-50 border-t border-brand-magenta/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-brand-magenta uppercase tracking-tighter italic mb-2 font-display">Festive Collections</h2>
            <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: "Single Sound Crackers", desc: "Classic celebration sounds", img: "/images/products/bw-7-2-sound-crackers.jpeg", catId: 1 },
              { title: "Rockets", desc: "Spectacular sky shows", img: "/images/products/bw-17-baby-rocket.jpeg", catId: 4 },
              { title: "Premium Gift Boxes", desc: "Complete celebration bundles", img: "/images/products/bw-160-chennai-super-kings-42-items.jpeg", catId: 7 },
              { title: "Sparklers & Chakkars", desc: "Safe fun for the whole family", img: "/images/products/bw-22-7-magic-pencil.jpeg", catId: 5 },
            ].map((col, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                onClick={() => goToCategory(col.catId)}
                className="relative aspect-[3/4] rounded-2xl md:rounded-[32px] overflow-hidden cursor-pointer group shadow-lg"
              >
                <img
                  src={col.img}
                  alt={col.title}
                  onError={e => { e.currentTarget.src = FALLBACK_IMG; }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A2E] via-[#0A0A2E]/30 to-transparent" />
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                  <h3 className="text-sm md:text-lg font-black text-white leading-tight mb-1">{col.title}</h3>
                  <p className="text-white/60 text-[10px] md:text-xs font-bold hidden sm:block">{col.desc}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-brand-gold text-[10px] font-black uppercase tracking-wider">
                    Shop Now <ChevronRight size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR BRANDS ── */}
      <div className="bg-white py-10 border-t border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 mb-6 text-center">
          <h2 className="text-2xl font-black text-brand-magenta uppercase tracking-tighter italic mb-2 font-display">Our Brands</h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full" />
        </div>
        <div className="relative flex overflow-hidden">
          {(() => {
            const reps = Math.max(2, Math.ceil(12 / (brands.length || 1)));
            const track = Array.from({ length: reps }).flatMap(() => brands);
            return [0, 1].map(t => (
              <motion.div
                key={t}
                aria-hidden={t === 1}
                animate={{ x: ["0%", "-100%"] }}
                transition={{ repeat: Infinity, duration: track.length * 4, ease: "linear" }}
                className="flex gap-12 items-center pr-12 shrink-0"
              >
                {track.map((brand, i) => (
                  <div key={i} className="w-28 h-16 flex-shrink-0">
                    <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                  </div>
                ))}
              </motion.div>
            ));
          })()}
        </div>
      </div>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center mb-10">
          <h2 className="text-2xl font-black text-brand-magenta uppercase italic tracking-tighter mb-2 font-display">Why Choose Us</h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full" />
        </div>
        <div className="container mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <ShieldCheck size={30} className="text-green-600" />, title: "Safety First", desc: "All products certified & tested", color: "bg-green-50" },
            { icon: <Truck size={30} className="text-blue-600" />, title: "Fast Delivery", desc: "Quick delivery across India", color: "bg-blue-50" },
            { icon: <Headphones size={30} className="text-purple-600" />, title: "24/7 Support", desc: "Always here to help you", color: "bg-purple-50" },
            { icon: <Award size={30} className="text-orange-600" />, title: "Premium Quality", desc: "Direct from Sivakasi", color: "bg-orange-50" },
          ].map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3">
              <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center`}>{f.icon}</div>
              <p className="font-black text-sm text-[#1A1A4E] uppercase">{f.title}</p>
              <p className="text-gray-500 text-xs font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0A0A2E] text-white pt-16 pb-8 border-t border-brand-gold/10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="flex flex-col">
            <img src="/logo.png" alt="B&W Crackers" className="h-14 w-auto object-contain drop-shadow-lg mb-4" />
            <p className="text-gray-400 font-bold text-sm leading-relaxed mb-6">Premium quality fireworks directly from Sivakasi, with our signature 80% discount on MRP.</p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-magenta transition-colors"><Instagram size={18} /></a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#25D366] transition-colors"><MessageCircle size={18} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1877F2] transition-colors"><Facebook size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-brand-gold font-black uppercase tracking-widest text-xs mb-6">Navigation</h4>
            <ul className="space-y-3 text-gray-400 font-bold text-sm">
              <li><button onClick={() => setActiveView('home')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => setActiveView('order')} className="hover:text-white transition-colors">Browse by Category</button></li>
              <li><button onClick={() => setActiveView('cart')} className="hover:text-white transition-colors">My Cart</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-brand-gold font-black uppercase tracking-widest text-xs mb-6">Categories</h4>
            <ul className="space-y-2 text-gray-400 font-bold text-sm">
              {pricelist.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <button onClick={() => goToCategory(cat.id)} className="text-left hover:text-white transition-colors capitalize">{cat.name.toLowerCase()}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-brand-gold font-black uppercase tracking-widest text-xs mb-6">Contact</h4>
            <div className="space-y-4">
              <a href={`tel:+${PRIMARY_PHONE_INTL}`} className="flex gap-3 group">
                <Phone size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">+91 {CONTACT.primaryPhone}</span>
              </a>
              <a href={`tel:+917867036289`} className="flex gap-3 group">
                <Phone size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">+91 {CONTACT.secondaryPhone}</span>
              </a>
              <a href={`mailto:${CONTACT.email}`} className="flex gap-3 group">
                <Mail size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{CONTACT.email}</span>
              </a>
              <div className="flex gap-3">
                <MapPin size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm font-bold text-gray-400">Sivakasi, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 pt-6 border-t border-white/5 text-center">
          <span className="text-gray-500 text-[11px] font-black uppercase tracking-widest">© 2026 B&W Crackers · Sivakasi Direct</span>
        </div>
      </footer>

      {/* ── ORDER MODAL ── */}
      <OrderModal open={modalOpen} onClose={() => setModalOpen(false)} cart={cart} totals={totals} />

      {/* ── FLOATING ORDER BAR (when cart has items) ── */}
      <AnimatePresence>
        {totals.count > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-4 left-3 right-3 flex justify-center z-50"
          >
            <div className="bg-[#1A1A4E] rounded-2xl shadow-2xl flex items-center gap-3 px-4 py-3 w-full max-w-sm border border-white/10">
              <div className="flex-1">
                <p className="text-white font-black text-base leading-none">₹{totals.total.toLocaleString()}</p>
                <p className="text-white/50 text-[10px] font-bold mt-0.5">{totals.count} item{totals.count > 1 ? 's' : ''} added</p>
              </div>
              {totals.total >= MIN_ORDER ? (
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-green-500 hover:bg-green-400 text-white font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-lg"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.855L.057 23.882l6.173-1.616A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.005-1.366l-.358-.213-3.714.974 1.01-3.61-.234-.373A9.783 9.783 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                  Order on WhatsApp
                </button>
              ) : (
                <div className="text-right">
                  <p className="text-white/40 text-[10px] font-bold">Need ₹{remaining.toLocaleString()} more</p>
                  <p className="text-white/60 text-[10px]">for min. order</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
