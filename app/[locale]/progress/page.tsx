import { ProgressTracker } from "@/components/progress-tracker"
import { StitchPublicHeader } from "@/components/stitch-public-header"
import { fetchGlobalMetrics } from "@/lib/data-fetching"
import { fetchPublicSiteCopy, getSiteCopyText } from "@/lib/site-content"
import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"
import type { SupportedLocale } from "@/types/database"

export default async function ProgressPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: routeLocale } = await params
  const locale = (routeLocale === "ar" ? "ar" : "en") as SupportedLocale
  const { data: metrics } = await fetchGlobalMetrics(locale)
  const { data: siteCopy } = await fetchPublicSiteCopy()
  const t = (key: string) => getSiteCopyText(siteCopy, locale, key)

  return (
    <div className="min-h-screen bg-[#f7f5f1] text-black">
      <StitchPublicHeader
        locale={locale}
        labels={{
          projects: t("HomePage.stitch.nav.projects"),
          stack: t("HomePage.stitch.nav.stack"),
          contact: t("HomePage.stitch.nav.contact"),
          progress: t("HomePage.stitch.nav.progress"),
        }}
      />

      <main>
        <section className="stitch-shell border-b border-black/15">
          <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
            <Link
              href="/"
              className="stitch-mono inline-flex items-center gap-2 border border-black/15 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black transition-colors hover:border-black"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("ProgressPage.back")}
            </Link>

            <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div className="max-w-4xl">
                <p className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">
                  {t("ProgressPage.eyebrow")}
                </p>
                <h1 className="stitch-display mt-5 text-[clamp(3rem,10vw,6rem)] font-semibold uppercase leading-[0.92] tracking-[-0.11em] text-black">
                  {t("ProgressPage.title")}
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-7 text-black/68 md:text-lg">
                  {t("ProgressPage.description")}
                </p>
              </div>

              <div className="border border-black/15 bg-white p-6 md:p-8">
                <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">
                  {t("ProgressPage.aside.eyebrow")}
                </p>
                <h2 className="stitch-display mt-4 text-3xl font-semibold uppercase tracking-[-0.08em] text-black">
                  {t("ProgressPage.aside.title")}
                </h2>
                <p className="mt-4 text-sm leading-6 text-black/62">{t("ProgressPage.aside.description")}</p>
                <a
                  href="https://buildinpublic.substack.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="stitch-mono mt-6 inline-flex h-11 w-full items-center justify-center bg-black px-4 text-[10px] uppercase tracking-[0.3em] text-white transition-transform hover:-translate-y-0.5"
                >
                  {t("ProgressPage.aside.cta")}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f5f1]">
          <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
            <ProgressTracker
              metrics={metrics}
              strings={{
                summary: {
                  audience: t("ProgressPage.summary.audience"),
                  audienceHint: t("ProgressPage.summary.audienceHint"),
                  youtube: t("ProgressPage.summary.youtube"),
                  youtubeHint: t("ProgressPage.summary.youtubeHint"),
                  revenue: t("ProgressPage.summary.revenue"),
                  revenueHint: t("ProgressPage.summary.revenueHint"),
                  pendingValue: t("ProgressPage.summary.pendingValue"),
                  pendingHint: t("ProgressPage.summary.pendingHint"),
                },
                timelineEyebrow: t("ProgressPage.timeline.eyebrow"),
                timelineTitle: t("ProgressPage.timeline.title"),
                timelineDescription: t("ProgressPage.timeline.description"),
                monthLabel: t("ProgressPage.timeline.monthLabel"),
                metrics: {
                  twitter: t("ProgressPage.metrics.twitter"),
                  youtube: t("ProgressPage.metrics.youtube"),
                  tiktok: t("ProgressPage.metrics.tiktok"),
                  instagram: t("ProgressPage.metrics.instagram"),
                  newsletter: t("ProgressPage.metrics.newsletter"),
                  totalGmv: t("ProgressPage.metrics.totalGmv"),
                  skills: t("ProgressPage.metrics.skills"),
                },
                skillsTitle: t("ProgressPage.timeline.skillsTitle"),
                milestonesTitle: t("ProgressPage.timeline.milestonesTitle"),
                launch: {
                  month: t("ProgressPage.launch.month"),
                  date: t("ProgressPage.launch.date"),
                  summaryHint: t("ProgressPage.launch.summaryHint"),
                  title: t("ProgressPage.launch.title"),
                  description: t("ProgressPage.launch.description"),
                  skill: t("ProgressPage.launch.skill"),
                  milestone: t("ProgressPage.launch.milestone"),
                },
              }}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-black/15 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="stitch-display text-xl font-semibold uppercase tracking-[-0.08em] text-black">10xclaws</p>
            <p className="mt-2 text-sm text-black/62">{t("ProgressPage.footer.tagline")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black" href="/">
              {t("ProgressPage.footer.home")}
            </Link>
            <Link className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black" href="/progress">
              {t("ProgressPage.footer.progress")}
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
