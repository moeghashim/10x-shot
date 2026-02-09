import { useTranslations } from "next-intl"
import type { Project } from "@/types/database"

type Stat = {
  label: string
  value: number
  max: number
  suffix?: string
  showMax?: boolean
}

function clampPct(value: number, max: number) {
  if (!max || max <= 0) return 0
  return Math.min((value / max) * 100, 100)
}

export function VibeStatsSection({ projects }: { projects: Project[] }) {
  const t = useTranslations("HomePage.stats")

  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => {
    const status = String(p.status || "").toLowerCase().trim()
    return status === "active" || status === "completed"
  })
  const projectsLaunched = activeProjects.length

  const avgProductivityGain =
    totalProjects > 0
      ? Math.round(
          (projects.reduce((sum, p) => sum + (Number(p.productivity) || 0), 0) / totalProjects) * 10
        ) / 10
      : 0

  const aiToolsIntegrated = new Set(projects.flatMap((p) => p.tools ?? [])).size

  const stats: Stat[] = [
    { label: t("projectsLaunched"), value: projectsLaunched, max: totalProjects > 0 ? totalProjects : 10, showMax: true },
    { label: t("productivityGain"), value: avgProductivityGain, max: 10, suffix: "x", showMax: true },
    { label: t("toolsIntegrated"), value: aiToolsIntegrated, max: 50, showMax: true },
  ]

  return (
    <section className="vibe-font px-6 py-12 bg-white border-y border-dashed border-gray-300">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-gray-300 border-t border-dashed border-gray-300"></div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">{t("title")}</h2>
          <div className="h-[1px] flex-1 bg-gray-300 border-t border-dashed border-gray-300"></div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative bg-white border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-black text-start"
            >
              <div className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">{stat.label}</div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black tracking-tighter">
                  {stat.value}
                  {stat.suffix ?? ""}
                </span>
                {stat.showMax !== false && <span className="text-xl font-bold text-gray-300">/{stat.max}</span>}
              </div>
              <div className="h-3 border border-dashed border-gray-300 bg-gray-50 p-0.5 overflow-hidden">
                <div className="h-full bg-black" style={{ width: `${clampPct(stat.value, stat.max)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

