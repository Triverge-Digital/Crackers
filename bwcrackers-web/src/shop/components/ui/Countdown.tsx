'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useShopConstants } from '../../context/ShopContext';

function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Diwali dispatch countdown: a bold magenta→orange sale banner with chunky number tiles. */
export default function Countdown({ compact = false }: { compact?: boolean }) {
  const { DISPATCH_DEADLINE } = useShopConstants();
  const deadline = DISPATCH_DEADLINE ? new Date(DISPATCH_DEADLINE).getTime() : null;
  // null until mounted: the server can't know the visitor's clock, so the first render shows placeholders.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!deadline) return;
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [deadline]);

  if (!deadline || (now !== null && deadline - now <= 0)) return null;
  const left = now === null ? null : parts(deadline - now);
  const dayLabel = new Date(deadline).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short' });

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-black text-brand-navy" role="timer" aria-live="off">
        <Clock size={14} className="text-brand-magenta" />
        {left ? `Diwali dispatch closes in ${left.days}d ${left.hours}h ${left.minutes}m` : `Diwali dispatch closes ${dayLabel}`}
      </span>
    );
  }

  const cells = [
    { v: left?.days, l: left?.days === 1 ? 'Day' : 'Days' },
    { v: left?.hours, l: 'Hours' },
    { v: left?.minutes, l: 'Mins' },
    { v: left?.seconds, l: 'Secs', accent: true },
  ];

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={`Diwali dispatch closes ${dayLabel}`}
      className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-brand-magenta via-[#ff2d6f] to-[#ff7a1a] p-5 sm:p-8 shadow-[0_20px_50px_-15px_rgba(230,0,126,0.7)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0 12px, transparent 12px 24px)' }}
      />
      <div className="relative flex flex-col lg:flex-row items-center gap-5 lg:gap-10">
        <div className="text-center lg:text-left flex-1">
          <p className="font-display text-white text-3xl sm:text-5xl leading-none uppercase tracking-wide">
            Diwali dispatch<br className="hidden lg:block" /> closes in
          </p>
          <p className="mt-2.5 text-white/90 font-extrabold text-sm sm:text-base">
            Order before <span className="bg-white text-brand-magenta rounded-md px-2 py-0.5">{dayLabel}</span>
          </p>
        </div>
        <div className="flex items-end gap-2 sm:gap-3">
          {cells.map(c => (
            <div key={c.l} className="text-center">
              <div className="bg-white rounded-2xl w-[66px] sm:w-[92px] py-3 sm:py-4 shadow-[0_8px_0_rgba(0,0,0,0.18)]">
                <span className={`font-display block text-4xl sm:text-6xl leading-none tabular-nums ${c.accent ? 'text-brand-magenta' : 'text-brand-navy'}`}>
                  {c.v === undefined ? '--' : pad(c.v)}
                </span>
              </div>
              <span className="block mt-2 text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-widest">{c.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
