"use client"

import { useEffect, useState } from "react"

export function ToolTextLoop({ items }: { items: string[] }) {
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!items.length) return

    let timeout: ReturnType<typeof setTimeout> | null = null
    const interval = setInterval(() => {
      // Small fade-out, then swap, then fade-in.
      setFading(true)
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        setIndex((i) => (i + 1) % items.length)
        setFading(false)
      }, 150)
    }, 3000)

    return () => {
      clearInterval(interval)
      if (timeout) clearTimeout(timeout)
    }
  }, [items])

  return (
    <span
      className="relative inline-block whitespace-nowrap transition-opacity duration-200"
      style={{ opacity: fading ? 0 : 1 }}
    >
      {items[index] ?? ""}
    </span>
  )
}
