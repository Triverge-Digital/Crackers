import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { POSTERS, HERO_INTERVAL_MS } from '../../constants';

function Slide({ index, alt }: { index: number; alt?: string }) {
  const p = POSTERS[index];
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={p.mobile} />
      <img
        src={p.desktop}
        alt={alt ?? ''}
        draggable={false}
        // React 18 only forwards the lowercase attribute.
        {...{ fetchpriority: index === 0 ? 'high' : 'auto' }}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center select-none"
      />
    </picture>
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [base, setBase] = useState(0);
  const hovering = useRef(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
    POSTERS.forEach(p => {
      const img = new Image();
      img.src = mobile ? p.mobile : p.desktop;
    });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (hovering.current || document.hidden) return;
      setCurrent(p => {
        const n = (p + 1) % POSTERS.length;
        setBase(p);
        return n;
      });
    }, HERO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  const go = (next: number | ((p: number) => number)) => {
    setCurrent(p => {
      const v = typeof next === 'function' ? next(p) : next;
      const n = ((v % POSTERS.length) + POSTERS.length) % POSTERS.length;
      if (n !== p) setBase(p);
      return n;
    });
  };

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) go(p => p - 1);
    else if (dx < -50) go(p => p + 1);
    touchStartX.current = null;
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Diwali offers"
      className="relative w-full overflow-hidden touch-pan-y aspect-[3/2] md:aspect-[1920/767]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => { hovering.current = true; }}
      onMouseLeave={() => { hovering.current = false; }}
    >
      {/* Previous slide stays fully opaque underneath so a loop never reveals empty colour. */}
      <div className="absolute inset-0">
        <Slide index={base} />
      </div>
      <div
        key={current}
        className={`absolute inset-0 ${current === base ? '' : 'animate-fade-in'}`}
      >
        <Slide index={current} alt={POSTERS[current].alt} />
      </div>

      <Link to="/store" className="absolute inset-0 z-10" aria-label="Shop the 2026 price list" />

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-3 hidden md:flex justify-between z-20 pointer-events-none">
        <button type="button" onClick={() => go(p => p - 1)} className="pointer-events-auto icon-btn w-11 h-11 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-brand-magenta" aria-label="Previous banner"><ChevronLeft size={24} /></button>
        <button type="button" onClick={() => go(p => p + 1)} className="pointer-events-auto icon-btn w-11 h-11 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-brand-magenta" aria-label="Next banner"><ChevronRight size={24} /></button>
      </div>

      <div className="absolute bottom-2.5 md:bottom-4 inset-x-0 flex items-center justify-center gap-2 z-20">
        <div className="flex items-center gap-1 bg-black/35 backdrop-blur-sm rounded-full px-2 py-1" role="tablist" aria-label="Choose banner">
          {POSTERS.map((p, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Banner ${i + 1}: ${p.alt}`}
              onClick={() => go(i)}
              className="p-1.5 rounded-full"
            >
              <span className={`block h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-brand-gold' : 'w-2 bg-white/60'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
