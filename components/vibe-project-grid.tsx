"use client"

import { VibeProjectCard } from "@/components/vibe-project-card"
import { useProjects } from "@/hooks/use-projects"
import { IBM_Plex_Mono, Noto_Kufi_Arabic } from "next/font/google"
import type { Project } from "@/types/database"
import { useTranslations, useLocale } from "next-intl"

const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "700"] })
const notoKufiArabic = Noto_Kufi_Arabic({ subsets: ["arabic"], weight: ["400", "700"] })

interface VibeProjectGridProps {
  initialProjects?: Project[]
}

export function VibeProjectGrid({ initialProjects }: VibeProjectGridProps) {
  const t = useTranslations("HomePage.projects")
  const locale = useLocale()
  const { projects: clientProjects, loading } = useProjects()
  
  const fontClass = locale === "ar" ? notoKufiArabic.className : plexMono.className

  // Use initialProjects if available, otherwise use projects from the hook
  const projects = initialProjects || clientProjects

  // If we have initialProjects, we don't show the loading state even if the hook is still loading
  if (loading && !initialProjects) {
    return (
      <section id="projects" className={`${fontClass} px-6 py-12 bg-white`}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center font-black uppercase tracking-widest animate-pulse">{t("loading")}</div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className={`${fontClass} px-6 py-12 bg-white`}>
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
