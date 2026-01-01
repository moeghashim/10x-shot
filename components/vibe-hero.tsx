"use client"

import { GeistMono } from "geist/font/mono"
import { TextLoop } from "@/components/ui/text-loop"

export function VibeHero() {
  const tools = ["AI Agents", "Cursor CLI", "Claude Code", "Gemini CLI", "Copilot", "v0.dev"]

  return (
    <section className={`${GeistMono.className} py-12 px-6 bg-white text-black`}>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 flex flex-wrap items-center gap-x-6 gap-y-4 uppercase">
          <span>Build</span>
          <span>10X faster</span>
          <span>with</span>
          <span className="border-2 border-dashed border-gray-300 px-6 py-2 min-w-[280px] text-center inline-block">
            <TextLoop interval={3} transition={{ duration: 0.5 }}>
              {tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </TextLoop>
          </span>
        </h1>

        <p className="max-w-3xl text-xl md:text-2xl font-medium leading-relaxed mb-12 text-gray-800">
          Tracking the real-world impact of AI on productivity across 10 diverse projects. 
          Discover if artificial intelligence can truly deliver 10x improvements in modern software development.
        </p>

      </div>
    </section>
  )
}
