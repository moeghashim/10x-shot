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
    <section
      id="stack"
      className="relative overflow-hidden border-t border-black/15 bg-[#211816] text-[#f7efe5]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-10 h-56 w-56 rounded-full bg-[#f2b36e]/18 blur-3xl" />
        <div className="absolute bottom-0 right-[10%] h-72 w-72 rounded-full bg-[#d46a58]/14 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
        <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-28">
            <p className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-white/45">
              {strings.eyebrow}
            </p>
            <h2 className="stitch-display mt-3 text-4xl font-semibold uppercase tracking-[-0.08em] text-white md:text-6xl">
              {strings.title}
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/68 md:text-base">
              {strings.description}
            </p>

            <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-white/42">
                {selectedProject?.title ?? strings.title}
              </p>
              <p className="stitch-display mt-3 text-3xl font-semibold uppercase tracking-[-0.08em] text-white">
                {stack.length.toString().padStart(2, "0")}
              </p>
            </div>
          </div>

          <div>
            {projects.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {projects.map((project) => {
                  const isActive = project.id === selectedProject?.id

                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`stitch-mono shrink-0 rounded-full border px-4 py-2.5 text-[10px] uppercase tracking-[0.28em] transition-colors ${
                        isActive
                          ? "border-[#f2b36e]/60 bg-[#f2b36e] text-[#221816]"
                          : "border-white/12 bg-white/5 text-white/72 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {project.title}
                    </button>
                  )
                })}
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {stack.length > 0 ? (
                stack.map((item, index) => {
                  const Icon = iconSet[index % iconSet.length]

                  return (
                    <div
                      key={`${selectedProject?.id ?? "stack"}-${item}-${index}`}
                      className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.2)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f2b36e]/25 bg-[#f2b36e]/12">
                          <Icon className="h-4 w-4 text-[#f2b36e]" />
                        </div>
                        <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                      </div>
                      <p className="stitch-mono mt-8 text-[10px] uppercase tracking-[0.3em] text-white/38">
                        node
                      </p>
                      <p className="stitch-display mt-3 text-2xl font-semibold uppercase tracking-[-0.08em] text-white">
                        {item}
                      </p>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-full rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-10 text-center">
                  <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                    {strings.noData}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
