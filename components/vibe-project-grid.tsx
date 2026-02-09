import { VibeProjectCard } from "@/components/vibe-project-card"
import type { Project } from "@/types/database"
import { useTranslations } from "next-intl"

interface VibeProjectGridProps {
  projects: Project[]
}

export function VibeProjectGrid({ projects }: VibeProjectGridProps) {
  const t = useTranslations("HomePage.projects")

  return (
    <section id="projects" className="vibe-font px-6 py-12 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="mb-4 px-4 py-1 border-2 border-black text-xs font-black uppercase tracking-widest bg-black text-white">
            {t("experiment")}
          </div>
          <h2 className="mb-6 text-5xl md:text-6xl font-black uppercase tracking-tighter">
            {t("title")}
          </h2>
          <p className="text-xl font-medium text-gray-800 max-w-2xl leading-relaxed">
            {t("description")}
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
