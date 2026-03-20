import { StitchHomepage } from "@/components/stitch-homepage"
import { FALLBACK_PROJECTS } from "@/lib/constants"
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'HomePage'});

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://10xbuilder.ai/${locale}`,
      languages: {
        'en': 'https://10xbuilder.ai/en',
        'ar': 'https://10xbuilder.ai/ar',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://10xbuilder.ai/${locale}`,
      siteName: "10XBuilder",
      images: [
        {
          url: "/social-image.svg",
          width: 1200,
          height: 630,
          alt: "10XBuilder.ai Experiment",
        },
      ],
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
      images: ["/social-image.svg"],
    },
  }
}

export default async function HomePage() {
  const hasSupabaseEnv =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  let safeProjects = FALLBACK_PROJECTS

  if (hasSupabaseEnv) {
    const { fetchProjects } = await import("@/lib/data-fetching")
    const { data: projects } = await fetchProjects()
    safeProjects = projects || FALLBACK_PROJECTS
  }

  // Prepare structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "10XBuilder.ai",
    "url": "https://10xbuilder.ai",
    "description": "Measuring AI Productivity Impact across 10 diverse projects.",
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
          "url": project.url || `https://10xbuilder.ai#projects`,
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
      {await StitchHomepage({ projects: safeProjects })}
    </div>
  )
}
