"use client"

import { useEffect, useState } from "react"
import { Braces, Cpu, Database, Sparkles } from "lucide-react"

type TechProject = {
  id: number
  title: string
  tools: string[]
  aiSkills: string[]
}

type StitchTechStackProps = {
  projects: TechProject[]
  strings: {
    title: string
    eyebrow: string
    description: string
    noData: string
  }
}

const iconSet = [Cpu, Braces, Database, Sparkles]

export function StitchTechStack({ projects, strings }: StitchTechStackProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(projects[0]?.id ?? null)

  useEffect(() => {
    setSelectedProjectId(projects[0]?.id ?? null)
  }, [projects])

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0]
  const stack = selectedProject ? [...selectedProject.tools, ...selectedProject.aiSkills] : []

  return (
    <section id="stack" className="border-t border-black/15 bg-[#f3f1ed]">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className="flex flex-col gap-6 border-b border-black/15 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">
              {strings.eyebrow}
            </p>
            <h2 className="stitch-display mt-3 text-4xl font-semibold uppercase tracking-[-0.08em] text-black md:text-6xl">
              {strings.title}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-black/65 md:text-base">{strings.description}</p>
        </div>

        {projects.length > 1 ? (
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {projects.map((project) => {
              const isActive = project.id === selectedProject?.id
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`stitch-mono shrink-0 border px-3 py-2 text-[10px] uppercase tracking-[0.28em] transition-colors ${
                    isActive ? "border-black bg-black text-white" : "border-black/20 bg-white text-black hover:border-black"
                  }`}
                >
                  {project.title}
                </button>
              )
            })}
          </div>
        ) : null}

        <div className="mt-8 grid gap-px border border-black/15 bg-black/15 sm:grid-cols-2 xl:grid-cols-4">
          {stack.length > 0 ? (
            stack.map((item, index) => {
              const Icon = iconSet[index % iconSet.length]
              return (
                <div
                  key={`${selectedProject?.id ?? "stack"}-${item}-${index}`}
                  className="flex min-h-28 items-center gap-4 bg-white px-5 py-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center border border-black/15">
                    <Icon className="h-4 w-4 text-black" />
                  </div>
                  <div>
                    <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">node</p>
                    <p className="stitch-mono mt-2 text-xs uppercase tracking-[0.18em] text-black">{item}</p>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full bg-white px-5 py-10 text-center">
              <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">{strings.noData}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
