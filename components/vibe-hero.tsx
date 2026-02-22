import { getTranslations } from "next-intl/server"
import { ToolTextLoop } from "@/components/tool-text-loop"

export async function VibeHero() {
  const t = await getTranslations("HomePage.hero")

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

  return (
    <section className="vibe-font pt-12 pb-2 px-6 bg-white text-black">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 uppercase">
          <span>{t("attempt")}</span>
          <span>{t("buildFaster")}</span>
          <span>{t("with")}</span>
          <span className="border-2 border-dashed border-gray-300 px-4 py-1.5 min-w-[220px] text-center inline-block">
            <ToolTextLoop items={tools} />
          </span>
        </h1>

        <p className="max-w-3xl text-lg md:text-xl font-medium leading-relaxed mb-4 text-gray-800">
          {t("tagline")}
        </p>
      </div>
    </section>
  )
}
