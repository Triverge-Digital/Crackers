import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORY_HEX, FEATURED_CATEGORY_IDS } from '../../constants';
import { categories, categoryImage } from '../../lib/catalog';
import { formatINR } from '../../lib/format';

export default function FeaturedCategories() {
  const featured = FEATURED_CATEGORY_IDS.map(id => categories.find(c => c.id === id)).filter(Boolean) as typeof categories;

  return (
    <section id="categories" className="py-14 md:py-16 bg-brand-ink border-t border-white/5 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-brand-gold text-xs font-black uppercase tracking-[4px] mb-3">Sivakasi direct</p>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2 font-display">Shop by category</h2>
          <p className="text-white/60 text-sm font-medium">Flat 80% off MRP — every item, every category</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 max-w-4xl mx-auto">
          {featured.map((cat, i) => {
            const hex = CATEGORY_HEX[cat.id] || '#E6007E';
            const img = categoryImage(cat);
            const from = Math.min(...cat.products.map(p => p.discountPrice));
            return (
              <Link
                key={cat.id}
                to={`/store/${cat.slug}`}
                className={`group relative rounded-2xl overflow-hidden aspect-[4/5] transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 ${i === 0 ? 'col-span-2 md:col-span-1 aspect-[2/1] md:aspect-[4/5]' : ''}`}
                style={{ boxShadow: `0 0 0 1.5px ${hex}55, 0 8px 40px ${hex}20` }}
              >
                {img ? (
                  <img src={img} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${hex}, #1A1A4E)` }} />
                )}
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${hex}aa 0%, ${hex}22 45%, transparent 100%)` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                  <span className="bg-brand-magenta text-white text-xs font-black px-2 py-0.5 rounded-full shadow-lg">80% OFF</span>
                  <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-full">{cat.products.length} items</span>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-3 md:p-4">
                  <div className="w-8 h-1 rounded-full mb-2" style={{ background: hex }} />
                  <h3 className="font-black text-sm md:text-base text-white uppercase tracking-wide leading-tight">{cat.name}</h3>
                  <p className="text-white/75 text-xs font-medium mt-1 flex items-center gap-1">
                    From {formatINR(from)} <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/collections" className="btn-ghost">View all {categories.length} categories <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
