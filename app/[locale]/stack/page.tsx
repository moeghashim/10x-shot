import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { StackPage } from "@/components/stack-page"
import { fetchStack } from "@/lib/data-fetching"
import type { SupportedLocale } from "@/types/database"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: routeLocale } = await params
  const locale = (routeLocale === "ar" ? "ar" : "en") as SupportedLocale
  const t = await getTranslations({ locale, namespace: "StackPage" })

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://www.10claws.com/${locale}/stack`,
      languages: {
        en: "https://www.10claws.com/en/stack",
        ar: "https://www.10claws.com/ar/stack",
      },
    },
  }
}

export default async function StackRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: routeLocale } = await params
  const locale = (routeLocale === "ar" ? "ar" : "en") as SupportedLocale
  const t = await getTranslations({ locale, namespace: "StackPage" })
  const nav = await getTranslations({ locale, namespace: "HomePage.stitch.nav" })
  const progressNav = await getTranslations({ locale, namespace: "ProgressPage.nav" })
  const { data: stackItems } = await fetchStack()

  return (
    <StackPage
      locale={locale}
      stackItems={stackItems}
      strings={{
        title: t("title"),
        description: t("description"),
        eyebrow: t("eyebrow"),
        grade: t("grade"),
        category: t("category"),
        usage: t("usage"),
        noProjects: t("noProjects"),
        empty: t("empty"),
        backToProjects: t("projects"),
        stack: t("stack"),
        views: {
          cards: t("views.cards"),
          matrix: t("views.matrix"),
        },
        categories: {
          tool: t("categories.tool"),
          ai_skill: t("categories.ai_skill"),
        },
        nav: {
          projects: nav("projects"),
          stack: nav("stack"),
          contact: nav("contact"),
          progress: nav("progress"),
          home: progressNav("home"),
        },
      }}
    />
  )
}
