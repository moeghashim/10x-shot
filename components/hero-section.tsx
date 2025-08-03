"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Zap, Target, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative px-6 py-20 text-center">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600">
            <Zap className="h-4 w-4" />
            AI Productivity Experiment
          </div>
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight text-black sm:text-6xl lg:text-7xl">
          10x<span className="text-gray-600">Builder</span>.ai
        </h1>

        <p className="mb-8 text-xl text-gray-600 sm:text-2xl">
          Measuring the real impact of AI on productivity across 10 diverse projects. Can artificial intelligence truly
          deliver 10x improvements?
        </p>

        <div className="mb-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <span>10 Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span>Real-time Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <span>AI-Powered Scale</span>
          </div>
        </div>

        <Button
          size="lg"
          className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg"
          onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
        >
          View Projects
          <ArrowDown className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}
