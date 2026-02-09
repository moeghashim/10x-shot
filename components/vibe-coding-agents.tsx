"use client"

import { useState, useEffect } from "react"
import { Terminal } from "lucide-react"
import type { Project } from "@/types/database"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type VibeCodingAgentsStrings = {
  title: string
  description: string
  selectProject: string
  placeholder: string
  noData: string
}

export function VibeCodingAgents({
  projects,
  strings,
}: {
  projects: Array<Pick<Project, "id" | "title" | "tools" | "aiSkills">>
  strings: VibeCodingAgentsStrings
}) {
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

  return (
    <section className="vibe-font px-6 pt-4 pb-12 bg-white">
      <div className="mx-auto max-w-7xl border-2 border-dashed border-gray-300 p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-start">
        <div className="lg:w-1/3 w-full">
          <h2 className="text-4xl font-black tracking-tight mb-6 leading-tight uppercase text-start">
            {strings.title}
          </h2>
          <p className="text-xl font-medium text-gray-600 mb-8 text-start">
            {strings.description}
          </p>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block text-start">
              {strings.selectProject}
            </label>
            <Select
              value={selectedProjectId || ""}
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger className="w-full rounded-none border-2 border-black bg-white h-12 font-bold uppercase tracking-tighter focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder={strings.placeholder} />
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
              <p className="text-gray-400 font-bold uppercase tracking-widest text-center">
                {strings.noData}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
