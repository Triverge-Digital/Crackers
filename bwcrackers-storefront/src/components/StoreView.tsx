import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, ShoppingCart, ChevronDown, ChevronUp, Plus, Minus, List, LayoutGrid } from 'lucide-react';
import { pricelist, Product } from '../data/pricelist';
import { MIN_ORDER, FALLBACK_IMG, Totals, CATEGORY_COLORS } from '../constants';
import OrderModal, { CustomerForm } from './OrderModal';

type StoreProduct = Product & { categoryId: number; categoryName: string };

type StoreViewProps = {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string | number;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | number>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  allProducts: StoreProduct[];
  totals: Totals;
  cart: Record<string, number>;
  updateQty: (code: string, delta: number) => void;
};

export default function StoreView({
  selectedCategory, setSelectedCategory,
  searchQuery, setSearchQuery,
  totals, cart, updateQty
}: StoreViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState<CustomerForm>({ name: '', phone: '', email: '', address: '' });
  const [openCategories, setOpenCategories] = useState<Set<number>>(
    new Set(pricelist.map(c => c.id))
  );
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const toggleCategory = (id: number) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredPricelist = pricelist
    .map(cat => ({
      ...cat,
      products: cat.products.filter(p => {
        const matchCat = selectedCategory === 'all' || selectedCategory === cat.id;
        const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
      })
    }))
    .filter(cat => cat.products.length > 0);

  const totalProducts = filteredPricelist.reduce((sum, c) => sum + c.products.length, 0);
  const progress = Math.min((totals.total / MIN_ORDER) * 100, 100);
  const remaining = Math.max(MIN_ORDER - totals.total, 0);

  return (
    <motion.div
      key="order"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto w-full px-3 md:px-6 pb-40 pt-4"
    >
      {/* ── STICKY TOP BAR ── */}
      <div className="sticky top-[68px] z-30 bg-[#FDF0F6]/95 backdrop-blur-sm py-3 mb-4 border-b border-pink-100">
        {/* Search */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium focus:outline-none focus:border-pink-400 shadow-sm"
            />
          </div>
          <span className="flex items-center bg-white border border-gray-200 rounded-xl px-4 text-sm font-bold text-gray-500 shadow-sm whitespace-nowrap">
            {totalProducts} items
          </span>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-shrink-0">
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-[#1A1A4E] text-white' : 'text-gray-400 hover:text-gray-600'}`}
            ><List size={16} /></button>
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#1A1A4E] text-white' : 'text-gray-400 hover:text-gray-600'}`}
            ><LayoutGrid size={16} /></button>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide transition-all ${selectedCategory === 'all' ? 'bg-[#1A1A4E] text-white shadow' : 'bg-white text-gray-500 border border-gray-200'}`}
          >All</button>
          {pricelist.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide transition-all ${selectedCategory === cat.id ? 'bg-[#1A1A4E] text-white shadow' : 'bg-white text-gray-500 border border-gray-200'}`}
            >{cat.name}</button>
          ))}
        </div>

        {/* Order progress */}
        <div className="mt-3 bg-white rounded-xl px-4 py-2.5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">Order Total</span>
            <span className={`text-sm font-black ${totals.total >= MIN_ORDER ? 'text-green-600' : 'text-[#1A1A4E]'}`}>
              ₹{totals.total.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${totals.total >= MIN_ORDER ? 'bg-green-500' : 'bg-pink-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] mt-1 font-bold text-gray-400">
            {totals.total >= MIN_ORDER
              ? '✅ Minimum order reached — you can place your order!'
              : `Add ₹${remaining.toLocaleString()} more to reach minimum order of ₹${MIN_ORDER.toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* ── HOW TO ORDER BANNER ── */}
      <div className="mb-5 bg-[#1A1A4E] rounded-2xl px-5 py-4 text-white flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <p className="font-black text-sm mb-1">How to Order</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-white/70 font-medium">
            <span>① Browse categories below</span>
            <span>② Tap <strong className="text-white">+</strong> to add items</span>
            <span>③ Tap <strong className="text-white">Place Order via WhatsApp</strong></span>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex-shrink-0 bg-green-500 hover:bg-green-400 text-white font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-lg"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.855L.057 23.882l6.173-1.616A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.005-1.366l-.358-.213-3.714.974 1.01-3.61-.234-.373A9.783 9.783 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
          Place Order via WhatsApp
        </button>
      </div>

      {/* ── CATEGORY SECTIONS ── */}
      {filteredPricelist.length === 0 ? (
        <div className="text-center py-20 text-gray-400 font-bold">No products found</div>
      ) : (
        <div className="space-y-4">
          {filteredPricelist.map((cat, catIdx) => {
            const isOpen = openCategories.has(cat.id);
            const headerColor = CATEGORY_COLORS[cat.id] || 'bg-gray-700';

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.04 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-white ${headerColor}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm uppercase tracking-wide">{cat.name}</span>
                    <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {cat.products.length} items
                    </span>
                  </div>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {/* Product Rows */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {viewMode === 'list' ? (
                        <>
                          {/* Table header */}
                          <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_auto_auto_auto] gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <span>Product</span>
                            <span className="hidden sm:block text-right">Unit</span>
                            <span className="text-right">Price</span>
                            <span className="text-right">Qty</span>
                          </div>

                          {cat.products.map((p, idx) => (
                            <div
                              key={p.code}
                              className={`grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_auto_auto_auto] gap-2 items-center px-4 py-3 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} border-b border-gray-100 last:border-0`}
                            >
                              {/* Name + image */}
                              <div className="flex items-center gap-3 min-w-0">
                                {p.showImage !== false ? (
                                  <img
                                    src={p.image || FALLBACK_IMG}
                                    alt={p.name}
                                    onError={e => { e.currentTarget.src = FALLBACK_IMG; }}
                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg flex-shrink-0 bg-gradient-to-br from-brand-purple to-brand-magenta flex items-center justify-center text-white font-black text-sm">{p.name.charAt(0)}</div>
                                )}
                                <div className="min-w-0">
                                  <p className="font-black text-[13px] text-[#1A1A4E] leading-tight truncate">{p.name}</p>
                                  {p.isPremium && (
                                    <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Premium</span>
                                  )}
                                </div>
                              </div>

                              {/* Unit */}
                              <span className="hidden sm:block text-[11px] text-gray-400 font-semibold text-right whitespace-nowrap">{p.unit}</span>

                              {/* Price */}
                              <div className="text-right">
                                <p className="font-black text-base text-[#1A1A4E] leading-none">₹{p.discountPrice}</p>
                                <p className="text-[10px] text-gray-400 line-through leading-none mt-0.5">₹{p.mrp}</p>
                              </div>

                              {/* Qty control */}
                              <div className="flex items-center justify-end gap-1">
                                {cart[p.code] ? (
                                  <div className="flex items-center gap-1 bg-[#1A1A4E] rounded-xl px-1.5 py-1">
                                    <button
                                      onClick={() => updateQty(p.code, -1)}
                                      className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors active:scale-90"
                                    ><Minus size={12} /></button>
                                    <span className="w-6 text-center text-sm font-black text-white">{cart[p.code]}</span>
                                    <button
                                      onClick={() => updateQty(p.code, 1)}
                                      className="w-7 h-7 rounded-lg bg-pink-500 text-white flex items-center justify-center hover:bg-pink-400 transition-colors active:scale-90"
                                    ><Plus size={12} /></button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => updateQty(p.code, 1)}
                                    className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center hover:bg-pink-400 transition-colors shadow active:scale-90"
                                  ><Plus size={16} /></button>
                                )}
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3">
                          {cat.products.map(p => (
                            <div key={p.code} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                              <div className="aspect-square bg-gray-50 overflow-hidden">
                                {p.showImage === false ? (
                                  <div className="w-full h-full bg-gradient-to-br from-brand-purple to-brand-magenta flex items-center justify-center text-white font-black text-2xl">{p.name.charAt(0)}</div>
                                ) : (
                                  <img
                                    src={p.image || FALLBACK_IMG}
                                    alt={p.name}
                                    onError={e => { e.currentTarget.src = FALLBACK_IMG; }}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="p-3 flex-1 flex flex-col">
                                <h3 className="font-black text-xs text-[#1A1A4E] uppercase tracking-tight leading-tight truncate">{p.name}</h3>
                                {p.isPremium && (
                                  <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1 self-start">Premium</span>
                                )}
                                <div className="mt-auto pt-2 flex items-center justify-between">
                                  <div>
                                    <p className="font-black text-sm text-[#1A1A4E] leading-none">₹{p.discountPrice}</p>
                                    <p className="text-[9px] text-gray-400 line-through leading-none mt-0.5">₹{p.mrp}</p>
                                  </div>
                                  {cart[p.code] ? (
                                    <div className="flex items-center gap-1 bg-[#1A1A4E] rounded-lg px-1 py-1">
                                      <button onClick={() => updateQty(p.code, -1)} className="w-6 h-6 rounded-md bg-white/10 text-white flex items-center justify-center active:scale-90"><Minus size={11} /></button>
                                      <span className="w-5 text-center text-xs font-black text-white">{cart[p.code]}</span>
                                      <button onClick={() => updateQty(p.code, 1)} className="w-6 h-6 rounded-md bg-pink-500 text-white flex items-center justify-center active:scale-90"><Plus size={11} /></button>
                                    </div>
                                  ) : (
                                    <button onClick={() => updateQty(p.code, 1)} className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center shadow active:scale-90"><Plus size={14} /></button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      <OrderModal open={modalOpen} onClose={() => setModalOpen(false)} cart={cart} totals={totals} form={customerForm} setForm={setCustomerForm} />

      {/* ── FLOATING ORDER BUTTON (when cart has items) ── */}
      <AnimatePresence>
        {totals.count > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4"
          >
            <div className="bg-[#1A1A4E] rounded-2xl shadow-2xl flex items-center gap-4 px-5 py-3 max-w-sm w-full">
              <div className="flex-1">
                <p className="text-white font-black text-base leading-none">₹{totals.total.toLocaleString()}</p>
                <p className="text-white/50 text-[10px] font-bold mt-0.5">{totals.count} item{totals.count > 1 ? 's' : ''} in cart</p>
              </div>
              {totals.total >= MIN_ORDER ? (
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-green-500 hover:bg-green-400 text-white font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.855L.057 23.882l6.173-1.616A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.005-1.366l-.358-.213-3.714.974 1.01-3.61-.234-.373A9.783 9.783 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                  Order via WhatsApp
                </button>
              ) : (
                <button
                  onClick={() => {}}
                  className="bg-white/10 text-white/60 font-black text-xs px-5 py-2.5 rounded-xl cursor-default"
                >
                  <ShieldCheck size={14} className="inline mr-1" />
                  ₹{remaining.toLocaleString()} more
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
