"use client"

import { ProjectCard } from "@/components/project-card"
import { useProjects } from "@/hooks/use-projects"

export function ProjectGrid() {
  const { projects, loading } = useProjects()

  if (loading) {
    return (
      <section id="projects" className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">Loading projects...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="px-6 py-16 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-black">The 10x Experiment Projects</h2>
          <p className="text-lg text-gray-600">
            Each project tests AI's ability to amplify human capabilities across different domains
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(projects || []).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
