"use client"

import { useEffect, useRef, useState } from "react"

import { motion } from "framer-motion"

export const FadeIn = ({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const transforms: Record<string, string> = {
    up: "translateY(20px)",
    down: "translateY(-20px)",
    left: "translateX(20px)",
    right: "translateX(-20px)",
    none: "translate(0,0)",
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0, 0)" : transforms[direction],
        transition: `opacity 0.6s cubic-bezier(0.21, 0.47, 0.32, 0.98) ${delay}s, transform 0.6s cubic-bezier(0.21, 0.47, 0.32, 0.98) ${delay}s`,
        willChange: isVisible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  )
}

export const Float = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}

export const PremiumWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        animation: "fadeInScale 0.5s ease-out forwards",
      }}
    >
      {children}
    </div>
  )
}
