"use client"

import { useState, useEffect } from "react"
import { GeistMono } from "geist/font/mono"

type Stat = {
  label: string
  value: number
  max: number
  suffix?: string
  showMax?: boolean
}

export function VibeStatsSection() {
  const [stats, setStats] = useState<Stat[]>([
    { label: "Projects Launched", value: 0, max: 1, showMax: true },
    { label: "Avg Productivity Gain", value: 0, max: 10, suffix: "x", showMax: true },
    { label: "AI Tools Integrated", value: 0, max: 50, showMax: true },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/public/stats")
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to load stats")
        }

        const {
          projectsLaunched,
          totalProjects,
          avgProductivityGain,
          aiToolsIntegrated,
        } = result.data || {}

        setStats([
          {
            label: "Projects Launched",
            value: typeof projectsLaunched === "number" ? projectsLaunched : 0,
            max: typeof totalProjects === "number" && totalProjects > 0 ? totalProjects : 10,
            showMax: true,
          },
          {
            label: "Avg Productivity Gain",
            value:
              typeof avgProductivityGain === "number"
                ? Math.round(avgProductivityGain * 10) / 10
                : 0,
            max: 10,
            suffix: "x",
            showMax: true,
          },
          {
            label: "AI Tools Integrated",
            value: typeof aiToolsIntegrated === "number" ? aiToolsIntegrated : 0,
            max: 50,
            showMax: true,
          },
        ])
      } catch (error) {
        console.error("Failed to load stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <section className={`${GeistMono.className} px-6 py-24 bg-white border-y border-dashed border-gray-300`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-[1px] flex-1 bg-gray-300 border-t border-dashed border-gray-300"></div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Impact Metrics
          </h2>
          <div className="h-[1px] flex-1 bg-gray-300 border-t border-dashed border-gray-300"></div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="relative bg-white border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-black">
              <div className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">
                {stat.label}
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black tracking-tighter">
                  {loading ? "..." : stat.value}
                  {!loading && stat.suffix ? stat.suffix : ""}
                </span>
                {!loading && stat.showMax !== false && (
                  <span className="text-xl font-bold text-gray-300">/{stat.max}</span>
                )}
              </div>
              <div className="h-3 border border-dashed border-gray-300 bg-gray-50 p-0.5 overflow-hidden">
                <div 
                  className="h-full bg-black transition-all duration-700 ease-out" 
                  style={{ width: `${loading ? 0 : Math.min((stat.value / stat.max) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
