import { ProgressTracker } from "@/components/progress-tracker"
import { StitchLocaleToggle } from "@/components/stitch-locale-toggle"
import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function ProgressPage() {
  const t = await getTranslations("ProgressPage")

  return (
    <div className="min-h-screen bg-[#f7f5f1] text-black">
      <header className="sticky top-0 z-50 border-b border-black/15 bg-[#f7f5f1]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <Link href="/" className="stitch-display text-lg font-semibold uppercase tracking-[-0.08em] text-black md:text-xl">
            10xclaws
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:text-black" href="/">
              {t("nav.home")}
            </Link>
            <Link className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black transition-colors" href="/progress">
              {t("nav.progress")}
            </Link>
            <a className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:text-black" href="https://buildinpublic.substack.com/" target="_blank" rel="noreferrer">
              {t("nav.newsletter")}
            </a>
          </nav>

          <StitchLocaleToggle />
        </div>
      </header>

      <main>
        <section className="stitch-shell border-b border-black/15">
          <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
            <Link
              href="/"
              className="stitch-mono inline-flex items-center gap-2 border border-black/15 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black transition-colors hover:border-black"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("back")}
            </Link>

            <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div className="max-w-4xl">
                <p className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">
                  {t("eyebrow")}
                </p>
                <h1 className="stitch-display mt-5 text-[clamp(3rem,10vw,6rem)] font-semibold uppercase leading-[0.92] tracking-[-0.11em] text-black">
                  {t("title")}
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-7 text-black/68 md:text-lg">
                  {t("description")}
                </p>
              </div>

              <div className="border border-black/15 bg-white p-6 md:p-8">
                <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">
                  {t("aside.eyebrow")}
                </p>
                <h2 className="stitch-display mt-4 text-3xl font-semibold uppercase tracking-[-0.08em] text-black">
                  {t("aside.title")}
                </h2>
                <p className="mt-4 text-sm leading-6 text-black/62">{t("aside.description")}</p>
                <a
                  href="https://buildinpublic.substack.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="stitch-mono mt-6 inline-flex h-11 w-full items-center justify-center bg-black px-4 text-[10px] uppercase tracking-[0.3em] text-white transition-transform hover:-translate-y-0.5"
                >
                  {t("aside.cta")}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f5f1]">
          <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
            <ProgressTracker
              strings={{
                summary: {
                  audience: t("summary.audience"),
                  audienceHint: t("summary.audienceHint"),
                  youtube: t("summary.youtube"),
                  youtubeHint: t("summary.youtubeHint"),
                  revenue: t("summary.revenue"),
                  revenueHint: t("summary.revenueHint"),
                  productivity: t("summary.productivity"),
                  productivityHint: t("summary.productivityHint"),
                },
                timelineEyebrow: t("timeline.eyebrow"),
                timelineTitle: t("timeline.title"),
                timelineDescription: t("timeline.description"),
                monthLabel: t("timeline.monthLabel"),
                metrics: {
                  twitter: t("metrics.twitter"),
                  youtube: t("metrics.youtube"),
                  tiktok: t("metrics.tiktok"),
                  instagram: t("metrics.instagram"),
                  newsletter: t("metrics.newsletter"),
                  totalGmv: t("metrics.totalGmv"),
                  productivity: t("metrics.productivity"),
                  skills: t("metrics.skills"),
                },
                skillsTitle: t("timeline.skillsTitle"),
                milestonesTitle: t("timeline.milestonesTitle"),
              }}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-black/15 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="stitch-display text-xl font-semibold uppercase tracking-[-0.08em] text-black">10xclaws</p>
            <p className="mt-2 text-sm text-black/62">{t("footer.tagline")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black" href="/">
              {t("footer.home")}
            </Link>
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
