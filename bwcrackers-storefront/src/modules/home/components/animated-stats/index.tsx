import { Package, Users, Star, Trophy } from "lucide-react"

const stats = [
  {
    icon: Package,
    number: "500+",
    label: "Products",
    iconColor: "text-brand-pink-500",
  },
  {
    icon: Users,
    number: "10K+",
    label: "Happy Customers",
    iconColor: "text-brand-purple",
  },
  {
    icon: Star,
    number: "4.9/5",
    label: "Rating",
    iconColor: "text-brand-gold-500",
  },
  {
    icon: Trophy,
    number: "15+",
    label: "Years Experience",
    iconColor: "text-brand-pink-500",
  },
]

export function AnimatedStats() {
  return (
    <section className="py-24 bg-white relative overflow-hidden border-y border-brand-pink-500/5">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-brand-pink-500/5 blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group text-center animate-fade-in-top"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-white shadow-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-brand-pink-500/10`}>
                <stat.icon className={`h-10 w-10 ${stat.iconColor}`} />
              </div>

              <div className="text-5xl font-black text-brand-royal-950 mb-2 group-hover:text-brand-pink-500 transition-colors tracking-tightest">
                {stat.number}
              </div>
              <div className="text-[10px] text-text-muted font-black uppercase tracking-[0.3em] group-hover:text-brand-royal-950 transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
