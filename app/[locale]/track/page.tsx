import type { Metadata } from "next"
import { TrackPage } from "@/components/track-page"
import { trackContent } from "@/lib/track/data"
import type { SupportedLocale } from "@/types/database"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: routeLocale } = await params
  const locale = (routeLocale === "ar" ? "ar" : "en") as SupportedLocale
  const content = trackContent[locale]

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: `https://www.10claws.com/${locale}/track`,
      languages: {
        en: "https://www.10claws.com/en/track",
        ar: "https://www.10claws.com/ar/track",
      },
    },
  }
}

export default async function TrackRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: routeLocale } = await params
  const locale = (routeLocale === "ar" ? "ar" : "en") as SupportedLocale

  return (
    <TrackPage locale={locale} />
  )
}
