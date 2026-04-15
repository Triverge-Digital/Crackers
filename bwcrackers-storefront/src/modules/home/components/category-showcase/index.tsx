import { Sparkles } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categories = [
  {
    name: "SPARKLERS",
    description:
      "Ignite the night with enchanting sparklers that paint the sky with shimmering brilliance.",
    color: "bg-brand-pink-500",
    emoji: "✨",
    handle: "sparklers",
  },
  {
    name: "GARLAND CRACKERS",
    description:
      "Add elegance to your celebrations with garland crackers that bring a touch of grandeur.",
    color: "bg-brand-purple",
    emoji: "🎊",
    handle: "garland-crackers",
  },
  {
    name: "FLOWER POTS",
    description:
      "Experience nature's beauty in a burst of colorful petals with our vibrant flower pots.",
    color: "bg-brand-gold-500",
    emoji: "🌸",
    handle: "flower-pots",
  },
  {
    name: "GROUND CHAKKARS",
    description:
      "Watch mesmerizing spinning patterns with our premium ground chakkar collection.",
    color: "bg-orange-500",
    emoji: "🎡",
    handle: "ground-chakkars",
  },
  {
    name: "SOUND CRACKERS",
    description:
      "Make some noise with our powerful sound crackers for an unforgettable celebration.",
    color: "bg-red-500",
    emoji: "💥",
    handle: "sound-crackers",
  },
  {
    name: "SKY ROCKETS",
    description:
      "Shoot for the stars with our spectacular sky rockets that light up the night.",
    color: "bg-blue-500",
    emoji: "🚀",
    handle: "sky-rockets",
  },
]

export function CategoryShowcase() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-brand-pink-500/5 blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-brand-pink-50 px-6 py-2 rounded-full mb-6 border border-brand-pink-500/20">
            <span className="text-sm font-black text-brand-pink-500 uppercase tracking-widest">Our Collections</span>
          </div>
          <h2 className="text-h2 mb-4">
            Spectrum of <span className="text-brand-gradient italic underline decoration-brand-gold-500 decoration-4 underline-offset-8">Magic</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
            From whispering sparklers to thundering rockets, explore 
            categories designed to make every moment unforgettable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
          {categories.map((category, index) => (
            <LocalizedClientLink
              key={index}
              href={`/store`}
              className="group flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Ornate Scalloped Container for Icon/Emoji */}
              <div className="ornate-container w-64 h-64 mb-10 shadow-xl group-hover:rotate-6 transition-all">
                <span className="text-8xl drop-shadow-2xl filter group-hover:scale-125 transition-transform duration-500">{category.emoji}</span>
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-6 text-brand-pink-500 uppercase tracking-tighter decoration-brand-gold decoration-4 underline-offset-8 group-hover:underline">
                  {category.name}
                </h3>
                <p className="text-text-secondary text-lg leading-relaxed font-bold max-w-[280px] mx-auto">
                  {category.description}
                </p>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
