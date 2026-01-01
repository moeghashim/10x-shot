"use client"

import { VibeProjectCard } from "@/components/vibe-project-card"
import { useProjects } from "@/hooks/use-projects"
import { GeistMono } from "geist/font/mono"

export function VibeProjectGrid() {
  const { projects, loading } = useProjects()

  if (loading) {
    return (
      <section id="projects" className={`${GeistMono.className} px-6 py-12 bg-white`}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center font-black uppercase tracking-widest animate-pulse">Loading Projects...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className={`${GeistMono.className} px-6 py-12 bg-white`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="mb-4 px-4 py-1 border-2 border-black text-xs font-black uppercase tracking-widest bg-black text-white">
            The Experiment
          </div>
          <h2 className="mb-6 text-5xl md:text-6xl font-black uppercase tracking-tighter">
            Current Projects
          </h2>
          <p className="text-xl font-medium text-gray-800 max-w-2xl leading-relaxed">
            Each project tests AI's ability to amplify human capabilities across different domains.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {(projects || []).map((project) => (
            <VibeProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

