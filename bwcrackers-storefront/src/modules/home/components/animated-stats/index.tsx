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
    <section className="py-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bg} p-6 text-center group hover:scale-105 transition-all duration-300 shadow-lg border-2 border-white`}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-md">
                <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
              </div>

              <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {stat.number}
              </div>
              <div className="text-sm text-white/90 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
