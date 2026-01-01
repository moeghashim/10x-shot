import { VibeNavbar } from "@/components/vibe-navbar"
import { VibeHero } from "@/components/vibe-hero"
import { VibeCodingAgents } from "@/components/vibe-coding-agents"
import { VibeProjectGrid } from "@/components/vibe-project-grid"
import { VibeStatsSection } from "@/components/vibe-stats-section"
import { VibeNewsletterSection } from "@/components/vibe-newsletter-section"
import { VibeFooter } from "@/components/vibe-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <VibeNavbar />
      <VibeHero />
      <VibeCodingAgents />
      <VibeStatsSection />
      <VibeProjectGrid />
      <VibeNewsletterSection />
      <VibeFooter />
    </div>
  )
}
