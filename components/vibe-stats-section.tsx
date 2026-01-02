"use client"

import { useState, useEffect } from "react"
import { IBM_Plex_Mono, Noto_Kufi_Arabic } from "next/font/google"
import { useTranslations, useLocale } from "next-intl"

const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "700"] })
const notoKufiArabic = Noto_Kufi_Arabic({ subsets: ["arabic"], weight: ["400", "700"] })

type Stat = {
  key: string
  label: string
  value: number
  max: number
  suffix?: string
  showMax?: boolean
}

export function VibeStatsSection() {
  const t = useTranslations("HomePage.stats")
  const locale = useLocale()
  const [stats, setStats] = useState<Stat[]>([
    { key: "projectsLaunched", label: t("projectsLaunched"), value: 0, max: 1, showMax: true },
    { key: "productivityGain", label: t("productivityGain"), value: 0, max: 10, suffix: "x", showMax: true },
    { key: "toolsIntegrated", label: t("toolsIntegrated"), value: 0, max: 50, showMax: true },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/public/stats")
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to load stats")
        }

        const {
          projectsLaunched,
          totalProjects,
          avgProductivityGain,
          aiToolsIntegrated,
        } = result.data || {}

        setStats([
          {
            key: "projectsLaunched",
            label: t("projectsLaunched"),
            value: typeof projectsLaunched === "number" ? projectsLaunched : 0,
            max: typeof totalProjects === "number" && totalProjects > 0 ? totalProjects : 10,
            showMax: true,
          },
          {
            key: "productivityGain",
            label: t("productivityGain"),
            value:
              typeof avgProductivityGain === "number"
                ? Math.round(avgProductivityGain * 10) / 10
                : 0,
            max: 10,
            suffix: "x",
            showMax: true,
          },
          {
            key: "toolsIntegrated",
            label: t("toolsIntegrated"),
            value: typeof aiToolsIntegrated === "number" ? aiToolsIntegrated : 0,
            max: 50,
            showMax: true,
          },
        ])
      } catch (error) {
        console.error("Failed to load stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [t])

  const fontClass = locale === "ar" ? notoKufiArabic.className : plexMono.className

  return (
    <section className={`${fontClass} px-6 py-12 bg-white border-y border-dashed border-gray-300`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-gray-300 border-t border-dashed border-gray-300"></div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            {t("title")}
          </h2>
          <div className="h-[1px] flex-1 bg-gray-300 border-t border-dashed border-gray-300"></div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="relative bg-white border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-black text-start">
              <div className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">
                {stat.label}
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black tracking-tighter">
                  {loading ? "..." : stat.value}
                  {!loading && stat.suffix ? stat.suffix : ""}
                </span>
                {!loading && stat.showMax !== false && (
                  <span className="text-xl font-bold text-gray-300">/{stat.max}</span>
                )}
              </div>
              <div className="h-3 border border-dashed border-gray-300 bg-gray-50 p-0.5 overflow-hidden">
                <div 
                  className="h-full bg-black transition-all duration-700 ease-out" 
                  style={{ width: `${loading ? 0 : Math.min((stat.value / stat.max) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
