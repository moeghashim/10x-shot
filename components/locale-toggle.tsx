"use client"

import { Languages } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

function getLocaleFromPathname(pathname: string): "en" | "ar" | null {
  const match = pathname.match(/^\/(en|ar)(\/|$)/)
  return (match?.[1] as "en" | "ar" | undefined) ?? null
}

export function LocaleToggle() {
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
      className="p-4 border-s border-dashed border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
      title={nextLocale === "ar" ? "العربية" : "English"}
      type="button"
    >
      <Languages className="h-5 w-5" />
      <span className="text-xs font-bold uppercase">{nextLocale}</span>
    </button>
  )
}

