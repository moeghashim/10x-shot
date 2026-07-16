import { ArrowUpRight, CalendarDays, CircleDot, Radar } from "lucide-react"
import { StitchPublicHeader } from "@/components/stitch-public-header"
import { Link } from "@/i18n/routing"
import type { TrackUpdate, TrackedTechnology } from "@/lib/track/data"
import { trackContent } from "@/lib/track/data"
import type { SupportedLocale } from "@/types/database"

function formatDate(date: string, locale: SupportedLocale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}

function UpdateCard({
  update,
  locale,
  sourceAction,
}: {
  update: TrackUpdate
  locale: SupportedLocale
  sourceAction: string
}) {
  return (
    <article className="group relative border-t border-black/15 py-5 first:border-t-0 first:pt-0">
      <div className="grid gap-3 md:grid-cols-[7rem_1fr]">
        <div className="stitch-mono flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-black/50">
          <CalendarDays className="h-3.5 w-3.5" />
          <time dateTime={update.date}>{formatDate(update.date, locale)}</time>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${update.kind === "snapshot" ? "bg-amber-500" : "bg-emerald-600"}`}
            />
            <span className="stitch-mono text-[9px] uppercase tracking-[0.22em] text-black/42">
              {update.kind}
            </span>
          </div>
          <h3 className="stitch-display max-w-2xl text-xl font-semibold leading-tight tracking-[-0.04em] text-black md:text-2xl">
            {update.title}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/62">{update.summary}</p>
          <a
            href={update.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="stitch-mono mt-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-black/55 transition-colors hover:text-black"
          >
            {sourceAction}: {update.sourceLabel}
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  )
}

function TechnologyCard({
  technology,
  locale,
  sourceAction,
}: {
  technology: TrackedTechnology
  locale: SupportedLocale
  sourceAction: string
}) {
  return (
    <div id={technology.id} className="scroll-mt-28 border border-black/15 bg-white">
      <header className="grid gap-6 border-b border-black/15 p-6 md:grid-cols-[1fr_auto] md:p-8">
        <div className="flex items-start gap-4">
          <div
            className="stitch-mono flex h-12 w-12 shrink-0 items-center justify-center text-xs font-semibold tracking-[0.12em] text-white"
            style={{ backgroundColor: technology.accent }}
          >
            {technology.monogram}
          </div>
          <div>
            <h2 className="stitch-display text-3xl font-semibold tracking-[-0.06em] text-black md:text-4xl">
              {technology.name}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-black/58">{technology.description}</p>
          </div>
        </div>
        <a
          href={technology.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="stitch-mono inline-flex h-fit items-center justify-center gap-2 border border-black/15 bg-[#f7f5f1] px-4 py-3 text-[9px] uppercase tracking-[0.24em] text-black transition-colors hover:border-black"
        >
          {technology.sourceLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </header>
      <div className="p-6 md:p-8">
        {technology.updates.map((update) => (
          <UpdateCard
            key={`${technology.id}-${update.date}-${update.title}`}
            update={update}
            locale={locale}
            sourceAction={sourceAction}
          />
        ))}
      </div>
    </div>
  )
}

export function TrackPage({
  locale,
  navLabels,
}: {
  locale: SupportedLocale
  navLabels: {
    projects: string
    stack: string
    future: string
    contact: string
    progress: string
  }
}) {
  const content = trackContent[locale]
  const updateCount = content.technologies.reduce((total, item) => total + item.updates.length, 0)
  const categories: TrackedTechnology["category"][] = ["agents", "infrastructure", "commerce"]

  return (
    <div className="stitch-shell min-h-screen text-black selection:bg-black selection:text-white">
      <StitchPublicHeader locale={locale} labels={navLabels} />

      <main>
        <section className="border-b border-black/15">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_18rem] lg:items-end">
              <div>
                <p className="stitch-mono flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-black/55">
                  <Radar className="h-4 w-4" />
                  {content.eyebrow}
                </p>
                <h1 className="stitch-display mt-7 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.075em] text-black sm:text-6xl md:text-8xl">
                  {content.title}
                </h1>
                <p className="mt-8 max-w-2xl text-base leading-7 text-black/62 md:text-lg">{content.intro}</p>
              </div>

              <div className="border border-black/15 bg-white">
                {[
                  [content.topicsLabel, content.technologies.length.toString()],
                  [content.updateCountLabel, updateCount.toString()],
                  [content.updatedLabel, content.updatedValue],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 border-b border-black/15 px-5 py-4 last:border-b-0">
                    <span className="stitch-mono text-[9px] uppercase tracking-[0.22em] text-black/48">{label}</span>
                    <span className="stitch-mono text-xs font-medium text-black">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-2 border-t border-black/15 pt-6">
              {content.technologies.map((technology) => (
                <a
                  key={technology.id}
                  href={`#${technology.id}`}
                  className="stitch-mono inline-flex items-center gap-2 border border-black/15 bg-white px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-black/65 transition-colors hover:border-black hover:text-black"
                >
                  <CircleDot className="h-3 w-3" style={{ color: technology.accent }} />
                  {technology.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
          {categories.map((category) => {
            const technologies = content.technologies.filter((item) => item.category === category)

            return (
              <section key={category} className="mb-20 last:mb-0">
                <div className="mb-6 flex items-center gap-4">
                  <span className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/48">
                    {String(categories.indexOf(category) + 1).padStart(2, "0")}
                  </span>
                  <h2 className="stitch-display text-2xl font-semibold uppercase tracking-[-0.04em] text-black">
                    {content.sections[category]}
                  </h2>
                  <div className="h-px flex-1 bg-black/15" />
                </div>
                <div className="grid gap-6">
                  {technologies.map((technology) => (
                    <TechnologyCard
                      key={technology.id}
                      technology={technology}
                      locale={locale}
                      sourceAction={content.sourceAction}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      <footer className="border-t border-black/15 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-7 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="text-sm text-black/55">{content.footer}</p>
          <Link
            href="/"
            className="stitch-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-black/60 transition-colors hover:text-black"
          >
            {content.home}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </footer>
    </div>
  )
}
