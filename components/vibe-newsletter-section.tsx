"use client"

import { Mail } from "lucide-react"
import { IBM_Plex_Mono, Noto_Kufi_Arabic } from "next/font/google"
import { useTranslations, useLocale } from "next-intl"

const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "700"] })
const notoKufiArabic = Noto_Kufi_Arabic({ subsets: ["arabic"], weight: ["400", "700"] })

export function VibeNewsletterSection() {
  const t = useTranslations("HomePage.newsletter")
  const locale = useLocale()

  const fontClass = locale === "ar" ? notoKufiArabic.className : plexMono.className

  return (
    <section className={`${fontClass} px-6 py-12 bg-white border-b border-dashed border-gray-300`}>
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2 border-2 border-dashed border-gray-300 px-4 py-1 text-xs font-black uppercase tracking-widest bg-white">
            <Mail className="h-4 w-4 text-gray-400" />
            {t("stayUpdated")}
          </div>
        </div>

        <h2 className="mb-6 text-4xl md:text-5xl font-black uppercase tracking-tighter">
          {t("title")}
        </h2>

        <p className="mb-12 text-lg md:text-xl font-medium leading-relaxed text-gray-600 max-w-2xl mx-auto">
          {t("description")}
        </p>

        <div className="flex justify-center mb-8">
          <div className="relative p-2 border-2 border-dashed border-gray-300 bg-white max-w-full">
            <iframe 
              src="https://buildinpublic.substack.com/embed" 
              width="480" 
              height="320" 
              className="max-w-full"
              style={{ background: "white", overflow: "hidden" }} 
              title={t("iframeTitle")}
            />
          </div>
        </div>

        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {t("noSpam")}
        </p>
      </div>
    </section>
  )
}
