'use client';

import Link from 'next/link';
import CategoryCover from '../components/ui/CategoryCover';
import { ChevronRight } from 'lucide-react';

import { categoryImage, categoryAccent } from '@/lib/catalog';
import { useCatalog } from '../context/ShopContext';
import { formatINR } from '../lib/format';

export default function CollectionsPage() {
  const { categories } = useCatalog();
  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-10 md:py-14 pb-32">
      <div className="text-center mb-10">
        <p className="eyebrow mb-2">{categories.length} categories · {categories.reduce((n, c) => n + c.products.length, 0)} items</p>
        <h1 className="section-title text-3xl md:text-4xl">Browse by category</h1>
        <p className="text-gray-600 font-medium text-sm max-w-md mx-auto mt-3">Pick a category to see every item and price in it.</p>
      </div>

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {categories.map(cat => {
          const img = categoryImage(cat);
          const from = Math.min(...cat.products.map(p => p.discountPrice));
          return (
            <li key={cat.id}>
              <Link
                href={`/store/${cat.slug}`}
                className="group relative block aspect-[3/4] rounded-2xl md:rounded-[28px] overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1.5"
              >
                {img ? (
                  <img src={img} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <CategoryCover id={cat.id} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep via-brand-navy-deep/30 to-transparent" />
                <span className="absolute top-3 left-3 text-white text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow" style={{ backgroundColor: categoryAccent(cat.id) }}>
                  {cat.products.length} items
                </span>
                <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-end">
                  <h2 className="text-sm md:text-base font-black text-white leading-tight uppercase tracking-tight">{cat.name}</h2>
                  <p className="text-white/75 text-xs font-bold mt-1">From {formatINR(from)}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-brand-gold text-xs font-black uppercase tracking-wider">
                    Shop now <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-12 text-center">
        <Link href="/store" className="btn-primary px-8">Browse the full store</Link>
      </div>
    </div>
  );
}
