import { VibeNavbar } from "@/components/vibe-navbar"
import { VibeHero } from "@/components/vibe-hero"
import { VibeCodingAgents } from "@/components/vibe-coding-agents"
import { VibeProjectGrid } from "@/components/vibe-project-grid"
import { VibeStatsSection } from "@/components/vibe-stats-section"
import { VibeNewsletterSection } from "@/components/vibe-newsletter-section"
import { VibeFooter } from "@/components/vibe-footer"
import { fetchProjects } from "@/lib/data-fetching"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "10XBuilder.ai - Measuring AI Productivity Impact",
  description: "Tracking the real impact of AI on productivity across 10 diverse projects. Can artificial intelligence truly deliver 10x improvements?",
  alternates: {
    canonical: "https://10xbuilder.ai",
  },
  openGraph: {
    title: "10XBuilder.ai - Measuring AI Productivity Impact",
    description: "Can AI deliver 10x improvements? We're tracking 10 projects to find out.",
    url: "https://10xbuilder.ai",
    siteName: "10XBuilder",
    images: [
      {
        url: "/social-image.svg",
        width: 1200,
        height: 630,
        alt: "10XBuilder.ai Experiment",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "10XBuilder.ai - Measuring AI Productivity Impact",
    description: "Tracking the real impact of AI on productivity across 10 diverse projects.",
    images: ["/social-image.svg"],
  },
}

export default async function HomePage() {
  const { data: projects } = await fetchProjects()

  // Prepare structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "10XBuilder.ai",
    "url": "https://10xbuilder.ai",
    "description": "Measuring AI Productivity Impact across 10 diverse projects.",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": projects.length,
      "itemListElement": projects.map((project, index) => ({
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
      <VibeCodingAgents />
      <VibeStatsSection />
      <VibeProjectGrid initialProjects={projects} />
      <VibeNewsletterSection />
      <VibeFooter />
    </div>
  )
}
