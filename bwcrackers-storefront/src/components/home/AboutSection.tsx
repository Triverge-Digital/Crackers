const STATS = [
  { num: '80%', label: 'Discount on MRP', hex: '#EC4899' },
  { num: '165', label: 'Items in 2026 list', hex: '#3B82F6' },
  { num: '10+', label: 'Years in Sivakasi', hex: '#F59E0B' },
  { num: '27', label: 'Categories', hex: '#22C55E' },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden scroll-mt-24 flex flex-col md:flex-row">
      <div className="w-full md:w-[45%] flex-shrink-0 self-stretch max-h-[360px] md:max-h-none">
        <img
          src="/discount.webp"
          alt="80% discount on MRP on all B&W Crackers"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center block"
        />
      </div>

      <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-8 md:px-12 py-12 md:py-16 bg-brand-ink">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 70% at 30% 50%, rgba(236,72,153,0.10) 0%, transparent 70%)' }} />
        <div className="relative">
          <span className="text-brand-gold text-xs font-black uppercase tracking-[5px]">Sivakasi · Tamil Nadu</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-none tracking-tight mt-3 font-display">
            <span className="text-white">B&amp;W </span>
            <span className="text-brand-magenta">Crackers</span>
          </h2>
          <p className="text-white/60 text-xs font-black uppercase tracking-[5px] mt-2 mb-8">Sivakasi pattasu, delivered</p>

          <dl className="grid grid-cols-2 gap-3 mb-8">
            {STATS.map(stat => (
              <div key={stat.label} className="rounded-2xl p-4 border" style={{ background: `${stat.hex}14`, borderColor: `${stat.hex}40` }}>
                <dd className="font-black text-3xl leading-none" style={{ color: stat.hex }}>{stat.num}</dd>
                <dt className="text-white/70 text-xs font-bold uppercase tracking-widest mt-1.5">{stat.label}</dt>
              </div>
            ))}
          </dl>

          <div className="space-y-3 text-white/75 text-sm leading-relaxed font-medium max-w-prose">
            <p>
              B&amp;W Crackers is a family-run fireworks business in Sivakasi, the town that produces most of India's fireworks. Because we sit next to the factories, we skip every layer of distribution and pass that saving to you as a flat 80% off the printed MRP.
            </p>
            <p>
              Every item in this list comes from licensed Sivakasi manufacturers, is stored in sealed cartons, and is packed by hand before dispatch. Prices are the same for one packet or a hundred.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
