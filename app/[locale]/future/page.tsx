import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ArrowLeft } from "lucide-react"
import { FutureJsonRenderer } from "@/components/future-json-renderer"
import { StitchPublicHeader } from "@/components/stitch-public-header"
import { Link } from "@/i18n/routing"
import { futureCatalog } from "@/lib/future/catalog"
import { futureSpecs, normalizeFutureSpec } from "@/lib/future/specs"
import type { SupportedLocale } from "@/types/database"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: routeLocale } = await params
  const locale = (routeLocale === "ar" ? "ar" : "en") as SupportedLocale
  const t = await getTranslations({ locale, namespace: "FuturePage" })

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://www.10claws.com/${locale}/future`,
      languages: {
        en: "https://www.10claws.com/en/future",
        ar: "https://www.10claws.com/ar/future",
      },
    },
  }
}

export default async function FuturePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: routeLocale } = await params
  const locale = (routeLocale === "ar" ? "ar" : "en") as SupportedLocale
  const page = await getTranslations({ locale, namespace: "FuturePage" })
  const nav = await getTranslations({ locale, namespace: "HomePage.stitch.nav" })
  const spec = normalizeFutureSpec(futureSpecs[locale])
  const validation = futureCatalog.validate(spec)

  if (!validation.success) {
    throw new Error("Future page json-render spec is invalid.")
  }

  return (
    <div className="min-h-screen bg-[#f7f5f1] text-black selection:bg-black selection:text-white">
      <StitchPublicHeader
        locale={locale}
        labels={{
          projects: nav("projects"),
          stack: nav("stack"),
          future: nav("future"),
          contact: nav("contact"),
          progress: nav("progress"),
        }}
      />

      <main>
        <div className="border-b border-black/15 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-5 md:px-10">
            <Link
              href="/"
              className="stitch-mono inline-flex items-center gap-2 border border-black/15 bg-[#f7f5f1] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black transition-colors hover:border-black"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {page("back")}
            </Link>
          </div>
        </div>
        <FutureJsonRenderer spec={spec} />
      </main>

      <footer className="border-t border-black/15 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="stitch-display text-xl font-semibold uppercase tracking-[-0.08em] text-black">10xclaws</p>
            <p className="mt-2 text-sm text-black/62">{page("footer.tagline")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black" href="/">
              {page("footer.home")}
            </Link>
            <Link className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black" href="/future">
              {page("footer.future")}
            </Link>
            <Link className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/55 transition-colors hover:text-black" href="/progress">
              {page("footer.progress")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
