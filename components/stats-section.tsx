"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useProjects } from "@/hooks/use-projects"
import { fetchLatestGlobalMetric } from "@/lib/data-fetching"

export function StatsSection() {
  const { projects, loading: projectsLoading } = useProjects()
  const [stats, setStats] = useState([
    { label: "Projects Launched", value: 0, max: 10 },
    { label: "Avg Productivity Gain", value: 0, max: 1000, suffix: "%" },
    { label: "AI Tools Integrated", value: 0, max: 50 },
    { label: "Current Productivity", value: 0, max: 10, suffix: "x" },
  ])

  useEffect(() => {
    if (!projectsLoading && projects.length > 0) {
      calculateStats()
    }
  }, [projects, projectsLoading])

  const calculateStats = async () => {
    const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'completed')
    const allTools = projects.reduce((tools: string[], project) => {
      return [...tools, ...(project.tools || [])]
    }, [])
    const uniqueTools = [...new Set(allTools)]
    
    const avgProductivity = projects.length > 0 
      ? projects.reduce((sum, p) => sum + (p.productivity || 0), 0) / projects.length
      : 0

    // Get latest global metric for current productivity
    const { data: latestMetric } = await fetchLatestGlobalMetric()
    const currentProductivity = latestMetric?.productivity_gain || avgProductivity

    setStats([
      { 
        label: "Projects Launched", 
        value: activeProjects.length, 
        max: 10 
      },
      { 
        label: "Avg Productivity Gain", 
        value: Math.round(avgProductivity * 100), 
        max: 1000, 
        suffix: "%" 
      },
      { 
        label: "AI Tools Integrated", 
        value: uniqueTools.length, 
        max: 50 
      },
      { 
        label: "Current Productivity", 
        value: Math.round(currentProductivity * 10) / 10, 
        max: 10, 
        suffix: "x" 
      },
    ])
  }

  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-black">Current Impact Metrics</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="mb-2 text-2xl font-bold text-black">
                  {stat.value}
                  {stat.suffix || ""}
                  <span className="text-sm text-gray-500">/{stat.max}</span>
                </div>
                <div className="mb-3 text-sm text-gray-600">{stat.label}</div>
                <Progress value={(stat.value / stat.max) * 100} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
