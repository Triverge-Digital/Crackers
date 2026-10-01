'use client';

import Link from 'next/link';
import CategoryCover from '../ui/CategoryCover';
import { ChevronRight } from 'lucide-react';
import { COLLECTIONS } from '../../constants';
import { categoryImage } from '@/lib/catalog';
import { useCatalog } from '../../context/ShopContext';

export default function CollectionsPreview() {
  const { categories } = useCatalog();
  return (
    <section className="py-14 md:py-16 bg-gray-50 border-t border-brand-magenta/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="eyebrow mb-2">Curated for Diwali</p>
          <h2 className="section-title">Collections</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {COLLECTIONS.map(col => {
            const cat = categories.find(c => c.slug === col.slug);
            if (!cat) return null;
            const img = categoryImage(cat);
            return (
              <Link
                key={col.title}
                href={`/store/${cat.slug}`}
                className="group relative aspect-[3/4] rounded-2xl md:rounded-[28px] overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1.5"
              >
                {img ? <img src={img} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /> : <CategoryCover id={cat.id} />}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep via-brand-navy-deep/30 to-transparent" />
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                  <h3 className="text-sm md:text-lg font-black text-white leading-tight mb-1">{col.title}</h3>
                  <p className="text-white/75 text-xs font-bold hidden sm:block">{col.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-brand-gold text-xs font-black uppercase tracking-wider">
                    Shop now <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
