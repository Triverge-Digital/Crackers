"use client"

import { useEffect, useState, useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function NavProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  // Reset when navigation completes (pathname or searchParams changed)
  useEffect(() => {
    setLoading(false)
    setProgress(0)
  }, [pathname, searchParams])

  // Listen for click on any link to start the progress bar instantly
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href) return

      // Skip external links, hash links, and same-page links
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        anchor.target === "_blank"
      ) {
        return
      }

      // Skip if it's the current page
      const url = new URL(href, window.location.origin)
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return
      }

      setLoading(true)
      setProgress(20)
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [])

  // Animate progress while loading
  useEffect(() => {
    if (!loading) return

    const t1 = setTimeout(() => setProgress(45), 150)
    const t2 = setTimeout(() => setProgress(65), 400)
    const t3 = setTimeout(() => setProgress(80), 800)
    const t4 = setTimeout(() => setProgress(90), 2000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [loading])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[3px]">
      <div
        className="h-full bg-gradient-to-r from-brand-gold-400 via-brand-accent-orange to-brand-gold-400 shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
