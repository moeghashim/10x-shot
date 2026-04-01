import { StitchHomepage } from "@/components/stitch-homepage"
import { FALLBACK_PROJECTS } from "@/lib/constants"
import { fetchPublicSiteCopy, getSiteCopyText } from "@/lib/site-content"
import type { SupportedLocale } from "@/types/database"

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const normalizedLocale = (locale === "ar" ? "ar" : "en") as SupportedLocale
  const { data: siteCopy } = await fetchPublicSiteCopy()
  const title = getSiteCopyText(siteCopy, normalizedLocale, "HomePage.title")
  const description = getSiteCopyText(siteCopy, normalizedLocale, "HomePage.description")

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.10claws.com/${locale}`,
      languages: {
        'en': 'https://www.10claws.com/en',
        'ar': 'https://www.10claws.com/ar',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.10claws.com/${locale}`,
      siteName: "10claws",
      images: [
        {
          url: "/social-image.svg",
          width: 1200,
          height: 630,
          alt: "10claws Experiment",
        },
      ],
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/social-image.svg"],
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: routeLocale } = await params
  const locale = (routeLocale === "ar" ? "ar" : "en") as SupportedLocale
  const { fetchProjects } = await import("@/lib/data-fetching")
  const { data: projects } = await fetchProjects({ locale })
  const { data: siteCopy } = await fetchPublicSiteCopy()
  const safeProjects = projects || FALLBACK_PROJECTS

  // Prepare structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "10claws",
    "url": "https://www.10claws.com",
    "description": getSiteCopyText(siteCopy, locale, "HomePage.description"),
    "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": safeProjects.length,
    "itemListElement": safeProjects.map((project, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CreativeWork",
          "name": project.title,
          "description": project.description,
          "url": project.url || `https://www.10claws.com#projects`,
          "keywords": [...project.aiSkills, ...project.tools].join(", ")
        }
      }))
    }
  }

  return (
    <div className="selection:bg-black selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StitchHomepage projects={safeProjects} locale={locale} copy={siteCopy} />
    </div>
  )
}
