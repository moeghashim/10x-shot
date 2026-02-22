import { VibeNavbar } from "@/components/vibe-navbar"
import { VibeHero } from "@/components/vibe-hero"
import { VibeCodingAgents } from "@/components/vibe-coding-agents"
import { VibeProjectGrid } from "@/components/vibe-project-grid"
import { VibeStatsSection } from "@/components/vibe-stats-section"
import { VibeNewsletterSection } from "@/components/vibe-newsletter-section"
import { VibeFooter } from "@/components/vibe-footer"
import { fetchProjects } from "@/lib/data-fetching"
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
  const { data: projects } = await fetchProjects()
  const tTechStack = await getTranslations("HomePage.techStack")
  const safeProjects = projects || []
  const techProjects = safeProjects.map(({ id, title, tools, aiSkills }) => ({ id, title, tools, aiSkills }))

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
          "keywords": [...project.mySkills, ...project.aiSkills].join(", ")
        }
      }))
    }
  }

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VibeNavbar />
      <VibeHero />
      <VibeCodingAgents
        projects={techProjects}
        strings={{
          title: tTechStack("title"),
          description: tTechStack("description"),
          selectProject: tTechStack("selectProject"),
          placeholder: tTechStack("placeholder"),
          noData: tTechStack("noData"),
        }}
      />
      <VibeStatsSection projects={safeProjects} />
      <VibeProjectGrid projects={safeProjects} />
      <VibeNewsletterSection />
      <VibeFooter />
    </div>
  )
}
