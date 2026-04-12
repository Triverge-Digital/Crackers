"use client"

import {
  Sparkles,
  Star,
  Zap,
  Flame,
  Gift,
  PartyPopper,
} from "lucide-react"
import { Button } from "@medusajs/ui"

export function FestivalBanner() {
  const onShopNow = () => {
    const productsSection = document.getElementById("featured-products")
    productsSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

      {/* Animated icons */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 animate-pulse">
          <Star className="h-12 w-12 text-yellow-300 fill-yellow-300" />
        </div>
        <div
          className="absolute top-20 right-20 animate-pulse"
          style={{ animationDelay: "0.1s" }}
        >
          <Sparkles className="h-10 w-10 text-pink-300" />
        </div>
        <div
          className="absolute bottom-20 left-1/4 animate-pulse"
          style={{ animationDelay: "0.2s" }}
        >
          <Zap className="h-14 w-14 text-orange-300 fill-orange-300" />
        </div>
        <div
          className="absolute top-1/2 right-10 animate-pulse"
          style={{ animationDelay: "0.3s" }}
        >
          <Flame className="h-12 w-12 text-red-300 fill-red-300" />
        </div>
        <div className="absolute bottom-20 right-1/3 animate-pulse">
          <Star className="h-10 w-10 text-purple-300 fill-purple-300" />
        </div>
        <div
          className="absolute top-32 left-1/3 animate-pulse"
          style={{ animationDelay: "0.15s" }}
        >
          <Gift className="h-10 w-10 text-yellow-300 fill-yellow-300" />
        </div>
        <div
          className="absolute bottom-32 right-20 animate-pulse"
          style={{ animationDelay: "0.25s" }}
        >
          <PartyPopper className="h-12 w-12 text-pink-300" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-purple-900 px-8 py-4 rounded-full shadow-2xl animate-bounce border-4 border-white">
              <span className="flex items-center gap-2 text-lg font-bold">
                <Flame className="h-6 w-6" />
                Limited Time Offer - Don&apos;t Miss Out!
                <Flame className="h-6 w-6" />
              </span>
            </div>
          </div>

          <h2 className="text-6xl md:text-8xl text-white font-bold leading-tight mb-6 drop-shadow-2xl">
            Celebrate Every
            <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              Moment with Joy
            </span>
          </h2>

          <p className="text-2xl text-white mb-8 drop-shadow-lg max-w-3xl mx-auto">
            Premium quality crackers at unbeatable prices. Make your festivals
            memorable with our exclusive collection of fireworks!
          </p>

          <Button
            onClick={onShopNow}
            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:to-red-600 text-xl px-12 py-8 shadow-2xl text-purple-900 hover:scale-110 transition-all duration-300 border-4 border-white font-bold"
          >
            <Sparkles className="mr-2 h-6 w-6" />
            Explore Our Collection
          </Button>

          <div className="flex flex-wrap justify-center gap-6 pt-12">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">🎊</div>
              <div className="text-3xl font-bold text-purple-900 mb-2">
                500+
              </div>
              <div className="text-sm text-purple-800 font-medium">
                Varieties
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-400 to-red-500 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">✨</div>
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-sm text-pink-100 font-medium">Certified</div>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-indigo-500 backdrop-blur-lg rounded-3xl p-8 border-4 border-white shadow-2xl hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">🎆</div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-purple-100 font-medium">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
