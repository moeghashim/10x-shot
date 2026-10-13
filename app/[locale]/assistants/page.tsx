import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { StitchPublicHeader } from "@/components/stitch-public-header"
import { TierBoard } from "@/components/tier-board"
import { assistants, assistantContent } from "@/lib/assistants/data"
import type { SupportedLocale } from "@/types/database"
import "@/styles/stack-tier.css"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: routeLocale } = await params
  const locale = routeLocale === "ar" ? "ar" : "en"
  const content = assistantContent[locale]
  return {
    title: content.title, description: content.description,
    alternates: {
      canonical: `https://www.10claws.com/${locale}/assistants`,
      languages: { en: "https://www.10claws.com/en/assistants", ar: "https://www.10claws.com/ar/assistants" },
    },
  }
}

export default async function AssistantsRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: routeLocale } = await params
  const locale: SupportedLocale = routeLocale === "ar" ? "ar" : "en"
  const copy = assistantContent[locale]
  return <div className="claws-home stack-tier-page" data-theme="light" dir={locale === "ar" ? "rtl" : "ltr"}>
    <a className="claws-skip" href="#assistants-board">{copy.title}</a>
    <StitchPublicHeader locale={locale} />
    <main>
      <section className="stack-tier-intro">
        <div><p className="claws-label">{copy.eyebrow}</p><h1>{copy.title}</h1><p className="stack-tier-description">{copy.description}</p></div>
        <div className="stack-tier-total"><span>{assistants.length}</span><p className="claws-label">{copy.title}</p></div>
      </section>
      <section className="stack-tier-inventory" id="assistants-board" aria-label={copy.title}>
        <div className="stack-tier-toolbar"><p>{copy.hint}</p></div>
        <TierBoard items={assistants} labels={copy} />
        <p className="stack-tier-note">{copy.note}</p>
      </section>
    </main>
    <footer className="stack-tier-footer">
      <Link href="/" className="claws-brand"><Image src="/10claws.svg" alt="" width={18} height={18} /><bdi>10 CLAWS</bdi></Link>
      <nav aria-label={copy.footer}><Link href="/">{copy.home}</Link><Link href="/magic-follow">{copy.follow}</Link><Link href="/track">{copy.track}</Link></nav>
    </footer>
  </div>
}
