"use client"

import { IBM_Plex_Mono, Noto_Kufi_Arabic } from "next/font/google"
import { TextLoop } from "@/components/ui/text-loop"
import { useTranslations, useLocale } from "next-intl"

const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "700"] })
const notoKufiArabic = Noto_Kufi_Arabic({ subsets: ["arabic"], weight: ["400", "700"] })

export function VibeHero() {
  const t = useTranslations("HomePage.hero")
  const locale = useLocale()

  const tools = [
    "AI Agents",
    "Cursor",
    "Claude Code",
    "Gemini",
    "Nano Banana",
    "V0",
    "Codex",
    "Replit",
    "Kling",
    "Droid",
    "AMP",
    "Midjourney",
  ]

  const fontClass = locale === "ar" ? notoKufiArabic.className : plexMono.className

  return (
    <section className={`${fontClass} pt-12 pb-2 px-6 bg-white text-black`}>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 uppercase">
          <span>{t("attempt")}</span>
          <span>{t("buildFaster")}</span>
          <span>{t("with")}</span>
          <span className="border-2 border-dashed border-gray-300 px-4 py-1.5 min-w-[220px] text-center inline-block">
            <TextLoop interval={3} transition={{ duration: 0.5 }}>
              {tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </TextLoop>
          </span>
        </h1>

        <p className="max-w-3xl text-lg md:text-xl font-medium leading-relaxed mb-4 text-gray-800">
          {t("tagline")}
        </p>
      </div>
    </section>
  )
}
