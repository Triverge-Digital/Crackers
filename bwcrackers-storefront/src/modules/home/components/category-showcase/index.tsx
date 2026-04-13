"use client"

import { Sparkles } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categories = [
  {
    name: "SPARKLERS",
    description:
      "Ignite the night with enchanting sparklers that paint the sky with shimmering brilliance.",
    color: "from-pink-500 to-purple-600",
    emoji: "✨",
    handle: "sparklers",
  },
  {
    name: "GARLAND CRACKERS",
    description:
      "Add elegance to your celebrations with garland crackers that bring a touch of grandeur.",
    color: "from-orange-500 to-red-600",
    emoji: "🎊",
    handle: "garland-crackers",
  },
  {
    name: "FLOWER POTS",
    description:
      "Experience nature's beauty in a burst of colorful petals with our vibrant flower pots.",
    color: "from-yellow-500 to-orange-500",
    emoji: "🌸",
    handle: "flower-pots",
  },
  {
    name: "GROUND CHAKKARS",
    description:
      "Watch mesmerizing spinning patterns with our premium ground chakkar collection.",
    color: "from-red-500 to-pink-600",
    emoji: "🎡",
    handle: "ground-chakkars",
  },
  {
    name: "SOUND CRACKERS",
    description:
      "Make some noise with our powerful sound crackers for an unforgettable celebration.",
    color: "from-blue-500 to-purple-600",
    emoji: "💥",
    handle: "sound-crackers",
  },
  {
    name: "SKY ROCKETS",
    description:
      "Shoot for the stars with our spectacular sky rockets that light up the night.",
    color: "from-green-500 to-teal-600",
    emoji: "🚀",
    handle: "sky-rockets",
  },
]

export function CategoryShowcase() {
  return (
    <section className="py-24 celebration-bg relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-brand-gold-400/5 blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 glass-gold px-6 py-2 rounded-full mb-6 border border-brand-gold-400/20">
            <span className="text-display text-brand-gold-200 tracking-[0.2em]">Crafted Collections</span>
          </div>
          <h2 className="text-h2 text-white mb-6">
            Master the <span className="text-gold italic">Art of Celebration</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
            From whispering sparklers to thundering rockets, explore 
            categories designed to make every moment unforgettable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <LocalizedClientLink
              key={index}
              href={`/store`}
              className="glass-card group p-10 rounded-[2.5rem] border border-white/5 hover:border-brand-gold-400/30 transition-all duration-500 cursor-pointer relative overflow-hidden animate-fade-in-top"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 text-7xl opacity-5 transform rotate-12 group-hover:rotate-45 transition-transform duration-700 pointer-events-none">
                {category.emoji}
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl glass-gold flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500 border border-brand-gold-400/20">
                  <span className="text-3xl">{category.emoji}</span>
                </div>

                <h3 className="text-2xl font-black mb-4 text-white group-hover:text-gold transition-colors tracking-tight">
                  {category.name}
                </h3>
                <p className="text-white/40 leading-relaxed mb-8 font-light line-clamp-2">
                  {category.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold-400 group-hover:gap-4 transition-all">
                  Show Catalog
                  <span className="text-lg">→</span>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
