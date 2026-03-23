"use client"

import type { ComponentType } from "react"
import dynamic from "next/dynamic"

const Agentation = dynamic(
  () => import("agentation").then((mod) => mod.Agentation),
  { ssr: false }
) as ComponentType

export function AgentationToolbar() {
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return <Agentation />
}
