"use client"

import { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { format, parseISO } from "date-fns"
import { BarChart3, CheckCircle2, DollarSign, Layers3, TrendingUp, Users } from "lucide-react"
import type { GlobalMetric, PlanningCard, PlanningCardColumn, Project, ProjectMetric } from "@/types/database"

type ProgressDashboardStrings = {
  filters: {
    allProjects: string
    label: string
  }
  summary: {
    audience: string
    audienceHint: string
    totalSales: string
    totalSalesHint: string
    latestSales: string
    latestSalesHint: string
    monthChange: string
    monthChangeHint: string
  }
  sales: {
    eyebrow: string
    title: string
    description: string
    empty: string
  }
  achievements: {
    eyebrow: string
    title: string
    description: string
    empty: string
  }
  kanban: {
    eyebrow: string
    title: string
    description: string
    empty: string
    columns: Record<PlanningCardColumn, string>
  }
  project: string
  progress: string
}

type ChartPoint = {
  month: string
  label: string
  sales: number
}

type AchievementItem = {
  month: string
  label: string
  projectTitle: string
  achievement: string
}

const columnOrder: PlanningCardColumn[] = ["todo", "doing", "done"]

function parseMetricMonth(month: string) {
  return parseISO(month.length === 7 ? `${month}-01` : month)
}

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString()}`
}

function getAudience(metrics: GlobalMetric[]) {
  const latest = [...metrics].sort((a, b) => b.month.localeCompare(a.month))[0]
  if (!latest) {
    return 0
  }

  return latest.twitter_followers + latest.instagram_followers + latest.tiktok_followers
}

function getProjectMap(projects: Project[]) {
  return new Map(projects.map((project) => [project.id, project]))
}

function buildChartData(metrics: ProjectMetric[], selectedProjectId: number | "all"): ChartPoint[] {
  const filtered =
    selectedProjectId === "all"
      ? metrics
      : metrics.filter((metric) => metric.project_id === selectedProjectId)
  const salesByMonth = new Map<string, number>()

  for (const metric of filtered) {
    salesByMonth.set(metric.month, (salesByMonth.get(metric.month) ?? 0) + metric.sales_gmv)
  }

  return Array.from(salesByMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, sales]) => ({
      month,
      label: format(parseMetricMonth(month), "MMM yyyy"),
      sales,
    }))
}

function buildAchievements(
  metrics: ProjectMetric[],
  projects: Project[],
  selectedProjectId: number | "all"
): AchievementItem[] {
  const projectById = getProjectMap(projects)
  return metrics
    .filter((metric) => selectedProjectId === "all" || metric.project_id === selectedProjectId)
    .flatMap((metric) =>
      metric.achievements.map((achievement) => ({
        month: metric.month,
        label: format(parseMetricMonth(metric.month), "MMMM yyyy"),
        projectTitle: projectById.get(metric.project_id)?.title ?? `Project ${metric.project_id}`,
        achievement,
      }))
    )
    .sort((a, b) => b.month.localeCompare(a.month))
}

export function ProgressDashboard({
  projects,
  projectMetrics,
  globalMetrics,
  planningCards,
  strings,
}: {
  projects: Project[]
  projectMetrics: ProjectMetric[]
  globalMetrics: GlobalMetric[]
  planningCards: PlanningCard[]
  strings: ProgressDashboardStrings
}) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | "all">("all")
  const projectById = useMemo(() => getProjectMap(projects), [projects])
  const chartData = useMemo(
    () => buildChartData(projectMetrics, selectedProjectId),
    [projectMetrics, selectedProjectId]
  )
  const achievements = useMemo(
    () => buildAchievements(projectMetrics, projects, selectedProjectId),
    [projectMetrics, projects, selectedProjectId]
  )
  const filteredCards = useMemo(
    () =>
      planningCards.filter((card) => selectedProjectId === "all" || card.project_id === selectedProjectId),
    [planningCards, selectedProjectId]
  )

  const totalSales = chartData.reduce((sum, point) => sum + point.sales, 0)
  const latestSales = chartData[chartData.length - 1]?.sales ?? 0
  const previousSales = chartData[chartData.length - 2]?.sales ?? 0
  const monthChange = latestSales - previousSales
  const audience = getAudience(globalMetrics)

  const summaryCards = [
    {
      title: strings.summary.audience,
      value: audience.toLocaleString(),
      hint: strings.summary.audienceHint,
      icon: Users,
    },
    {
      title: strings.summary.totalSales,
      value: formatCurrency(totalSales),
      hint: strings.summary.totalSalesHint,
      icon: DollarSign,
    },
    {
      title: strings.summary.latestSales,
      value: formatCurrency(latestSales),
      hint: strings.summary.latestSalesHint,
      icon: BarChart3,
    },
    {
      title: strings.summary.monthChange,
      value: `${monthChange >= 0 ? "+" : "-"}${formatCurrency(Math.abs(monthChange))}`,
      hint: strings.summary.monthChangeHint,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-10 md:space-y-14">
      <section className="border border-black/15 bg-white">
        <div className="flex flex-col gap-4 border-b border-black/15 bg-[#f3f1ed] px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="stitch-mono text-[10px] uppercase tracking-[0.32em] text-black/45">
              {strings.filters.label}
            </p>
            <h2 className="stitch-display mt-2 text-3xl font-semibold uppercase tracking-[-0.08em] text-black">
              {selectedProjectId === "all"
                ? strings.filters.allProjects
                : projectById.get(selectedProjectId)?.title}
            </h2>
          </div>
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            <button
              className={`stitch-mono h-10 shrink-0 border px-4 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                selectedProjectId === "all"
                  ? "border-black bg-black text-white"
                  : "border-black/15 bg-white text-black/65 hover:border-black"
              }`}
              onClick={() => setSelectedProjectId("all")}
              type="button"
            >
              {strings.filters.allProjects}
            </button>
            {projects.map((project) => (
              <button
                key={project.id}
                className={`stitch-mono h-10 shrink-0 border px-4 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                  selectedProjectId === project.id
                    ? "border-black bg-black text-white"
                    : "border-black/15 bg-white text-black/65 hover:border-black"
                }`}
                onClick={() => setSelectedProjectId(project.id)}
                type="button"
              >
                {project.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-px bg-black/15 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon

            return (
              <div key={card.title} className="bg-white px-5 py-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/45">
                    {card.title}
                  </p>
                  <Icon className="h-4 w-4 text-black/55" />
                </div>
                <p className="stitch-display mt-5 text-4xl font-semibold uppercase tracking-[-0.08em] text-black">
                  {card.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-black/60">{card.hint}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border border-black/15 bg-white">
        <div className="grid gap-px bg-black/15 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="bg-[#f7f5f1] px-5 py-6 md:px-6">
            <p className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">
              {strings.sales.eyebrow}
            </p>
            <h2 className="stitch-display mt-4 text-4xl font-semibold uppercase tracking-[-0.08em] text-black">
              {strings.sales.title}
            </h2>
            <p className="mt-4 text-sm leading-6 text-black/65">{strings.sales.description}</p>
          </div>
          <div className="min-h-[360px] bg-white p-4 md:p-6">
            {chartData.length === 0 ? (
              <div className="flex h-[320px] items-center justify-center border border-dashed border-black/20 bg-[#f7f5f1] px-6 text-center text-sm text-black/55">
                {strings.sales.empty}
              </div>
            ) : (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ left: 4, right: 12, top: 12, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(0,0,0,0.12)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "rgba(0,0,0,0.58)", fontSize: 11 }}
                    />
                    <YAxis
                      tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "rgba(0,0,0,0.58)", fontSize: 11 }}
                      width={72}
                    />
                    <Tooltip
                      cursor={{ stroke: "rgba(0,0,0,0.35)" }}
                      formatter={(value) => [formatCurrency(Number(value)), strings.summary.latestSales]}
                      labelStyle={{ color: "#000" }}
                      contentStyle={{
                        border: "1px solid rgba(0,0,0,0.15)",
                        borderRadius: 0,
                        boxShadow: "none",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#000"
                      strokeWidth={2}
                      fill="rgba(0,0,0,0.08)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4 border-b border-black/15 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">
              {strings.achievements.eyebrow}
            </p>
            <h2 className="stitch-display mt-3 text-4xl font-semibold uppercase tracking-[-0.08em] text-black md:text-6xl">
              {strings.achievements.title}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-black/65 md:text-base">
            {strings.achievements.description}
          </p>
        </div>

        <div className="mt-8 border border-black/15 bg-white">
          {achievements.length === 0 ? (
            <div className="px-6 py-10 text-sm text-black/55">{strings.achievements.empty}</div>
          ) : (
            <div className="divide-y divide-black/15">
              {achievements.map((item) => (
                <article key={`${item.month}-${item.projectTitle}-${item.achievement}`} className="grid gap-px bg-black/15 md:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="bg-[#f7f5f1] px-5 py-5">
                    <p className="stitch-display text-2xl font-semibold uppercase tracking-[-0.08em] text-black">
                      {item.label}
                    </p>
                    {selectedProjectId === "all" ? (
                      <p className="stitch-mono mt-3 text-[10px] uppercase tracking-[0.25em] text-black/45">
                        {item.projectTitle}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-start gap-3 bg-white px-5 py-5 text-sm leading-6 text-black/72">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-black" />
                    <span>{item.achievement}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4 border-b border-black/15 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">
              {strings.kanban.eyebrow}
            </p>
            <h2 className="stitch-display mt-3 text-4xl font-semibold uppercase tracking-[-0.08em] text-black md:text-6xl">
              {strings.kanban.title}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-black/65 md:text-base">
            {strings.kanban.description}
          </p>
        </div>

        <div className="mt-8 grid gap-px border border-black/15 bg-black/15 lg:grid-cols-4">
          {columnOrder.map((column) => {
            const cards = filteredCards
              .filter((card) => card.column === column)
              .sort((a, b) => a.order - b.order)

            return (
              <div key={column} className="min-h-[280px] bg-[#f7f5f1]">
                <div className="flex items-center justify-between border-b border-black/15 bg-white px-4 py-4">
                  <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/55">
                    {strings.kanban.columns[column]}
                  </p>
                  <span className="stitch-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
                    {cards.length}
                  </span>
                </div>
                <div className="space-y-3 p-3">
                  {cards.length === 0 ? (
                    <div className="border border-dashed border-black/20 bg-white px-4 py-6 text-sm text-black/50">
                      {strings.kanban.empty}
                    </div>
                  ) : (
                    cards.map((card) => {
                      const project = projectById.get(card.project_id)

                      return (
                        <article key={card.id ?? `${card.project_id}-${card.title}`} className="border border-black/15 bg-white p-4">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="stitch-display text-2xl font-semibold uppercase leading-none tracking-[-0.08em] text-black">
                              {card.title}
                            </h3>
                            <Layers3 className="h-4 w-4 shrink-0 text-black/55" />
                          </div>
                          <p className="mt-3 text-sm leading-6 text-black/65">{card.description}</p>
                          {project ? (
                            <div className="mt-4 space-y-3">
                              <div className="stitch-mono inline-flex border border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-black/65">
                                {project.title}
                              </div>
                              <div>
                                <div className="flex items-center justify-between gap-3 text-[11px] text-black/50">
                                  <span>{strings.progress}</span>
                                  <span>{project.progress}%</span>
                                </div>
                                <div className="mt-2 h-1.5 bg-black/10">
                                  <div className="h-full bg-black" style={{ width: `${project.progress}%` }} />
                                </div>
                              </div>
                              {project.timeframe ? (
                                <p className="stitch-mono text-[10px] uppercase tracking-[0.2em] text-black/45">
                                  {project.timeframe}
                                </p>
                              ) : null}
                            </div>
                          ) : null}
                        </article>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
