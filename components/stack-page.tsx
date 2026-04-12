import { ArrowUpRight, Layers3 } from "lucide-react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { StitchPublicHeader } from "@/components/stitch-public-header"
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

                    <div>
                      <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">{strings.usage}</p>
                      <p className="stitch-display mt-2 text-2xl font-semibold uppercase tracking-[-0.08em]">{item.usageCount}</p>
                    </div>

                    <div className="space-y-3 border-t border-black/10 pt-4">
                      <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">{strings.backToProjects}</p>
                      {item.projects.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {item.projects.map((project) =>
                            project.url ? (
                              <a
                                key={`${item.id}-${project.id}`}
                                href={project.url}
                                target="_blank"
                                rel="noreferrer"
                                className="stitch-mono inline-flex items-center gap-2 border border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-black transition-colors hover:border-black"
                              >
                                {project.title}
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </a>
                            ) : (
                              <a
                                key={`${item.id}-${project.id}`}
                                href={`/${locale}#projects`}
                                className="stitch-mono inline-flex items-center gap-2 border border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-black transition-colors hover:border-black"
                              >
                                {project.title}
                              </a>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-black/55">{strings.noProjects}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
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
