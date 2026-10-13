import type { StackGrade } from "@/types/database"

export type Assistant = { id: string; name: string; href: string; grade?: StackGrade }

// Curated list supplied by the owner. Missing grades intentionally remain ungraded.
export const assistants: Assistant[] = [
  { id: "openclaw", name: "OpenClaw", href: "https://openclaw.ai/" },
  { id: "muse", name: "Muse", href: "https://ai.meta.com/muse/" },
  { id: "grok-bot", name: "Grok Bot", href: "https://x.ai/" },
  { id: "dots", name: "Dots", href: "https://openai.com/index/introducing-dots/" },
  { id: "mausbot", name: "Mausbot", href: "https://mausbot.com/" },
  { id: "hermes", name: "Hermes", href: "https://hermes-agent.nousresearch.com/" },
]

export const assistantContent = {
  en: {
    title: "Assistants", description: "A collection of AI assistants, with their official links and personal ratings.",
    eyebrow: "Personal inventory / AI assistants", grade: "Grade", ungraded: "Ungraded",
    unrated: "No assistants rated in this tier yet.", skill: "Assistant", details: "Visit assistant",
    hint: "Select an assistant to visit its website.", note: "No grades assigned yet. Unrated assistants live in their own row.",
    home: "Home", follow: "Magic follow", track: "Track", footer: "Footer",
  },
  ar: {
    title: "المساعدون", description: "مجموعة من مساعدي الذكاء الاصطناعي، مع روابطهم الرسمية وتقييماتي الشخصية.",
    eyebrow: "جرد شخصي / مساعدو الذكاء الاصطناعي", grade: "التقييم", ungraded: "غير مقيّم",
    unrated: "لم يُقيّم أي مساعد في هذا المستوى بعد.", skill: "مساعد", details: "زيارة المساعد",
    hint: "اختر مساعدًا لزيارة موقعه.", note: "لم تُحدّد التقييمات بعد. المساعدون غير المقيّمين في صف مستقل.",
    home: "الرئيسية", follow: "متابعات مميزة", track: "المتابعة", footer: "روابط التذييل",
  },
}
