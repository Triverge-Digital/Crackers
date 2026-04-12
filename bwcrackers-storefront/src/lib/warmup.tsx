"use client"

import { useEffect } from "react"

export default function WarmupBackend() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    fetch(`${url}/health`, { mode: "no-cors" }).catch(() => {})
  }, [])

  return null
}
