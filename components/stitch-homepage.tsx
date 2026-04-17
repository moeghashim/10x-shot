import { ArrowRight, ArrowUpRight, Mail } from "lucide-react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { StitchPublicHeader } from "@/components/stitch-public-header"
import { StitchTechStack } from "@/components/stitch-tech-stack"
import { getSiteCopyText, type SiteCopyMap } from "@/lib/site-content"
import type { Project, SupportedLocale } from "@/types/database"

function buildCode(id: number) {
  return `BUILD_${String(id).padStart(2, "0")}`
}

function formatProjectStatus(status: Project["status"], t: (key: string) => string) {
  if (status === "active" || status === "planning" || status === "completed") {
    return t(`HomePage.stitch.projects.status.${status}`)
  }

  return t("HomePage.stitch.projects.status.planning")
}

function isProjectLaunchingSoon(project: Project) {
  return project.status === "planning" || !project.url
}

function getAverageProgress(projects: Project[]) {
  if (projects.length === 0) {
    return 0
  }

  return Math.round(
    projects.reduce((total, project) => total + project.progress, 0) / projects.length
  )
}

function getProjectTone(status: Project["status"]) {
  switch (status) {
    case "active":
      return {
        rail: "bg-[#0f9d68]",
        badge: "border-[#0f9d68]/25 bg-[#0f9d68]/10 text-[#0d7f54]",
        panel: "bg-[#f5fbf8]",
      }
    case "completed":
      return {
        rail: "bg-black",
        badge: "border-black/15 bg-black text-white",
        panel: "bg-[#f4f1eb]",
      }
    default:
      return {
        rail: "bg-[#c77d2d]",
        badge: "border-[#c77d2d]/25 bg-[#fff4e8] text-[#9a5d1f]",
        panel: "bg-[#fff8ef]",
      }
  }
}

function sortProjectsForBoard(projects: Project[]) {
  const order: Record<Project["status"], number> = {
    active: 0,
    completed: 1,
    planning: 2,
  }

  return [...projects].sort((left, right) => {
    const statusDelta = order[left.status] - order[right.status]

    if (statusDelta !== 0) {
      return statusDelta
    }

    return right.progress - left.progress
  })
}

