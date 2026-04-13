"use client"

import React, { useEffect, useRef } from "react"

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
  gravity: number
  friction: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    // High initial upward velocity with random horizontal spread
    this.vx = (Math.random() - 0.5) * 4
    this.vy = -Math.random() * 8 - 4
    this.maxLife = Math.random() * 60 + 40
    this.life = this.maxLife
    this.size = Math.random() * 2 + 0.5
    this.gravity = 0.15
    this.friction = 0.98
    this.color = ""
  }

  update() {
    this.vy += this.gravity
    this.vx *= this.friction
    this.vy *= this.friction
    this.x += this.vx
    this.y += this.vy
    this.life--

    // Cooling color logic: White-hot -> Gold -> Orange
    const lifeRatio = this.life / this.maxLife
    if (lifeRatio > 0.8) this.color = `rgba(255, 255, 255, ${lifeRatio})`
    else if (lifeRatio > 0.4) this.color = `rgba(251, 191, 36, ${lifeRatio})`
    else this.color = `rgba(251, 107, 43, ${lifeRatio})`
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    
    // Aesthetic glow per particle
    if (this.life / this.maxLife > 0.6) {
      ctx.shadowBlur = 5
      ctx.shadowColor = this.color
    } else {
      ctx.shadowBlur = 0
    }
  }
}

export function RealisticFlowerPot() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    const particles = particlesRef.current

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      canvas.height = canvas.parentElement?.clientHeight || 400
    }

    const animate = () => {
      // Create trailing effect by not fully clearing
      ctx.fillStyle = "rgba(10, 5, 25, 0.15)" // Match background but allow trails
      ctx.globalCompositeOperation = "source-over"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Light up the base
      ctx.globalCompositeOperation = "lighter"

      // Spawn particles
      if (Math.random() > 0.2) {
        for (let i = 0; i < 3; i++) {
           particles.push(new Particle(canvas.width / 2, canvas.height))
        }
      }

      // Update and draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.update()
        if (p.life <= 0) {
          particles.splice(i, 1)
        } else {
          p.draw(ctx)
        }
      }

      // Base Core Glow
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height, 0,
        canvas.width / 2, canvas.height, 50
      )
      gradient.addColorStop(0, "rgba(251, 191, 36, 0.4)")
      gradient.addColorStop(1, "rgba(251, 191, 36, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(canvas.width / 2 - 50, canvas.height - 50, 100, 50)

      animationId = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resize)
    resize()
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-x-0 bottom-0 w-full pointer-events-none z-0 opacity-80"
      style={{ mixBlendMode: "screen" }}
    />
  )
}
