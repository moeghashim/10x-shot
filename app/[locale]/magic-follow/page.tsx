import type { Metadata } from "next";
import { MagicFollowPage } from "@/components/magic-follow-page";
import { magicFollowContent, magicFollowPeople } from "@/lib/magic-follow/content";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params;
  const locale = routeLocale === "ar" ? "ar" : "en";
  const content = magicFollowContent[locale];
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `https://www.10claws.com/${locale}/magic-follow`,
      languages: { en: "https://www.10claws.com/en/magic-follow", ar: "https://www.10claws.com/ar/magic-follow" },
    },
  };
}

export default async function MagicFollowRoute({ params }: PageProps) {
  const { locale } = await params;
  return <MagicFollowPage locale={locale === "ar" ? "ar" : "en"} people={magicFollowPeople} />;
}
