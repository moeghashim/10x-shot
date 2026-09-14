import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { StitchPublicHeader } from "@/components/stitch-public-header"
import { Link } from "@/i18n/routing"
import { aboutContent } from "@/lib/about/content"

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const content = aboutContent[locale === "ar" ? "ar" : "en"]
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `https://www.10claws.com/${locale}/about`,
      languages: { en: "https://www.10claws.com/en/about", ar: "https://www.10claws.com/ar/about" },
    },
  }
}

export default async function AboutPage({ params }: PageProps) {
  const { locale: routeLocale } = await params
  const locale = routeLocale === "ar" ? "ar" : "en"
  const content = aboutContent[locale]
  const nav = await getTranslations({ locale, namespace: "HomePage.stitch.nav" })

  return (
    <div className="min-h-screen bg-[#f7f5f1] text-black selection:bg-black selection:text-white">
      <StitchPublicHeader locale={locale} labels={{ projects: nav("projects"), stack: nav("stack"), future: nav("future"), contact: nav("contact"), progress: nav("progress") }} />
      <main className="mx-auto max-w-7xl px-6 md:px-10">
        <section className="border-b border-black/15 py-16 md:py-24">
          <p className="stitch-mono text-xs uppercase tracking-[0.2em] text-black/60">{content.label}</p>
          <h1 className="stitch-display mt-6 max-w-5xl text-4xl font-semibold leading-tight md:text-6xl">{content.heading}</h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-black/65 md:text-xl">{content.intro}</p>
        </section>
        <section className="grid gap-10 border-b border-black/15 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="stitch-display text-3xl font-semibold leading-tight">{content.mission}</h2>
            <p className="mt-5 max-w-xl leading-8 text-black/65">{content.missionBody}</p>
          </div>
          <div className="grid gap-5">
            {content.offerings.map((offering) => (
              <article key={offering.title} className="border border-black/15 bg-white p-6 md:p-8">
                <h3 className="stitch-display text-2xl font-semibold">{offering.title}</h3>
                <p className="mt-4 leading-7 text-black/65">{offering.body}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="py-14 md:py-20">
          <h2 className="stitch-display max-w-3xl text-3xl font-semibold leading-tight">{content.approach}</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {content.steps.map((step, index) => (
              <li key={step.title} className="border-t border-black/25 pt-5">
                <span className="stitch-mono text-xs text-black/50">0{index + 1}</span>
                <h3 className="stitch-display mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-7 text-black/65">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="mb-16 bg-black p-8 text-white md:p-12">
          <h2 className="stitch-display text-3xl font-semibold leading-tight">{content.ctaTitle}</h2>
          <p className="mt-4 leading-7 text-white/70">{content.ctaBody}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/#contact" className="border border-white bg-white px-6 py-3 font-medium text-black hover:bg-white/90">{content.contact}</Link>
            <Link href="/#projects" className="border border-white/40 px-6 py-3 font-medium hover:bg-white/10">{content.projects}</Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-black/15 px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm">
          <span className="stitch-display font-semibold">10 Claws</span>
          <Link href="/" className="text-black/65 hover:text-black">{content.home}</Link>
        </div>
      </footer>
    </div>
  )
}
