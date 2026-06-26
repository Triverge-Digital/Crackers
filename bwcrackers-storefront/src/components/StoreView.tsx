import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, Star, ShoppingCart } from 'lucide-react';
import { pricelist, Product } from '../data/pricelist';
import { MIN_ORDER, FALLBACK_IMG, Totals } from '../constants';

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
  sortBy, setSortBy,
  selectedCategory, setSelectedCategory,
  searchQuery, setSearchQuery,
  allProducts, totals, cart, updateQty
}: StoreViewProps) {
  return (
    <motion.div
      key="order"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full min-h-screen gap-8 p-4 md:p-8 pb-40"
    >
      {/* SIDEBAR - REFINE SELECTION */}
      <aside className="w-full lg:w-72 flex-shrink-0">
         <div className="sticky top-[100px] space-y-8">
            <div className="bg-[#1A1A4E] rounded-[32px] p-8 border border-white/5 shadow-2xl">
               <h3 className="text-brand-gold font-black uppercase tracking-[0.2em] text-[10px] mb-8">Refine Selection</h3>

               <div className="space-y-6">
                  <div>
                     <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-4">Sort by</label>
                     <div className="space-y-2">
                        {[
                           { id: 'new', label: 'New Arrivals' },
                           { id: 'low-high', label: 'Price: Low to High' },
                           { id: 'high-low', label: 'Price: High to Low' }
                        ].map(sort => (
                           <button
                             key={sort.id}
                             onClick={() => setSortBy(sort.id)}
                             className={`w-full text-left px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${sortBy === sort.id ? 'bg-brand-magenta/10 border-brand-magenta text-white shadow-lg shadow-brand-magenta/20' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
                           >
                              <div className="flex items-center gap-3">
                                 <div className={`w-1.5 h-1.5 rounded-full ${sortBy === sort.id ? 'bg-brand-magenta animate-pulse' : 'bg-gray-600'}`} />
                                 {sort.label}
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div>
                     <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-4">Categories</label>
                     <div className="flex flex-wrap lg:flex-col gap-2">
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === 'all' ? 'bg-brand-gold text-brand-purple' : 'bg-white/5 text-gray-400'}`}
                        > All items </button>
                        {pricelist.map(cat => (
                           <button
                             key={cat.id}
                             onClick={() => setSelectedCategory(cat.id)}
                             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${selectedCategory === cat.id ? 'bg-brand-gold text-brand-purple shadow-lg shadow-brand-gold/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                           >
                              {cat.name}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* MIN ORDER STATUS SIDEBAR */}
            <div className={`rounded-[32px] p-8 border ${totals.total >= MIN_ORDER ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} shadow-2xl`}>
               <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Total Estimate</span>
               <div className="flex items-end gap-2 mb-4">
                  <span className={`text-4xl font-black italic tracking-tighter ${totals.total >= MIN_ORDER ? 'text-green-500' : 'text-red-500'}`}>₹{totals.total.toLocaleString()}</span>
               </div>
               {totals.total < MIN_ORDER ? (
                  <div className="space-y-3">
                     <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                        <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${(totals.total / MIN_ORDER) * 100}%` }} />
                     </div>
                     <p className="text-[9px] text-red-400 font-bold uppercase tracking-wider">Add ₹{(MIN_ORDER - totals.total).toLocaleString()} more to confirm</p>
                  </div>
               ) : (
                  <div className="flex items-center gap-2 text-green-500 bg-green-500/10 py-2 px-3 rounded-xl border border-green-500/20">
                     <ShieldCheck size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest leading-none">Min. Order Reached</span>
                  </div>
               )}
            </div>
         </div>
      </aside>

      {/* MAIN CONTENT - PRODUCT GRID */}
      <div className="flex-1">
         <div className="flex items-center justify-between mb-10 px-2 lg:px-0">
            <div className="flex flex-col">
               <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Showing</span>
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-brand-purple italic tracking-tighter">{allProducts.length}</span>
                  <span className="text-sm font-bold text-gray-400">products</span>
               </div>
            </div>

            {/* SEARCH BAR */}
            <div className="relative group hidden sm:block">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-magenta transition-colors" size={18} />
               <input
                  type="text"
                  placeholder="Search crackers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-2 border-gray-100 rounded-full py-4 pl-14 pr-8 text-sm font-bold focus:outline-none focus:border-brand-magenta/30 w-[300px] shadow-sm transition-all focus:shadow-xl focus:w-[400px]"
               />
            </div>
         </div>

         <motion.div
           layout
           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
         >
            {allProducts.map((p) => (
               <motion.div
                  key={p.code}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -12 }}
                  className="bg-white rounded-[40px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col group relative"
               >
                  {/* PRODUCT IMAGE SECTION (hidden for name-only "wala" crackers) */}
                  {p.showImage === false ? (
                     <div className="relative h-32 overflow-hidden bg-gradient-to-br from-brand-purple to-brand-magenta flex items-center justify-center px-6">
                        {p.isPremium && (
                           <div className="absolute top-6 left-6 z-10 bg-brand-gold text-brand-purple px-4 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest shadow-xl border border-white/20">
                              Premium
                           </div>
                        )}
                        <span className="text-2xl font-black text-white uppercase italic tracking-tighter text-center leading-tight drop-shadow-lg font-display">{p.name}</span>
                     </div>
                  ) : (
                  <div className="relative aspect-[4/4] overflow-hidden bg-gray-50">
                     {p.isPremium && (
                        <div className="absolute top-6 left-6 z-10 bg-brand-gold text-brand-purple px-4 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest shadow-xl border border-white/20">
                           Premium
                        </div>
                     )}
                     <img
                        src={p.image || FALLBACK_IMG}
                        alt={p.name}
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => updateQty(p.code, 1)}
                          className="bg-brand-magenta text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl scale-75 group-hover:scale-100 transition-all duration-500"
                        >
                          Quick Add
                        </button>
                     </div>
                  </div>
                  )}

                  {/* PRODUCT INFO */}
                  <div className="p-8 flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-black text-brand-purple uppercase tracking-tighter leading-tight drop-shadow-sm group-hover:text-brand-magenta transition-colors">{p.name}</h4>
                     </div>

                     <div className="flex items-center gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} size={12} className={i < (p.rating || 4) ? "text-brand-gold fill-brand-gold" : "text-gray-200 fill-gray-200"} />
                        ))}
                        <div className="ml-4 h-4 w-[1px] bg-gray-100 mx-2" />
                        <div className="flex items-center gap-1 text-green-500">
                           <ShieldCheck size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Safe & Quality</span>
                        </div>
                     </div>

                     <div className="mt-auto flex items-end justify-between pt-6 border-t border-gray-50">
                        <div className="flex flex-col">
                           <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 leading-none">Starting from</span>
                           <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-black text-brand-purple tracking-tighter leading-none italic">₹{p.discountPrice}</span>
                              <span className="text-xs text-brand-magenta/30 line-through font-bold">₹{p.mrp}</span>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-1.5 border border-gray-100 shadow-inner group-hover:bg-brand-magenta group-hover:border-brand-magenta transition-all duration-500">
                           {cart[p.code] ? (
                              <div className="flex items-center gap-3">
                                 <button
                                    onClick={() => updateQty(p.code, -1)}
                                    className="w-10 h-10 rounded-xl bg-white text-brand-purple flex items-center justify-center font-black shadow-md hover:scale-110 active:scale-90 transition-transform"
                                 > - </button>
                                 <span className="w-6 text-center font-black text-xs text-brand-purple group-hover:text-white">{cart[p.code]}</span>
                                 <button
                                    onClick={() => updateQty(p.code, 1)}
                                    className="w-10 h-10 rounded-xl bg-white text-brand-magenta flex items-center justify-center font-black shadow-md hover:scale-110 active:scale-90 transition-transform"
                                 > + </button>
                              </div>
                           ) : (
                              <button
                                 onClick={() => updateQty(p.code, 1)}
                                 className="w-11 h-11 rounded-xl bg-brand-gold text-brand-purple flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                              >
                                 <ShoppingCart size={22} fill="currentColor" />
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
         </motion.div>
      </div>
    </motion.div>
  );
}
