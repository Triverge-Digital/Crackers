'use client';

import { Brand } from '../../constants';

export default function BrandsMarquee({ brands }: { brands: Brand[] }) {
  if (!brands.length) return null;
  return (
    <section className="bg-white py-10 border-t border-gray-100 overflow-hidden" aria-label="Brands we stock">
      <div className="container mx-auto px-4 mb-6 text-center">
        <p className="eyebrow mb-2">Trusted manufacturers</p>
        <h2 className="section-title text-xl md:text-2xl">Brands we stock</h2>
      </div>
      <div className="overflow-hidden scroll-fade-x">
        <ul className="flex w-max items-center gap-12 animate-marquee" style={{ animationDuration: `${Math.max(20, brands.length * 5)}s` }}>
          {[...brands, ...brands].map((brand, i) => (
            <li key={i} className="w-28 h-16 flex-shrink-0" aria-hidden={i >= brands.length}>
              <img src={brand.logo_url} alt={i < brands.length ? brand.name : ''} loading="lazy" decoding="async" className="w-full h-full object-contain" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
