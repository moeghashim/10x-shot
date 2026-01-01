"use client"

import { GeistMono } from "geist/font/mono"
import { TextLoop } from "@/components/ui/text-loop"

export function VibeHero() {
  const tools = ["AI Agents", "Cursor CLI", "Claude Code", "Gemini CLI", "Copilot", "v0.dev"]

  return (
    <section className={`${GeistMono.className} pt-12 pb-2 px-6 bg-white text-black`}>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 uppercase">
          <span>My attempt to</span>
          <span>build 10x faster</span>
          <span>with</span>
          <span className="border-2 border-dashed border-gray-300 px-4 py-1.5 min-w-[220px] text-center inline-block">
            <TextLoop interval={3} transition={{ duration: 0.5 }}>
              {tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </TextLoop>
          </span>
        </h1>

        <p className="max-w-3xl text-lg md:text-xl font-medium leading-relaxed mb-4 text-gray-800">
          Tracking the real-world impact of AI on productivity across 10 diverse projects. 
          Discover if artificial intelligence can truly deliver 10x improvements in modern software development.
        </p>

      </div>
    </section>
  )
}
