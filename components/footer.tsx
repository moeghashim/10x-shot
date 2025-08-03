import { ExternalLink, Twitter, Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6" />
              <span className="text-xl font-bold">10xBuilder.ai</span>
            </div>
            <p className="text-gray-400 text-sm">
              Measuring the real impact of AI on productivity across 10 diverse projects.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#projects" className="text-gray-400 hover:text-white transition-colors">
                  View Projects
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Methodology
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Results & Insights
                </a>
              </li>
            </ul>
          </div>

          {/* Creator Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Created By</h3>
            <div className="space-y-2">
              <a
                href="https://x.com/moeghashim"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Twitter className="h-4 w-4" />
                @moeghashim
                <ExternalLink className="h-3 w-3" />
              </a>
              <p className="text-xs text-gray-500">Follow for real-time updates and insights from the experiment</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">© 2024 10xBuilder.ai. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Built with AI assistance</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
