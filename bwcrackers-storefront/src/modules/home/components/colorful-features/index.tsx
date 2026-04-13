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
    theme: "emerald",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and secure delivery across all locations",
    theme: "gold",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round the clock customer service and assistance",
    theme: "pink",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Top-notch quality products from trusted brands",
    theme: "gold",
  },
  {
    icon: Sparkles,
    title: "Wide Variety",
    description: "Extensive collection for every celebration need",
    theme: "pink",
  },
  {
    icon: Heart,
    title: "Customer Love",
    description: "Trusted by thousands of happy customers",
    theme: "rose",
  },
]

export function ColorfulFeatures() {
  return (
    <section className="py-24 celebration-bg relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-brand-royal-700/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 glass-gold px-6 py-2 rounded-full mb-6 border border-brand-gold-400/20">
            <span className="text-display text-brand-gold-200 tracking-[0.2em]">The B&W Promise</span>
          </div>
          <h2 className="text-h2 text-white mb-6">
            Why Choose <span className="text-gold italic">Excellence</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-light">
            We redefine the art of celebration through quality, 
            safety, and unmatched service.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card group p-8 rounded-[2rem] border border-white/5 hover:border-brand-gold-400/30 transition-all duration-500 animate-fade-in-top"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-2xl glass-gold flex items-center justify-center mb-8 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-brand-gold-400/20">
                <feature.icon className="h-8 w-8 text-brand-gold-400" />
              </div>

              <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-gold transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/50 leading-relaxed font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
