import { ProjectGrid } from "@/components/project-grid"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <StatsSection />
      <ProjectGrid />
    </div>
  )
}
