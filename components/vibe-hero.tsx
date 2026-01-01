"use client"

import { GeistMono } from "geist/font/mono"

export function VibeHero() {
  return (
    <section className={`${GeistMono.className} py-12 px-6 bg-white text-black`}>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <span>Move faster</span>
          <span>with</span>
          <span className="border-2 border-dashed border-gray-300 px-6 py-2">
            Cursor CLI
          </span>
        </h1>

        <p className="max-w-3xl text-xl md:text-2xl font-medium leading-relaxed mb-12 text-gray-800">
          10X Builder lets you run coding agents in parallel without conflicts, and perform code review through our diff tool. 
          Now you can focus on planning and quality instead of watching terminal logs.
        </p>

        <div className="space-y-4">
          <p className="text-lg font-bold">
            Install <span className="underline decoration-2 underline-offset-4 font-black">Node.js 18+</span> then run:
          </p>
          
          <div className="inline-block bg-white border-2 border-black p-4">
            <code className="text-lg md:text-xl font-bold">
              npx 10x-builder@latest init
            </code>
          </div>
        </div>
      </div>
    </section>
  )
}
