import { ArrowUpRight, Dot, MoveRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import type { Project } from "@/types/database"
import { StitchLocaleToggle } from "@/components/stitch-locale-toggle"
import { StitchTechStack } from "@/components/stitch-tech-stack"

function buildCode(id: number) {
  return `BUILD_${String(id).padStart(2, "0")}`
}

function formatProjectStatus(status: Project["status"], t: Awaited<ReturnType<typeof getTranslations>>) {
  if (status === "active" || status === "planning" || status === "completed") {
    return t(`projects.status.${status}`)
  }

  return t("projects.status.planning")
}

export async function StitchHomepage({ projects }: { projects: Project[] }) {
  const t = await getTranslations("HomePage.stitch")
  const totalProjects = projects.length
  const activeProjects = projects.filter((project) => project.status === "active" || project.status === "completed").length
  const toolCount = new Set(projects.flatMap((project) => project.tools ?? [])).size
  const averageProductivity =
    totalProjects > 0
      ? (projects.reduce((sum, project) => sum + (Number(project.productivity) || 0), 0) / totalProjects).toFixed(1)
      : "0.0"

  const heroTitleLines = t("hero.title").split("\n")

  return (
    <div className="min-h-screen bg-[#f7f5f1] text-black selection:bg-black selection:text-white">
      <header className="sticky top-0 z-50 border-b border-black/15 bg-[#f7f5f1]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <Link href="/" className="stitch-display text-lg font-semibold uppercase tracking-[-0.08em] text-black md:text-xl">
            10xclaws
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:text-black" href="#projects">
              {t("nav.projects")}
            </a>
            <a className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:text-black" href="#stack">
              {t("nav.stack")}
            </a>
            <Link className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:text-black" href="/progress">
              {t("nav.progress")}
            </Link>
            <a className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:text-black" href="#contact">
              {t("nav.contact")}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/progress"
              className="stitch-mono hidden border border-black/15 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-black transition-colors hover:border-black md:inline-flex"
            >
              {t("nav.progress")}
            </Link>
            <StitchLocaleToggle />
          </div>
        </div>
      </header>

      <main>
        <section className="stitch-shell overflow-hidden border-b border-black/15">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div className="max-w-4xl">
                <div className="mb-8 flex items-center gap-3">
                  <span className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">
                    {t("hero.eyebrow")}
                  </span>
                  <span className="h-px flex-1 bg-black/15" />
                </div>

                <h1 className="stitch-display max-w-4xl text-[clamp(3.4rem,12vw,7.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.11em] text-black">
                  {heroTitleLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>

                <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
                  <p className="max-w-2xl text-base leading-7 text-black/68 md:text-lg">
                    {t("hero.description")}
                  </p>

                  <div className="space-y-3">
                    <a
                      href="#projects"
                      className="stitch-mono inline-flex h-12 w-full items-center justify-between bg-black px-5 text-[10px] uppercase tracking-[0.32em] text-white transition-transform hover:-translate-y-0.5"
                    >
                      <span>{t("hero.primaryCta")}</span>
                      <MoveRight className="h-3.5 w-3.5" />
                    </a>
                    <Link
                      href="/progress"
                      className="stitch-mono inline-flex h-12 w-full items-center justify-center border border-black/15 bg-white px-5 text-[10px] uppercase tracking-[0.32em] text-black transition-colors hover:border-black"
                    >
                      {t("hero.secondaryCta")}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="border border-black/15 bg-white p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-black/10 pb-5">
                  <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">
                    {t("hero.statusLabel")}
                  </p>
                  <span className="stitch-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-black">
                    <span className="h-2 w-2 bg-emerald-600" />
                    {t("hero.statusValue")}
                  </span>
                </div>

                <div className="mt-6 space-y-6">
                  <div className="grid gap-4 border-b border-black/10 pb-6 sm:grid-cols-2">
                    <div>
                      <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">
                        {t("overview.totalProjects")}
                      </p>
                      <p className="stitch-display mt-3 text-4xl font-semibold uppercase tracking-[-0.08em]">
                        {totalProjects}
                      </p>
                    </div>
                    <div>
                      <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">
                        {t("overview.activeProjects")}
                      </p>
                      <p className="stitch-display mt-3 text-4xl font-semibold uppercase tracking-[-0.08em]">
                        {activeProjects}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">
                      {t("overview.averageGain")}
                    </p>
                    <p className="stitch-mono text-xs uppercase tracking-[0.24em] text-black">{averageProductivity}x</p>
                  </div>
                  <div className="h-1 bg-black/8">
                    <div className="h-full bg-black" style={{ width: `${Math.min(Number(averageProductivity) * 10, 100)}%` }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">
                      {t("overview.toolsIntegrated")}
                    </p>
                    <p className="stitch-mono text-xs uppercase tracking-[0.24em] text-black">{toolCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-14 grid gap-px border-y border-black/15 bg-black/15 md:grid-cols-4">
              {[
                { label: t("overview.totalProjects"), value: totalProjects.toString() },
                { label: t("overview.activeProjects"), value: activeProjects.toString() },
                { label: t("overview.averageGain"), value: `${averageProductivity}x` },
                { label: t("overview.toolsIntegrated"), value: toolCount.toString() },
              ].map((item) => (
                <div key={item.label} className="bg-[#f7f5f1] px-4 py-4">
                  <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/45">{item.label}</p>
                  <p className="stitch-display mt-2 text-2xl font-semibold uppercase tracking-[-0.08em]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="border-b border-black/15 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
            <div className="flex flex-col gap-6 border-b border-black/15 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">
                  {t("projects.eyebrow")}
                </p>
                <h2 className="stitch-display mt-3 text-4xl font-semibold uppercase tracking-[-0.08em] text-black md:text-6xl">
                  {t("projects.title")}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-black/65 md:text-base">{t("projects.description")}</p>
            </div>

            <div className="mt-8 grid gap-px border border-black/15 bg-black/15 lg:grid-cols-2">
              {projects.map((project) => (
                <article key={project.id} className="flex h-full flex-col bg-white p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="stitch-mono text-[10px] uppercase tracking-[0.32em] text-black/45">
                        {t("projects.buildId")} {buildCode(project.id)}
                      </p>
                      <h3 className="stitch-display mt-4 text-3xl font-semibold uppercase tracking-[-0.08em] text-black md:text-4xl">
                        {project.title}
                      </h3>
                    </div>
                    <span className="stitch-mono shrink-0 border border-black/15 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-black">
                      {formatProjectStatus(project.status, t)}
                    </span>
                  </div>

                  <div className="mt-8 grid gap-6 md:grid-cols-[110px_minmax(0,1fr)]">
                    <div className="space-y-5">
                      <div>
                        <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/38">
                          {t("projects.domain")}
                        </p>
                        <p className="stitch-mono mt-2 text-xs uppercase tracking-[0.18em] text-black">{project.domain}</p>
                      </div>
                      {project.timeframe ? (
                        <div>
                          <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/38">
                            {t("projects.timeframe")}
                          </p>
                          <p className="stitch-mono mt-2 text-xs uppercase tracking-[0.18em] text-black">{project.timeframe}</p>
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <p className="text-sm leading-6 text-black/68">{project.description}</p>

                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/38">
                            {t("projects.progress")}
                          </p>
                          <p className="stitch-mono text-[10px] uppercase tracking-[0.24em] text-black">
                            {project.progress}%
                          </p>
                        </div>
                        <div className="h-1 bg-black/8">
                          <div className="h-full bg-black" style={{ width: `${project.progress}%` }} />
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-black/10 pt-5">
                        <span className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/38">
                          {t("projects.productivity")}
                        </span>
                        <span className="stitch-display text-2xl font-semibold uppercase tracking-[-0.08em] text-black">
                          {project.productivity}x
                        </span>
                        {project.aiSkills.slice(0, 2).map((skill) => (
                          <span key={`${project.id}-${skill}`} className="stitch-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-black/62">
                            <Dot className="h-3 w-3" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-black/10 pt-6">
                    <div className="mb-5 flex flex-wrap gap-2">
                      {project.tools.slice(0, 4).map((tool) => (
                        <span
                          key={`${project.id}-${tool}`}
                          className="stitch-mono border border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-black/70"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="stitch-mono inline-flex h-11 w-full items-center justify-between bg-black px-4 text-[10px] uppercase tracking-[0.3em] text-white transition-transform hover:-translate-y-0.5"
                      >
                        <span>{t("projects.launch")}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <StitchTechStack
          projects={projects.map((project) => ({
            id: project.id,
            title: project.title,
            tools: project.tools,
            aiSkills: project.aiSkills,
          }))}
          strings={{
            eyebrow: t("stack.eyebrow"),
            title: t("stack.title"),
            description: t("stack.description"),
            noData: t("stack.noData"),
          }}
        />

        <section id="contact" className="border-t border-black/15 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-16 text-center md:px-10 md:py-20">
            <p className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">
              {t("cta.eyebrow")}
            </p>
            <h2 className="stitch-display mx-auto mt-5 max-w-3xl text-4xl font-semibold uppercase leading-[0.92] tracking-[-0.09em] text-black md:text-6xl">
              {t("cta.title")}
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="https://buildinpublic.substack.com/"
                target="_blank"
                rel="noreferrer"
                className="stitch-mono inline-flex h-12 items-center justify-center bg-black px-6 text-[10px] uppercase tracking-[0.32em] text-white transition-transform hover:-translate-y-0.5"
              >
                {t("cta.primary")}
              </a>
              <Link
                href="/progress"
                className="stitch-mono inline-flex h-12 items-center justify-center border border-black/15 bg-[#f7f5f1] px-6 text-[10px] uppercase tracking-[0.32em] text-black transition-colors hover:border-black"
              >
                {t("cta.secondary")}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/15 bg-[#f7f5f1]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="stitch-display text-xl font-semibold uppercase tracking-[-0.08em] text-black">10xclaws</p>
            <p className="mt-2 text-sm text-black/62">{t("footer.tagline")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black" href="#projects">
              {t("footer.projects")}
            </a>
            <a className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black" href="#stack">
              {t("footer.stack")}
            </a>
            <Link className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black" href="/progress">
              {t("footer.progress")}
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
