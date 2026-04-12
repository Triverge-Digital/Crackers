// modules/home/components/full-width-promo.tsx
'use client'

import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@medusajs/ui"


export function FullWidthPromo(){

  const onShopNow = () => {
    // Scroll to products section or navigate
    const productsSection = document.getElementById('featured-products')
    productsSection?.scrollIntoView({ behavior: 'smooth' })
  }

  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
      <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-orange-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 py-20 relative">
        <div className="max-w-3xl">
          <div className="inline-block mb-6">
            <div className="bg-yellow-400 text-purple-900 px-6 py-3 rounded-full shadow-xl border-2 border-white animate-pulse font-semibold">
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                MEGA SALE ALERT!
              </span>
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl text-white font-bold mb-6 drop-shadow-2xl leading-tight">
            Light Up Your
            <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              Savings Today!
            </span>
          </h2>

          <p className="text-xl text-white mb-8 drop-shadow-lg max-w-2xl">
            Get instant discounts on all premium crackers. Limited time offer - Shop now and celebrate big!
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              onClick={onShopNow}
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:to-red-600 text-lg px-8 py-6 shadow-2xl text-purple-900 hover:scale-105 transition-all duration-300 border-2 border-white font-bold"
            >
              Shop Now & Save 80%
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-12 max-w-md">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white text-center">
              <div className="text-2xl font-bold text-yellow-300 mb-1">80%</div>
              <div className="text-sm text-white/90 font-medium">Discount</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white text-center">
              <div className="text-2xl font-bold text-yellow-300 mb-1">₹2500</div>
              <div className="text-sm text-white/90 font-medium">Min Order</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white text-center">
              <div className="text-2xl font-bold text-yellow-300 mb-1">Free</div>
              <div className="text-sm text-white/90 font-medium">Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}