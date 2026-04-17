"use client"

import { useState } from "react"
import { ArrowUpRight, Check, Layers3, Table2 } from "lucide-react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { StitchPublicHeader } from "@/components/stitch-public-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StackItemWithProjects, SupportedLocale } from "@/types/database"

type StackPageProps = {
  locale: SupportedLocale
  stackItems: StackItemWithProjects[]
  strings: {
    title: string
    description: string
    eyebrow: string
    grade: string
    category: string
    usage: string
    noProjects: string
    empty: string
    backToProjects: string
    stack: string
    views: {
      cards: string
      matrix: string
    }
    categories: {
      tool: string
      ai_skill: string
    }
    nav: {
      projects: string
      stack: string
      contact: string
      progress: string
      home: string
    }
  }
}

export function StackPage({ locale, stackItems, strings }: StackPageProps) {
  const [view, setView] = useState<"cards" | "matrix">("cards")
  const projects = Array.from(
    new Map(
      stackItems
        .flatMap((item) => item.projects)
        .map((project) => [project.id, project] as const)
    ).values()
  ).sort((left, right) => left.title.localeCompare(right.title))

  const projectHref = (project: { url?: string | null }) => project.url || `/${locale}#projects`

  return (
    <div className="min-h-screen bg-[#f7f5f1] text-black selection:bg-black selection:text-white">
      <StitchPublicHeader
        locale={locale}
        labels={{
          projects: strings.nav.projects,
          stack: strings.nav.stack,
          contact: strings.nav.contact,
          progress: strings.nav.progress,
        }}
      />

      <main>
        <section className="border-b border-black/15">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div>
                <p className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">{strings.eyebrow}</p>
                <h1 className="stitch-display mt-4 text-[clamp(3rem,11vw,6.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.11em] text-black">
                  {strings.title}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-black/68 md:text-lg">{strings.description}</p>
              </div>

              <div className="border border-black/15 bg-white p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-black/10 pb-5">
                  <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">{strings.usage}</p>
                  <Layers3 className="h-4 w-4 text-black/60" />
                </div>
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">{strings.title}</p>
                    <p className="stitch-display mt-3 text-4xl font-semibold uppercase tracking-[-0.08em]">
                      {stackItems.length}
                    </p>
                  </div>
                  <div className="grid gap-4 border-t border-black/10 pt-4 sm:grid-cols-2">
                    <div>
                      <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">{strings.categories.tool}</p>
                      <p className="stitch-display mt-2 text-2xl font-semibold uppercase tracking-[-0.08em]">
                        {stackItems.filter((item) => item.category === "tool").length}
                      </p>
                    </div>
                    <div>
                      <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">{strings.categories.ai_skill}</p>
                      <p className="stitch-display mt-2 text-2xl font-semibold uppercase tracking-[-0.08em]">
                        {stackItems.filter((item) => item.category === "ai_skill").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
            {stackItems.length > 0 ? (
              <Tabs value={view} onValueChange={(value) => setView(value as "cards" | "matrix")} className="space-y-6">
                <TabsList className="border border-black/15 bg-[#f3f1ed] p-1">
                  <TabsTrigger value="cards" className="stitch-mono text-[10px] uppercase tracking-[0.28em]">
                    {strings.views.cards}
                  </TabsTrigger>
                  <TabsTrigger value="matrix" className="stitch-mono text-[10px] uppercase tracking-[0.28em]">
                    <Table2 className="mr-2 h-3.5 w-3.5" />
                    {strings.views.matrix}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cards" className="mt-0">
                  <div className="grid gap-px border border-black/15 bg-black/15 lg:grid-cols-2">
                    {stackItems.map((item) => (
                      <article key={item.id} className="flex h-full flex-col gap-6 bg-white p-6 md:p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="stitch-mono text-[10px] uppercase tracking-[0.32em] text-black/45">{strings.category}</p>
                            <h2 className="stitch-display mt-3 text-3xl font-semibold uppercase tracking-[-0.08em] text-black">
                              {item.name}
                            </h2>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="stitch-mono inline-flex border border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-black/65">
                              {strings.categories[item.category]}
                            </span>
                            <span className="stitch-mono inline-flex bg-black px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-white">
                              {strings.grade} {item.grade}
                            </span>
                          </div>
                        </div>

                        {item.notes ? <p className="text-sm leading-7 text-black/68">{item.notes}</p> : null}

                        <div>
                          <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">{strings.usage}</p>
                          <p className="stitch-display mt-2 text-2xl font-semibold uppercase tracking-[-0.08em]">{item.usageCount}</p>
                        </div>

                        <div className="space-y-3 border-t border-black/10 pt-4">
                          <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">{strings.backToProjects}</p>
                          {item.projects.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {item.projects.map((project) => (
                                <a
                                  key={`${item.id}-${project.id}`}
                                  href={projectHref(project)}
                                  target={project.url ? "_blank" : undefined}
                                  rel={project.url ? "noreferrer" : undefined}
                                  className="stitch-mono inline-flex items-center gap-2 border border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-black transition-colors hover:border-black"
                                >
                                  {project.title}
                                  {project.url ? <ArrowUpRight className="h-3.5 w-3.5" /> : null}
                                </a>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-black/55">{strings.noProjects}</p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="matrix" className="mt-0">
                  <div className="overflow-x-auto border border-black/15">
                    <table className="min-w-full border-collapse bg-white text-sm">
                      <thead className="bg-[#f3f1ed]">
                        <tr className="border-b border-black/15">
                          <th className="sticky left-0 z-20 min-w-[240px] border-r border-black/15 bg-[#f3f1ed] px-4 py-4 text-left">
                            <span className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/60">{strings.stack}</span>
                          </th>
                          <th className="min-w-[120px] border-r border-black/15 px-4 py-4 text-left">
                            <span className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/60">{strings.category}</span>
                          </th>
                          <th className="min-w-[100px] border-r border-black/15 px-4 py-4 text-left">
                            <span className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/60">{strings.grade}</span>
                          </th>
                          <th className="min-w-[120px] border-r border-black/15 px-4 py-4 text-left">
                            <span className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/60">{strings.usage}</span>
                          </th>
                          {projects.map((project) => (
                            <th key={project.id} className="min-w-[160px] border-r border-black/15 px-4 py-4 text-left last:border-r-0">
                              <a
                                href={projectHref(project)}
                                target={project.url ? "_blank" : undefined}
                                rel={project.url ? "noreferrer" : undefined}
                                className="block transition-colors hover:text-black/70"
                              >
                                <p className="text-sm font-medium text-black">{project.title}</p>
                                {project.url ? <ArrowUpRight className="mt-2 h-3.5 w-3.5 text-black/50" /> : null}
                              </a>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stackItems.map((item) => {
                          const linkedProjectIds = new Set(item.projects.map((project) => project.id))

                          return (
                            <tr key={item.id} className="border-b border-black/10 last:border-b-0">
                              <td className="sticky left-0 z-10 border-r border-black/15 bg-white px-4 py-4 align-top">
                                <div className="space-y-2">
                                  <p className="font-medium text-black">{item.name}</p>
                                  {item.notes ? <p className="text-xs leading-6 text-black/55">{item.notes}</p> : null}
                                </div>
                              </td>
                              <td className="border-r border-black/15 px-4 py-4 align-top">
                                <span className="stitch-mono inline-flex border border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-black/65">
                                  {strings.categories[item.category]}
                                </span>
                              </td>
                              <td className="border-r border-black/15 px-4 py-4 align-top">
                                <span className="stitch-mono inline-flex bg-black px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-white">
                                  {strings.grade} {item.grade}
                                </span>
                              </td>
                              <td className="border-r border-black/15 px-4 py-4 align-top">
                                <span className="stitch-display text-xl font-semibold uppercase tracking-[-0.08em] text-black">{item.usageCount}</span>
                              </td>
                              {projects.map((project) => (
                                <td
                                  key={`${item.id}-${project.id}`}
                                  className="border-r border-black/15 px-4 py-4 text-center align-middle last:border-r-0"
                                >
                                  {linkedProjectIds.has(project.id) ? (
                                    <Check className="mx-auto h-4 w-4 text-black" />
                                  ) : (
                                    <span className="text-black/20">-</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="border border-black/15 bg-white px-6 py-12 text-center">
                <p className="stitch-mono text-[10px] uppercase tracking-[0.32em] text-black/45">{strings.empty}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-black/15 bg-[#f7f5f1]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex items-center gap-3">
            <Image src="/10claws.svg" alt="10 Claws logo" width={40} height={40} className="h-10 w-10" />
            <div>
              <p className="stitch-display text-xl font-semibold uppercase tracking-[-0.08em] text-black">10 Claws</p>
              <p className="mt-2 text-sm text-black/62">{strings.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black" href="/">
              {strings.nav.home}
            </Link>
            <Link className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black" href="/progress">
              {strings.nav.progress}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
