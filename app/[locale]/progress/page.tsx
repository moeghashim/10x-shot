import { ProgressTracker } from "@/components/progress-tracker"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-black mb-4">Progress Tracker</h1>
          <p className="text-lg text-gray-600">
            Monthly tracking of key metrics and milestones throughout the 10x experiment
          </p>
        </div>

        <ProgressTracker />
      </div>
      
      <Footer />
    </div>
  )
}
