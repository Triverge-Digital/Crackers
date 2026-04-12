"use client"

import { Sparkles, Star, Flame } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const images = [
  {
    url: "/images/products/product-33.jpeg",
    title: "Fireworks Extravaganza",
    gradient: "from-purple-500/90 to-pink-500/90",
    icon: Sparkles,
  },
  {
    url: "/images/products/product-35.jpeg",
    title: "80% OFF Special",
    gradient: "from-pink-500/90 to-red-500/90",
    icon: Star,
  },
  {
    url: "/images/products/product-37.jpeg",
    title: "Premium Gift Boxes",
    gradient: "from-orange-500/90 to-yellow-500/90",
    icon: Flame,
  },
]

export function ImageGallery() {
  return (
    <section className="py-16 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl text-white font-bold mb-4 drop-shadow-lg">
            Magical Moments
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Capture the essence of celebrations with our spectacular fireworks
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {images.map((image, index) => (
            <LocalizedClientLink
              key={index}
              href="/store"
              className="group relative overflow-hidden rounded-3xl hover:scale-105 transition-all duration-500 cursor-pointer shadow-2xl border-4 border-white block"
            >
              <div className="aspect-[4/5]">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-t ${image.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4`}
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <image.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-white drop-shadow-lg px-4 text-center">
                  {image.title}
                </h3>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
