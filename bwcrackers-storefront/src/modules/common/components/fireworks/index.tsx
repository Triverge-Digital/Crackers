"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

const PARTICLE_COUNT = 12
const COLORS = ["#fbbf24", "#fb6b2b", "#ec4899", "#7c3aed", "#fbbf24"]

interface ParticleProps {
  x: number
  y: number
  color: string
}

const Particle = ({ x, y, color }: ParticleProps) => (
  <motion.div
    initial={{ x, y, scale: 1, opacity: 1 }}
    animate={{
      x: x + (Math.random() - 0.5) * 200,
      y: y + (Math.random() - 0.5) * 200 + 50, // Slight gravity fall
      scale: 0,
      opacity: 0,
    }}
    transition={{ duration: 1.5, ease: "easeOut" }}
    className="absolute w-1.5 h-1.5 rounded-full blur-[1px] z-50 will-change-transform"
    style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
  />
)

const Rocket = ({ onBurst }: { onBurst: (x: number, y: number) => void }) => {
  const [startX] = useState(() => Math.random() * 80 + 10) // 10% to 90%
  const [targetY] = useState(() => Math.random() * 40 + 20) // 20% to 60%

  return (
    <motion.div
      initial={{ bottom: "-5%", left: `${startX}%`, opacity: 1, scale: 1 }}
      animate={{ bottom: `${100 - targetY}%`, scale: 0.5 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      onAnimationComplete={() => onBurst(startX, targetY)}
      className="absolute w-1 h-4 bg-brand-gold-400 blur-[1px] z-40 rounded-full will-change-transform"
      style={{ boxShadow: "0 0 15px #fbbf24" }}
    >
      {/* Smoke trail */}
      <motion.div
        animate={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-t from-transparent to-white/20"
      />
    </motion.div>
  )
}

export function Fireworks() {
  const [fireworks, setFireworks] = useState<{ id: number; x: number; y: number; color: string }[]>([])
  const [rockets, setRockets] = useState<{ id: number }[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setRockets((prev) => [...prev, { id: Date.now() }])
    }, 1200)

    return () => clearInterval(interval)
  }, [])

  const handleBurst = (x: number, y: number) => {
    const id = Date.now()
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    setFireworks((prev) => [...prev, { id, x, y, color }])
    
    // Cleanup
    setTimeout(() => {
      setFireworks((prev) => prev.filter((f) => f.id !== id))
      setRockets((prev) => prev.filter((r) => r.id !== id))
    }, 2000)
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {rockets.map((rocket) => (
        <Rocket key={rocket.id} onBurst={handleBurst} />
      ))}
      
      <AnimatePresence>
        {fireworks.map((fw) => (
          <div
            key={fw.id}
            className="absolute inset-0"
            style={{ left: `${fw.x}%`, top: `${fw.y}%` }}
          >
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
              <Particle key={i} x={0} y={0} color={fw.color} />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
