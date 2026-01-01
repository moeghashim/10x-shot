"use client"

import { useState, useEffect } from "react"
import { GeistMono } from "geist/font/mono"
import { Code2, Cpu, Terminal, Box, ChevronDown } from "lucide-react"
import { useProjects } from "@/hooks/use-projects"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function VibeCodingAgents() {
  const { projects, loading } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id.toString())
    }
  }, [projects, selectedProjectId])

  const selectedProject = projects.find((p) => p.id.toString() === selectedProjectId)

  // Combine tools and AI skills for the tech stack
  const techStack = selectedProject
    ? [...(selectedProject.tools || []), ...(selectedProject.aiSkills || [])]
    : []

  if (loading && projects.length === 0) {
    return (
      <section className={`${GeistMono.className} px-6 pt-4 pb-12 bg-white`}>
        <div className="mx-auto max-w-7xl border-2 border-dashed border-gray-300 p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center">
          <div className="text-center w-full font-black uppercase tracking-widest animate-pulse">
            Loading Project Tech Stacks...
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`${GeistMono.className} px-6 pt-4 pb-12 bg-white`}>
      <div className="mx-auto max-w-7xl border-2 border-dashed border-gray-300 p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-start">
        <div className="lg:w-1/3">
          <h2 className="text-4xl font-black tracking-tight mb-6 leading-tight uppercase">
            Project Tech Stack
          </h2>
          <p className="text-xl font-medium text-gray-600 mb-8">
            Explore the specialized AI agents and tools powering each experiment.
          </p>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Select Project
            </label>
            <Select
              value={selectedProjectId || ""}
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger className="w-full rounded-none border-2 border-black bg-white h-12 font-bold uppercase tracking-tighter focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-2 border-black shadow-none bg-white">
                {projects.map((project) => (
                  <SelectItem
                    key={project.id}
                    value={project.id.toString()}
                    className="font-bold uppercase tracking-tighter focus:bg-black focus:text-white rounded-none cursor-pointer"
                  >
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="lg:w-2/3 w-full">
          {techStack.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {techStack.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-4 py-4 border-2 border-dashed border-gray-300 bg-transparent transition-all hover:border-black hover:bg-gray-50 group"
                >
                  <div className="shrink-0">
                    <Terminal className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                  <span className="font-bold text-sm tracking-tight uppercase">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 py-20">
              <p className="text-gray-400 font-bold uppercase tracking-widest">
                No tech stack data available
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
