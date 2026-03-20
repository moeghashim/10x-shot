"use client"

import { Languages } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

function getLocaleFromPathname(pathname: string): "en" | "ar" | null {
  const match = pathname.match(/^\/(en|ar)(\/|$)/)
  return (match?.[1] as "en" | "ar" | undefined) ?? null
}

export function StitchLocaleToggle() {
  const router = useRouter()
  const pathname = usePathname() || "/"

  const currentLocale = getLocaleFromPathname(pathname) ?? "en"
  const nextLocale = currentLocale === "en" ? "ar" : "en"

  const toggleLocale = () => {
    if (pathname === "/") {
      router.replace(`/${nextLocale}`)
      return
    }

    if (getLocaleFromPathname(pathname)) {
      const rest = pathname.replace(/^\/(en|ar)/, "")
      router.replace(`/${nextLocale}${rest || ""}`)
      return
    }

    router.replace(`/${nextLocale}${pathname}`)
  }

  return (
    <button
      onClick={toggleLocale}
      type="button"
      title={nextLocale === "ar" ? "العربية" : "English"}
      className="stitch-mono inline-flex h-10 items-center gap-2 border border-black bg-white px-3 text-[10px] font-medium uppercase tracking-[0.28em] transition-colors hover:bg-black hover:text-white"
    >
      <Languages className="h-3.5 w-3.5" />
      <span>{nextLocale}</span>
    </button>
  )
}
