"use client"

import {
  Shield,
  Truck,
  Headphones,
  Award,
  Sparkles,
  Heart,
} from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Safety First",
    description: "All products certified and tested for maximum safety",
    bgGradient: "from-green-500 to-emerald-600",
    iconColor: "text-emerald-500",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and secure delivery across all locations",
    bgGradient: "from-blue-500 to-cyan-600",
    iconColor: "text-cyan-500",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round the clock customer service and assistance",
    bgGradient: "from-purple-500 to-pink-600",
    iconColor: "text-pink-500",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Top-notch quality products from trusted brands",
    bgGradient: "from-yellow-500 to-orange-600",
    iconColor: "text-orange-500",
  },
  {
    icon: Sparkles,
    title: "Wide Variety",
    description: "Extensive collection for every celebration need",
    bgGradient: "from-pink-500 to-red-600",
    iconColor: "text-red-500",
  },
  {
    icon: Heart,
    title: "Customer Love",
    description: "Trusted by thousands of happy customers",
    bgGradient: "from-red-500 to-rose-600",
    iconColor: "text-rose-500",
  },
]

export function ColorfulFeatures() {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNNDAgNDBjMC00LjQyLTMuNTgtOC04LThzLTggMy41OC04IDggMy41OCA0IDggOCA0LTMuNTggOC04eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl text-white font-bold mb-4 drop-shadow-lg">
            Why Choose Us
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Experience the best shopping journey with our premium services
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${feature.bgGradient} p-8 hover:shadow-2xl transition-all duration-300 border-4 border-white hover:scale-105`}
              style={{
                animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>

              <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <feature.icon className={`h-10 w-10 ${feature.iconColor}`} />
              </div>

              <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-md">
                {feature.title}
              </h3>
              <p className="text-white/90 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `,
        }}
      />
    </section>
  )
}
