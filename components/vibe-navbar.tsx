import type React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { LocaleToggle } from "@/components/locale-toggle"
import { getTranslations } from "next-intl/server"
import { VibeMobileMenu } from "./vibe-mobile-menu"

export async function VibeNavbar() {
  const t = await getTranslations("HomePage.navbar")

  return (
    <nav className="vibe-font border-b border-dashed border-gray-300 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center">
          <Link href="/" className="me-12 group inline-flex items-center">
            <Image
              src="/10claws.svg"
              alt="10xBuilder.ai logo"
              width={44}
              height={44}
              className="h-11 w-11"
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-0">
          <NavLink href="#">{t("events")}</NavLink>
          <NavLink href="#">{t("blog")}</NavLink>

          <LocaleToggle />
        </div>

        {/* Mobile Menu */}
        <VibeMobileMenu 
          translations={{
            events: t("events"),
            blog: t("blog")
          }} 
        />
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="px-6 py-5 text-sm font-bold border-s border-dashed border-gray-300 hover:bg-gray-50 transition-colors"
    >
      {children}
    </Link>
  )
}
