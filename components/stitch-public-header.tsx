import Image from "next/image"
import { Link } from "@/i18n/routing"
import { StitchLocaleToggle } from "@/components/stitch-locale-toggle"
import type { SupportedLocale } from "@/types/database"

type StitchPublicHeaderProps = {
  locale: SupportedLocale
  labels: {
    projects: string
    stack: string
    contact: string
    progress: string
  }
  isHomepage?: boolean
}

function getSectionHref(locale: SupportedLocale, section: "projects" | "contact", isHomepage: boolean) {
  if (isHomepage) {
    return `#${section}`
  }

  return `/${locale}#${section}`
}

export function StitchPublicHeader({
  locale,
  labels,
  isHomepage = false,
}: StitchPublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/15 bg-[#f7f5f1]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Link href="/" className="group inline-flex items-center gap-3">
          <Image
            src="/10claws.svg"
            alt="10 Claws logo"
            width={42}
            height={42}
            className="h-10 w-10"
            priority
          />
          <span className="stitch-display text-lg font-semibold uppercase tracking-[-0.08em] text-black md:text-xl">
            10 Claws
          </span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/70 px-2 py-2 shadow-[0_8px_25px_rgba(0,0,0,0.05)] md:flex">
          <a
            className="stitch-mono rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:bg-black hover:text-white"
            href={getSectionHref(locale, "projects", isHomepage)}
          >
            {labels.projects}
          </a>
          <Link
            className="stitch-mono rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:bg-black hover:text-white"
            href="/stack"
          >
            {labels.stack}
          </Link>
          <a
            className="stitch-mono rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black/65 transition-colors hover:bg-black hover:text-white"
            href={getSectionHref(locale, "contact", isHomepage)}
          >
            {labels.contact}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/progress"
            className="stitch-mono hidden h-11 items-center rounded-full border border-black/15 bg-black px-5 text-[10px] uppercase tracking-[0.28em] text-white transition-transform hover:-translate-y-0.5 md:inline-flex"
          >
            {labels.progress}
          </Link>
          <StitchLocaleToggle />
        </div>
      </div>
    </header>
  )
}
