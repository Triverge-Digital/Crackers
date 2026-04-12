// modules/home/components/hero-section.tsx
'use client'

import { Sparkles, Star, Zap } from "lucide-react"
import { Button } from "@medusajs/ui"


export function HeroSection() {

  
  const onShopNow = () => {
    // Scroll to products section or navigate
    const productsSection = document.getElementById('featured-products')
    productsSection?.scrollIntoView({ behavior: 'smooth' })
  }

  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 min-h-screen flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-24 md:py-32 relative">
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-yellow-400 backdrop-blur-sm px-6 py-3 rounded-full shadow-2xl animate-bounce">
              <Star className="h-5 w-5 text-purple-900 fill-purple-900" />
              <span className="text-sm font-semibold text-purple-900">Premium Quality Crackers</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-bold drop-shadow-2xl leading-tight">
              Light Up Your
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Celebrations
              </span>
            </h1>
            
            <p className="text-xl text-white/90 drop-shadow-lg max-w-xl leading-relaxed">
              Experience the magic of festivals with our spectacular collection of premium fireworks and crackers. Quality guaranteed with 100% safety certification!
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="large"
                onClick={onShopNow}
                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:to-red-600 text-lg px-8 py-6 shadow-2xl text-purple-900 hover:scale-105 transition-all duration-300 border-2 border-white font-bold"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
              <Button 
                size="large"
                variant="secondary"
                onClick={onShopNow}
                className="border-2 border-white text-white hover:bg-white hover:text-purple-900 text-lg px-8 py-6 backdrop-blur-md shadow-2xl bg-white/10 hover:scale-105 transition-all duration-300 font-bold"
              >
                <Zap className="mr-2 h-5 w-5" />
                View Collections
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-8">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-4 border-2 border-white shadow-lg hover:scale-105 transition-transform min-w-[120px]">
                <div className="text-2xl font-bold text-purple-900">500+</div>
                <div className="text-sm text-purple-800 font-medium">Products</div>
              </div>
              <div className="bg-gradient-to-br from-pink-400 to-red-500 rounded-xl p-4 border-2 border-white shadow-lg hover:scale-105 transition-transform min-w-[120px]">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-pink-100 font-medium">Happy Customers</div>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-teal-500 rounded-xl p-4 border-2 border-white shadow-lg hover:scale-105 transition-transform min-w-[120px]">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-green-100 font-medium">Safe & Certified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating offer badge */}
      <div className="absolute bottom-10 right-10 bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-2xl shadow-2xl border-2 border-white animate-pulse hidden lg:block">
        <div className="text-center">
          <div className="text-3xl mb-1">🎆</div>
          <div className="text-2xl font-bold text-purple-900 mb-1">80%</div>
          <div className="text-sm font-semibold text-purple-800">OFF</div>
        </div>
      </div>
    </section>
  )
}