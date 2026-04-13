"use client"

import { Package, Users, Star, Trophy } from "lucide-react"

const stats = [
  {
    icon: Package,
    number: "500+",
    label: "Products",
    bg: "from-orange-500 to-red-600",
    iconColor: "text-orange-500",
  },
  {
    icon: Users,
    number: "10K+",
    label: "Happy Customers",
    bg: "from-purple-500 to-pink-600",
    iconColor: "text-purple-500",
  },
  {
    icon: Star,
    number: "4.9/5",
    label: "Rating",
    bg: "from-yellow-500 to-orange-600",
    iconColor: "text-yellow-500",
  },
  {
    icon: Trophy,
    number: "15+",
    label: "Years Experience",
    bg: "from-green-500 to-teal-600",
    iconColor: "text-green-500",
  },
]

export function AnimatedStats() {
  return (
    <section className="py-24 celebration-bg relative overflow-hidden border-y border-white/5">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-brand-gold-400/5 blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-card group p-10 rounded-[2.5rem] border border-white/5 hover:border-brand-gold-400/30 transition-all duration-500 text-center relative overflow-hidden animate-fade-in-top"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold-400/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="w-16 h-16 mx-auto mb-8 rounded-2xl glass-gold flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-brand-gold-400/20 shadow-glow-gold">
                <stat.icon className="h-8 w-8 text-brand-gold-400" />
              </div>

              <div className="text-4xl font-black text-white mb-2 group-hover:text-gold transition-colors tracking-tighter">
                {stat.number}
              </div>
              <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] group-hover:text-white/60 transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
