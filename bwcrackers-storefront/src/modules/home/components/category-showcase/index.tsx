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
    <section className="py-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-orange-300 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl text-white font-bold mb-4 drop-shadow-lg">
            OUR PRODUCTS
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 mx-auto rounded-full"></div>
          <p className="text-xl text-white/90 mt-4 max-w-2xl mx-auto">
            Explore our wide range of premium quality crackers for every
            celebration
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <LocalizedClientLink
              key={index}
              href={`/store`}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${category.color} p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-4 border-white hover:scale-105`}
            >
              <div className="absolute top-0 right-0 text-6xl opacity-20 transform rotate-12">
                {category.emoji}
              </div>

              <div className="relative z-10">
                <div className="text-4xl mb-4">{category.emoji}</div>
                <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">
                  {category.name}
                </h3>
                <p className="text-white/90 leading-relaxed mb-4">
                  {category.description}
                </p>

                <div className="flex items-center gap-2 text-sm group-hover:translate-x-2 transition-transform duration-300">
                  <span className="text-white flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    Explore Collection
                  </span>
                  <span className="text-white">→</span>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
