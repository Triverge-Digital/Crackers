import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { POSTERS, HERO_INTERVAL_MS } from '../../constants';

export default function Hero() {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [underlay, setUnderlay] = useState(0);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const hovering = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

  // Prefetch every banner (the variant for this viewport) so slides never flash.
  useEffect(() => {
    let cancelled = false;
    const mobile = isMobile();
    Promise.all(POSTERS.map(p => new Promise<void>(resolve => {
      const img = new Image();
      img.onload = img.onerror = () => resolve();
      img.src = mobile ? p.mobile : p.desktop;
    }))).then(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, []);

  // Keep the previous slide underneath during the crossfade.
  useEffect(() => {
    if (current === underlay) return;
    const t = window.setTimeout(() => setUnderlay(current), 900);
    return () => window.clearTimeout(t);
  }, [current, underlay]);

  useEffect(() => {
    if (paused || reduce) return;
    const timer = window.setInterval(() => {
      if (hovering.current || document.hidden) return;
      setCurrent(p => (p + 1) % POSTERS.length);
    }, HERO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [current, paused, reduce]);

  const go = (next: number | ((p: number) => number)) => {
    setCurrent(p => {
      const v = typeof next === 'function' ? next(p) : next;
      return ((v % POSTERS.length) + POSTERS.length) % POSTERS.length;
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

  const Slide = ({ index, className, style, ariaHidden }: { index: number; className: string; style?: React.CSSProperties; ariaHidden?: boolean }) => {
    const p = POSTERS[index];
    return (
      <picture aria-hidden={ariaHidden}>
        <source media="(max-width: 767px)" srcSet={p.mobile} />
        <img
          src={p.desktop}
          alt={ariaHidden ? '' : p.alt}
          draggable={false}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          decoding="async"
          className={className}
          style={style}
        />
      </picture>
    );
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Diwali offers"
      className="relative w-full overflow-hidden touch-pan-y aspect-[3/2] md:aspect-[1920/767] bg-[#0f0f2e]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => { hovering.current = true; }}
      onMouseLeave={() => { hovering.current = false; }}
    >
      <div className="absolute inset-0">
        <Slide index={underlay} ariaHidden className="absolute inset-0 w-full h-full object-cover object-center select-none" />
      </div>
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: ready && !reduce ? 0 : 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.85, ease: [0.4, 0, 0.2, 1] }}
          aria-live="polite"
        >
          <Slide index={current} className="absolute inset-0 w-full h-full object-cover object-center select-none" />
        </motion.div>
      </AnimatePresence>

      {/* Invisible click target over the "Shop now" area of every creative */}
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
          <button
            type="button"
            onClick={() => setPaused(v => !v)}
            aria-label={paused ? 'Play banner slideshow' : 'Pause banner slideshow'}
            aria-pressed={paused}
            className="ml-1 w-7 h-7 rounded-full text-white/90 hover:bg-white/15 flex items-center justify-center"
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
        </div>
      </div>
    </section>
  );
}
