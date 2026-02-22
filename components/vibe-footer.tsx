import { ExternalLink, Twitter, Github } from "lucide-react"
import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"

export async function VibeFooter() {
  const t = await getTranslations("HomePage.footer")

  return (
    <footer className="vibe-font bg-white text-black border-t-2 border-black">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Link href="/" className="text-3xl font-black tracking-tighter uppercase group">
                <span className="bg-black text-white px-1.5 py-0.5 me-0.5 transform -skew-x-6">10X</span>
                <span className="border-2 border-black px-1.5 py-0.5 ms-0.5 transform skew-x-6">BUILDER</span>
              </Link>
            </div>
            <p className="text-gray-800 font-medium leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black inline-block pb-1">{t("quickLinks")}</h3>
            <ul className="space-y-3 font-bold uppercase tracking-tighter text-sm">
              <li>
                <a href="#projects" className="hover:underline transition-all text-start block">
                  {t("viewProjects")}
                </a>
              </li>
              <li>
                <Link href="/progress" className="hover:underline transition-all text-start block">
                  {t("progressTracker")}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:underline transition-all text-start block">
                  {t("methodology")}
                </a>
              </li>
            </ul>
          </div>

          {/* Creator Section */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black inline-block pb-1">{t("connect")}</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <a
                  href="https://x.com/moeghashim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-black uppercase tracking-tighter hover:underline transition-all"
                >
                  <Twitter className="h-4 w-4" />
                  @moeghashim
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://github.com/moeghashim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-black uppercase tracking-tighter hover:underline transition-all"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-start">
                {t("follow")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-dashed border-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              {t("rights")}
            </p>
            <div className="flex items-center gap-2 px-3 py-1 border-2 border-black text-[10px] font-black uppercase tracking-widest">
              {t("builtWith")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
