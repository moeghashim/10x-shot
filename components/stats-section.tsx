"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Stat = {
  label: string
  value: number
  max: number
  suffix?: string
  showMax?: boolean // Whether to display the "/max" part
}

export function StatsSection() {
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
    <section className="px-6 py-16 bg-gray-50">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-black">
          Current Impact Metrics
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="mb-2 text-2xl font-bold text-black">
                  {loading ? "…" : stat.value}
                  {!loading && stat.suffix ? stat.suffix : ""}
                  {!loading && stat.showMax !== false && (
                    <span className="text-sm text-gray-500">/{stat.max}</span>
                  )}
                </div>
                <div className="mb-3 text-sm text-gray-600">{stat.label}</div>
                <Progress
                  value={
                    loading ? 0 : Math.min((stat.value / stat.max) * 100, 100)
                  }
                  className="h-2"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
