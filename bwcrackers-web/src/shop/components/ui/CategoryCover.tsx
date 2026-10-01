'use client';

import { categoryAccent } from '@/lib/catalog';

/**
 * Cover art for a category card when no product in it has a photo yet:
 * the category colour with a drawn firework burst. Replaced automatically by
 * the first product photo as soon as one is uploaded in the admin panel.
 */
export default function CategoryCover({ id, className = '' }: { id: number; className?: string }) {
  const accent = categoryAccent(id);
  const rays = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden ${className}`} style={{ background: `radial-gradient(circle at 50% 38%, ${accent} 0%, ${accent}cc 35%, #1A1A4E 90%)` }}>
      <svg viewBox="-100 -100 200 200" className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[85%] opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
        {rays.map(a => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1="-18" x2="0" y2={a % 45 === 0 ? -78 : -58} stroke="white" strokeOpacity="0.85" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="0" cy={a % 45 === 0 ? -86 : -66} r={a % 45 === 0 ? 4.5 : 3} fill="#FFD700" />
          </g>
        ))}
        <circle r="10" fill="white" />
        <circle r="5" fill="#FFD700" />
      </svg>
      {[[18, 22, 3], [80, 16, 2], [86, 58, 2.5], [12, 64, 2]].map(([x, y, r], i) => (
        <span key={i} className="absolute rounded-full bg-white/80" style={{ left: `${x}%`, top: `${y}%`, width: r * 2, height: r * 2 }} />
      ))}
    </div>
  );
}