export function StitchHomepage({
  projects,
  locale,
  copy,
}: {
  projects: Project[]
  locale: SupportedLocale
  copy: SiteCopyMap
}) {
  const t = (key: string) => getSiteCopyText(copy, locale, key)
  const orderedProjects = sortProjectsForBoard(projects)
  const totalProjects = projects.length
  const activeProjects = projects.filter(
    (project) => project.status === "active" || project.status === "completed"
  ).length
  const completedProjects = projects.filter((project) => project.status === "completed").length
  const planningProjects = projects.filter((project) => isProjectLaunchingSoon(project)).length
  const toolCount = new Set(projects.flatMap((project) => project.tools ?? [])).size
  const averageProgress = getAverageProgress(projects)
  const heroTitleLines = t("HomePage.stitch.hero.title").split("\n")
  const featuredProjects = orderedProjects.slice(0, 3)

  return (
    <div className="min-h-screen overflow-x-clip bg-[#efe8dc] text-black selection:bg-black selection:text-white">
      <StitchPublicHeader
        locale={locale}
        isHomepage
        labels={{
          projects: t("HomePage.stitch.nav.projects"),
          stack: t("HomePage.stitch.nav.stack"),
          contact: t("HomePage.stitch.nav.contact"),
          progress: t("HomePage.stitch.nav.progress"),
        }}
      />

      <main>
        <section className="stitch-shell relative overflow-hidden border-b border-black/15">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-[8%] h-64 w-64 rounded-full bg-[#f2b36e]/35 blur-3xl" />
            <div className="absolute right-[6%] top-16 h-72 w-72 rounded-full bg-[#d46a58]/18 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-56 w-[36rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-2xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_400px]">
              <div className="rounded-[2rem] border border-black/15 bg-[#fbf7ef]/90 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.08)] md:p-10">
                <div className="flex items-center gap-3">
                  <span className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">
                    {t("HomePage.stitch.hero.eyebrow")}
                  </span>
                  <span className="h-px flex-1 bg-black/15" />
                </div>

                <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
                  <div>
                    <h1 className="stitch-display text-[clamp(3.5rem,11vw,8rem)] font-semibold uppercase leading-[0.88] tracking-[-0.11em] text-black">
                      {heroTitleLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-black/70 md:text-lg">
                      {t("HomePage.stitch.hero.description")}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <a
                        href="#projects"
                        className="stitch-mono inline-flex h-12 items-center justify-between gap-3 rounded-full bg-black px-6 text-[10px] uppercase tracking-[0.3em] text-white transition-transform hover:-translate-y-0.5"
                      >
                        <span>{t("HomePage.stitch.hero.primaryCta")}</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                      <Link
                        href="/progress"
                        className="stitch-mono inline-flex h-12 items-center justify-between gap-3 rounded-full border border-black/15 bg-white px-6 text-[10px] uppercase tracking-[0.3em] text-black transition-colors hover:border-black"
                      >
                        <span>{t("HomePage.stitch.hero.secondaryCta")}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      {
                        label: t("HomePage.stitch.overview.totalProjects"),
                        value: totalProjects.toString().padStart(2, "0"),
                        tone: "bg-[#f4efe6]",
                      },
                      {
                        label: t("HomePage.stitch.overview.activeProjects"),
                        value: activeProjects.toString().padStart(2, "0"),
                        tone: "bg-white",
                      },
                      {
                        label: t("HomePage.stitch.projects.status.completed"),
                        value: completedProjects.toString().padStart(2, "0"),
                        tone: "bg-[#f7f1e6]",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-[1.4rem] border border-black/12 ${item.tone} p-4`}
                      >
                        <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/45">
                          {item.label}
                        </p>
                        <p className="stitch-display mt-3 text-4xl font-semibold uppercase tracking-[-0.08em] text-black">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 grid gap-3 border-t border-black/10 pt-6 md:grid-cols-4">
                  {[
                    {
                      label: t("HomePage.stitch.overview.totalProjects"),
                      value: totalProjects.toString(),
                    },
                    {
                      label: t("HomePage.stitch.overview.toolsIntegrated"),
                      value: toolCount.toString(),
                    },
                    {
                      label: t("HomePage.stitch.projects.progress"),
                      value: `${averageProgress}%`,
                    },
                    {
                      label: t("HomePage.stitch.projects.launchingSoon"),
                      value: planningProjects.toString(),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.25rem] border border-black/10 bg-white/70 px-4 py-4"
                    >
                      <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/42">
                        {item.label}
                      </p>
                      <p className="stitch-display mt-2 text-2xl font-semibold uppercase tracking-[-0.08em] text-black">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-[2rem] border border-[#3b2d28] bg-[#221816] p-6 text-[#f6eee5] shadow-[0_30px_90px_rgba(34,24,22,0.35)] md:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                      {t("HomePage.stitch.hero.statusLabel")}
                    </p>
                    <p className="stitch-display mt-3 text-3xl font-semibold uppercase tracking-[-0.08em]">
                      {t("HomePage.stitch.hero.statusValue")}
                    </p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f2b36e]/35 bg-[#f2b36e]/12">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f2b36e]" />
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: t("HomePage.stitch.overview.activeProjects"),
                      value: activeProjects,
                    },
                    {
                      label: t("HomePage.stitch.projects.status.completed"),
                      value: completedProjects,
                    },
                    {
                      label: t("HomePage.stitch.overview.toolsIntegrated"),
                      value: toolCount,
                    },
                    {
                      label: t("HomePage.stitch.projects.progress"),
                      value: `${averageProgress}%`,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                        {item.label}
                      </p>
                      <p className="stitch-display mt-2 text-2xl font-semibold uppercase tracking-[-0.08em] text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#2a1f1c] p-5">
                  <div className="flex items-center justify-between">
                    <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                      {t("HomePage.stitch.projects.eyebrow")}
                    </p>
                    <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-[#f2b36e]">
                      {featuredProjects.length}
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">
                    {featuredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="rounded-[1.2rem] border border-white/8 bg-black/15 px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
                              {t("HomePage.stitch.projects.buildId")} {buildCode(project.id)}
                            </p>
                            <p className="stitch-display mt-2 text-xl font-semibold uppercase tracking-[-0.08em] text-white">
                              {project.title}
                            </p>
                          </div>
                          <span className="stitch-mono text-[10px] uppercase tracking-[0.24em] text-white/55">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="mt-4 h-1 rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-[#f2b36e]"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="projects" className="border-b border-black/15 bg-[#eee7da]">
          <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
            <div className="grid gap-10 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
              <div className="xl:sticky xl:top-28">
                <p className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">
                  {t("HomePage.stitch.projects.eyebrow")}
                </p>
                <h2 className="stitch-display mt-3 text-4xl font-semibold uppercase tracking-[-0.08em] text-black md:text-6xl">
                  {t("HomePage.stitch.projects.title")}
                </h2>
                <p className="mt-5 text-sm leading-6 text-black/65 md:text-base">
                  {t("HomePage.stitch.projects.description")}
                </p>

                <div className="mt-8 rounded-[1.8rem] border border-black/15 bg-[#fbf7ef] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.06)]">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    {[
                      {
                        label: t("HomePage.stitch.projects.status.active"),
                        value: projects.filter((project) => project.status === "active").length,
                      },
                      {
                        label: t("HomePage.stitch.projects.status.completed"),
                        value: completedProjects,
                      },
                      {
                        label: t("HomePage.stitch.projects.launchingSoon"),
                        value: planningProjects,
                      },
                      {
                        label: t("HomePage.stitch.projects.progress"),
                        value: `${averageProgress}%`,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[1.1rem] border border-black/10 bg-white px-4 py-4"
                      >
                        <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/42">
                          {item.label}
                        </p>
                        <p className="stitch-display mt-2 text-2xl font-semibold uppercase tracking-[-0.08em] text-black">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {orderedProjects.map((project, index) => {
                  const launchingSoon = isProjectLaunchingSoon(project)
                  const tone = getProjectTone(project.status)

                  return (
                    <article
                      key={project.id}
                      className={`group relative overflow-hidden rounded-[1.8rem] border border-black/15 bg-[#fffdf8] shadow-[0_20px_55px_rgba(0,0,0,0.06)] ${
                        index === 0 ? "lg:col-span-2" : ""
                      }`}
                    >
                      <div className={`h-1 w-full ${tone.rail}`} />

                      <div className="p-6 md:p-7">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="stitch-mono text-[10px] uppercase tracking-[0.32em] text-black/42">
                              {t("HomePage.stitch.projects.buildId")} {buildCode(project.id)}
                            </p>
                            <h3 className="stitch-display mt-4 text-3xl font-semibold uppercase tracking-[-0.08em] text-black md:text-4xl">
                              {project.title}
                            </h3>
                          </div>
                          <span
                            className={`stitch-mono shrink-0 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] ${tone.badge}`}
                          >
                            {formatProjectStatus(project.status, t)}
                          </span>
                        </div>

                        <div className={`relative mt-7 ${launchingSoon ? "min-h-[18rem]" : ""}`}>
                          <div className={launchingSoon ? "select-none blur-[3px] opacity-45" : ""}>
                            <div
                              className={`grid gap-6 ${
                                index === 0 ? "xl:grid-cols-[minmax(0,1.2fr)_280px]" : ""
                              }`}
                            >
                              <div>
                                <p className="text-sm leading-6 text-black/68 md:text-[15px]">
                                  {project.description}
                                </p>

                                {project.objectives ? (
                                  <div className="mt-6 rounded-[1.25rem] border border-black/10 bg-black/[0.03] p-4">
                                    <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/45">
                                      {t("HomePage.projects.objectives")}
                                    </p>
                                    <p className="mt-3 text-sm leading-6 text-black/70">
                                      {project.objectives}
                                    </p>
                                  </div>
                                ) : null}

                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                  <div>
                                    <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/38">
                                      {t("HomePage.skills.aiSkills")}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {project.aiSkills.slice(0, 4).map((skill) => (
                                        <span
                                          key={`${project.id}-${skill}`}
                                          className="stitch-mono rounded-full border border-black/12 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-black/72"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/38">
                                      {t("HomePage.skills.toolsUsed")}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {project.tools.slice(0, 4).map((tool) => (
                                        <span
                                          key={`${project.id}-${tool}`}
                                          className="stitch-mono rounded-full border border-black/12 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-black/72"
                                        >
                                          {tool}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className={`rounded-[1.5rem] border border-black/12 ${tone.panel} p-5`}>
                                {project.timeframe ? (
                                  <div className="border-b border-black/10 pb-4">
                                    <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/38">
                                      {t("HomePage.stitch.projects.timeframe")}
                                    </p>
                                    <p className="stitch-mono mt-3 text-xs uppercase tracking-[0.18em] text-black">
                                      {project.timeframe}
                                    </p>
                                  </div>
                                ) : null}

                                <div className={project.timeframe ? "pt-4" : ""}>
                                  <div className="flex items-end justify-between gap-4">
                                    <div>
                                      <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/38">
                                        {t("HomePage.stitch.projects.progress")}
                                      </p>
                                      <p className="stitch-display mt-3 text-5xl font-semibold uppercase tracking-[-0.09em] text-black">
                                        {project.progress}
                                        <span className="text-2xl">%</span>
                                      </p>
                                    </div>
                                    <p className="stitch-mono text-[10px] uppercase tracking-[0.24em] text-black/55">
                                      {buildCode(project.id)}
                                    </p>
                                  </div>

                                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/8">
                                    <div
                                      className={`h-full rounded-full ${tone.rail}`}
                                      style={{ width: `${project.progress}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {launchingSoon ? (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                              <span className="stitch-mono rounded-full border border-black/15 bg-[#fbf7ef]/95 px-4 py-3 text-[10px] uppercase tracking-[0.34em] text-black shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                                {t("HomePage.stitch.projects.launchingSoon")}
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-8 border-t border-black/10 pt-5">
                          {launchingSoon ? (
                            <div
                              aria-disabled="true"
                              className="stitch-mono inline-flex h-12 w-full items-center justify-between rounded-full border border-black/15 bg-black/5 px-5 text-[10px] uppercase tracking-[0.3em] text-black/40"
                            >
                              <span>{t("HomePage.stitch.projects.launchingSoon")}</span>
                            </div>
                          ) : (
                            <a
                              href={project.url!}
                              target="_blank"
                              rel="noreferrer"
                              className="stitch-mono inline-flex h-12 w-full items-center justify-between rounded-full bg-black px-5 text-[10px] uppercase tracking-[0.3em] text-white transition-transform hover:-translate-y-0.5"
                            >
                              <span>{t("HomePage.stitch.projects.launch")}</span>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <StitchTechStack
          projects={orderedProjects.map((project) => ({
            id: project.id,
            title: project.title,
            tools: project.tools,
            aiSkills: project.aiSkills,
          }))}
          strings={{
            eyebrow: t("HomePage.stitch.stack.eyebrow"),
            title: t("HomePage.stitch.stack.title"),
            description: t("HomePage.stitch.stack.description"),
            noData: t("HomePage.stitch.stack.noData"),
          }}
        />

        <section id="contact" className="border-t border-black/15 bg-[#f6efe4]">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
            <div className="grid gap-8 rounded-[2rem] border border-black/15 bg-[#fffaf2] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.07)] md:p-8 lg:grid-cols-[minmax(0,0.9fr)_420px]">
              <div className="flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-[#f7f0e4] px-4 py-2">
                    <Mail className="h-4 w-4" />
                    <span className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/75">
                      {t("HomePage.stitch.cta.eyebrow")}
                    </span>
                  </div>

                  <h2 className="stitch-display mt-6 max-w-2xl text-4xl font-semibold uppercase leading-[0.92] tracking-[-0.09em] text-black md:text-6xl">
                    {t("HomePage.stitch.cta.title")}
                  </h2>
                  <p className="mt-5 max-w-xl text-sm leading-6 text-black/65 md:text-base">
                    {t("HomePage.newsletter.description")}
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#newsletter-form"
                    className="stitch-mono inline-flex h-12 items-center justify-between gap-3 rounded-full bg-black px-6 text-[10px] uppercase tracking-[0.3em] text-white transition-transform hover:-translate-y-0.5"
                  >
                    <span>{t("HomePage.stitch.cta.primary")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link
                    href="/progress"
                    className="stitch-mono inline-flex h-12 items-center justify-between gap-3 rounded-full border border-black/15 bg-white px-6 text-[10px] uppercase tracking-[0.3em] text-black transition-colors hover:border-black"
                  >
                    <span>{t("HomePage.stitch.cta.secondary")}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div
                id="newsletter-form"
                className="rounded-[1.6rem] border border-black/12 bg-[#f3ebde] p-4 md:p-5"
              >
                <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-4">
                  <span className="stitch-mono text-[10px] uppercase tracking-[0.32em] text-black/45">
                    {t("HomePage.newsletter.stayUpdated")}
                  </span>
                  <span className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/45">
                    10 CLAWS
                  </span>
                </div>

                <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-black/10 bg-white">
                  <iframe
                    src="https://buildinpublic.substack.com/embed"
                    width="480"
                    height="320"
                    style={{ border: "0", background: "white" }}
                    frameBorder="0"
                    scrolling="no"
                    title={t("HomePage.newsletter.iframeTitle")}
                    className="min-h-[320px] w-full"
                  />
                </div>

                <p className="stitch-mono mt-4 text-[10px] uppercase tracking-[0.32em] text-black/45">
                  {t("HomePage.newsletter.noSpam")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/15 bg-[#efe8dc]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex items-center gap-3">
            <Image
              src="/10claws.svg"
              alt="10 Claws logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <div>
              <p className="stitch-display text-xl font-semibold uppercase tracking-[-0.08em] text-black">
                10 Claws
              </p>
              <p className="mt-2 text-sm text-black/62">{t("HomePage.stitch.footer.tagline")}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a
              className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black"
              href="#projects"
            >
              {t("HomePage.stitch.footer.projects")}
            </a>
            <Link
              className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black"
              href="/stack"
            >
              {t("HomePage.stitch.footer.stack")}
            </Link>
            <Link
              className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black"
              href="/progress"
            >
              {t("HomePage.stitch.footer.progress")}
            </Link>
            <a
              className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black"
              href="https://x.com/moeghashim"
              target="_blank"
              rel="noreferrer"
            >
              X / Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
