import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "id,handle,title",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-brand-royal-950 text-white py-24 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-brand-gold-400/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="content-container relative z-10">
        <div className="grid md:grid-cols-4 gap-12 lg:gap-24">
          <div className="col-span-1 md:col-span-1">
            <LocalizedClientLink href="/" className="group inline-block mb-10">
              <div className="flex flex-col leading-none">
                <span className="text-gold font-black text-3xl font-serif tracking-tight group-hover:scale-105 transition-transform">
                  B&W
                </span>
                <span className="text-white/70 text-[10px] uppercase tracking-[0.2em] font-bold">
                  Crackers
                </span>
              </div>
            </LocalizedClientLink>
            <p className="text-white/40 text-sm leading-relaxed font-light">
              Crafting celestial moments since 2010. We bring the magic of 
              the stars to your celebrations with premium quality fireworks 
              from Sivakasi.
            </p>
          </div>

          <div>
            <h4 className="text-display text-brand-gold-400 mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium">
              {["Home", "Store", "Collections", "About", "Cart"].map((item) => (
                <li key={item}>
                  <LocalizedClientLink
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-white/50 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <div className="h-0.5 w-0 bg-brand-gold-400 transition-all group-hover:w-3"></div>
                    {item}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-display text-brand-gold-400 mb-8">Collections</h4>
            <ul className="space-y-4 text-sm font-medium">
              {productCategories?.slice(0, 6).map((c) => {
                if (c.parent_category) return null
                return (
                  <li key={c.id}>
                    <LocalizedClientLink
                      href={`/categories/${c.handle}`}
                      className="text-white/50 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <div className="h-0.5 w-0 bg-brand-gold-400 transition-all group-hover:w-3"></div>
                      {c.name}
                    </LocalizedClientLink>
                  </li>
                )
              })}
              {(!productCategories || productCategories.length === 0) && (
                ["Sparklers", "Aerial Fireworks", "Sound Crackers", "VIP Combo Packs"].map((item) => (
                  <li key={item}>
                    <span className="text-white/50 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                      <div className="h-0.5 w-0 bg-brand-gold-400 transition-all group-hover:w-3"></div>
                      {item}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-display text-brand-gold-400 mb-8">Connectivity</h4>
            <ul className="space-y-4 text-sm font-light text-white/50 leading-relaxed">
              <li className="flex flex-col">
                <span className="text-white/20 text-[10px] uppercase font-black tracking-widest mb-1">Inquiry</span>
                info@bwcrackers.com
              </li>
              <li className="flex flex-col">
                <span className="text-white/20 text-[10px] uppercase font-black tracking-widest mb-1">Hotline</span>
                +91 98765 43210
              </li>
              <li className="flex flex-col">
                <span className="text-white/20 text-[10px] uppercase font-black tracking-widest mb-1">Heritage</span>
                Sivakasi, Tamil Nadu, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} B&W Crackers. The Art of Celebration.
          </p>
          <div className="flex gap-6">
            {["Instagram", "WhatsApp", "Facebook"].map((social) => (
              <span key={social} className="text-white/20 hover:text-brand-gold-400 transition-colors text-[10px] font-black uppercase tracking-widest cursor-pointer">
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
