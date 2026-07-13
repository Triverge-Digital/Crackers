import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { pricelist } from '../data/pricelist';
import { FALLBACK_IMG, CATEGORY_COLORS } from '../constants';

type CollectionsViewProps = {
  setActiveView: (v: string) => void;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | number>>;
};

export default function CollectionsView({ setActiveView, setSelectedCategory }: CollectionsViewProps) {
  const goToCategory = (categoryId: string | number) => {
    setSelectedCategory(categoryId);
    setActiveView('order');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <motion.div
      key="collections"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto w-full px-4 py-12 md:py-16"
    >
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-brand-magenta uppercase tracking-tighter italic mb-2 font-display">Our Collections</h1>
        <div className="w-24 h-1.5 bg-brand-gold mx-auto rounded-full mb-4" />
        <p className="text-gray-500 font-bold text-sm max-w-md mx-auto">Browse fireworks by category — pick a collection to see everything in it.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {pricelist.map(cat => (
          <motion.div
            key={cat.id}
            whileHover={{ y: -6 }}
            onClick={() => goToCategory(cat.id)}
            className="relative aspect-[3/4] rounded-2xl md:rounded-[32px] overflow-hidden cursor-pointer group shadow-lg"
          >
            <img
              src={cat.products[0]?.image || FALLBACK_IMG}
              alt={cat.name}
              onError={e => { e.currentTarget.src = FALLBACK_IMG; }}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A2E] via-[#0A0A2E]/30 to-transparent" />
            <span className={`absolute top-3 left-3 ${CATEGORY_COLORS[cat.id] || 'bg-gray-700'} text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow`}>
              {cat.products.length} items
            </span>
            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
              <h3 className="text-sm md:text-lg font-black text-white leading-tight mb-1 uppercase tracking-tight">{cat.name}</h3>
              <div className="mt-2 inline-flex items-center gap-1 text-brand-gold text-[10px] font-black uppercase tracking-wider">
                Shop Now <ChevronRight size={12} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => { setActiveView('order'); window.scrollTo({ top: 0, behavior: 'auto' }); }}
          className="bg-brand-magenta text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-brand-magenta/90 transition-colors shadow-lg"
        >
          Browse Full Store
        </button>
      </div>
    </motion.div>
  );
}
