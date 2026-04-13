"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

const PARTICLE_LIFETIME = 2000 // ms
const SPAWN_RATE = 150 // ms

interface SparkProps {
  id: number
  color: string
}

const Spark = ({ color }: SparkProps) => {
  const [randomX] = useState(() => (Math.random() - 0.5) * 120) // Horizontal spread
  const [randomHeight] = useState(() => Math.random() * 250 + 150) // Vertical shoot
  const [delay] = useState(() => Math.random() * 0.2)

  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
      animate={{
        y: -randomHeight,
        x: randomX,
        opacity: 0,
        scale: 0.2,
      }}
      transition={{
        duration: 1.8,
        ease: "easeOut",
        delay,
      }}
      className="absolute w-1.5 h-1.5 rounded-full blur-[1px] z-50 will-change-transform"
      style={{
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`,
        bottom: 0,
        left: "50%",
      }}
    />
  )
}

export function FlowerPot() {
  const [sparks, setSparks] = useState<{ id: number; color: string }[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now()
      const color = Math.random() > 0.3 ? "#fbbf24" : "#ffffff" // Gold or white-hot
      setSparks((prev) => [...prev, { id, color }].slice(-25)) // Cap at 25 particles
    }, SPAWN_RATE)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-4 h-4 bg-brand-gold-400 blur-md opacity-30 animate-pulse"></div>
      <AnimatePresence>
        {sparks.map((spark) => (
          <Spark key={spark.id} id={spark.id} color={spark.color} />
        ))}
      </AnimatePresence>
    </div>
  )
}
