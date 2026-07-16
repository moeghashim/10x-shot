import type { SupportedLocale } from "@/types/database"

export type TrackUpdate = {
  date: string
  title: string
  summary: string
  sourceLabel: string
  sourceUrl: string
  kind: "release" | "product" | "snapshot"
}

export type TrackedTechnology = {
  id: string
  name: string
  category: "agents" | "infrastructure" | "commerce"
  description: string
  sourceUrl: string
  sourceLabel: string
  accent: string
  monogram: string
  updates: TrackUpdate[]
}

type TrackPageContent = {
  meta: {
    title: string
    description: string
  }
  eyebrow: string
  title: string
  intro: string
  updatedLabel: string
  updatedValue: string
  sourcesLabel: string
  topicsLabel: string
  updateCountLabel: string
  sections: Record<TrackedTechnology["category"], string>
  sourceAction: string
  noDatedUpdate: string
  footer: string
  home: string
  technologies: TrackedTechnology[]
}

const shared = {
  updatedValue: "2026-07-16",
}

export const trackContent: Record<SupportedLocale, TrackPageContent> = {
  en: {
    ...shared,
    meta: {
      title: "Track | 10 Claws",
      description: "A living watchlist of coding agents, developer infrastructure, and agentic commerce.",
    },
    eyebrow: "Technology watchlist / July 2026",
    title: "Track what changes the way we build.",
    intro:
      "A curated signal feed for technologies I am actively evaluating—not every announcement, only changes worth revisiting.",
    updatedLabel: "Research refreshed",
    sourcesLabel: "Primary sources",
    topicsLabel: "Topics tracked",
    updateCountLabel: "July signals",
    sections: {
      agents: "Agents",
      infrastructure: "Infrastructure",
      commerce: "Agentic commerce",
    },
    sourceAction: "Open source",
    noDatedUpdate: "No dated July release found; monitoring the primary source.",
    footer: "Built as a living research surface. Scheduled updates are next.",
    home: "Back to 10 Claws",
    technologies: [
      {
        id: "codex",
        name: "Codex",
        category: "agents",
        description: "OpenAI's coding agent across desktop, CLI, cloud, and IDE workflows.",
        sourceUrl: "https://learn.chatgpt.com/docs/changelog",
        sourceLabel: "Codex changelog",
        accent: "#111111",
        monogram: "CX",
        updates: [
          {
            date: "2026-07-16",
            title: "CLI 0.144.5 tightens dangerous-command detection",
            summary:
              "Forced removal patterns are detected more reliably, with clearer reasons when a command is rejected.",
            sourceLabel: "Codex changelog",
            sourceUrl: "https://learn.chatgpt.com/docs/changelog",
            kind: "release",
          },
          {
            date: "2026-07-09",
            title: "Codex joins the ChatGPT desktop app",
            summary:
              "The desktop experience adds direct Markdown and code editing, inline annotations, PR review, and multi-repository projects.",
            sourceLabel: "Codex changelog",
            sourceUrl: "https://learn.chatgpt.com/docs/changelog",
            kind: "product",
          },
        ],
      },
      {
        id: "claude-code",
        name: "Claude Code",
        category: "agents",
        description: "Anthropic's terminal coding agent and its growing multi-agent workflow surface.",
        sourceUrl: "https://github.com/anthropics/claude-code/releases",
        sourceLabel: "Claude Code releases",
        accent: "#d97757",
        monogram: "CC",
        updates: [
          {
            date: "2026-07-15",
            title: "Subagent streams become more observable",
            summary:
              "Version 2.1.211 can forward subagent text and thinking in stream-json output, alongside permission and shared-session fixes.",
            sourceLabel: "Claude Code v2.1.211",
            sourceUrl: "https://github.com/anthropics/claude-code/releases/tag/v2.1.211",
            kind: "release",
          },
          {
            date: "2026-07-14",
            title: "Accessibility and worktree isolation improve",
            summary:
              "July releases add screen-reader rendering and fix isolated subagents running git mutations against the main checkout.",
            sourceLabel: "Claude Code releases",
            sourceUrl: "https://github.com/anthropics/claude-code/releases",
            kind: "product",
          },
          {
            date: "2026-07-01",
            title: "Background subagents become the default",
            summary:
              "Claude keeps working while subagents run, with completion and input-needed notifications exposed through hooks.",
            sourceLabel: "Claude Code v2.1.198",
            sourceUrl: "https://github.com/anthropics/claude-code/releases/tag/v2.1.198",
            kind: "product",
          },
        ],
      },
      {
        id: "pi",
        name: "Pi",
        category: "agents",
        description: "A minimal, extensible coding-agent harness with a fast-moving provider and extension ecosystem.",
        sourceUrl: "https://github.com/earendil-works/pi/releases",
        sourceLabel: "Pi releases",
        accent: "#6d5dfc",
        monogram: "PI",
        updates: [
          {
            date: "2026-07-14",
            title: "Dynamic tools keep prompt caches warm",
            summary:
              "Pi 0.80.7 lets extensions load tools during execution while preserving cache-friendly prompt prefixes on supported models.",
            sourceLabel: "Pi v0.80.7",
            sourceUrl: "https://github.com/earendil-works/pi/releases/tag/v0.80.7",
            kind: "release",
          },
          {
            date: "2026-07-09",
            title: "A new max thinking level arrives",
            summary:
              "Pi 0.80.6 adds opt-in max thinking across the CLI, SDK, RPC, model selection, and custom themes.",
            sourceLabel: "Pi v0.80.6",
            sourceUrl: "https://github.com/earendil-works/pi/releases/tag/v0.80.6",
            kind: "release",
          },
        ],
      },
      {
        id: "stripe-projects",
        name: "Stripe Projects",
        category: "infrastructure",
        description: "CLI provisioning for services, credentials, billing, and agent-ready app infrastructure.",
        sourceUrl: "https://projects.dev/",
        sourceLabel: "projects.dev",
        accent: "#635bff",
        monogram: "SP",
        updates: [
          {
            date: "2026-07-16",
            title: "Source watch: one command from service to credentials",
            summary:
              "The current product surface centers on stripe projects init, catalog, add, and upgrade, with credentials synced back to the local environment.",
            sourceLabel: "projects.dev",
            sourceUrl: "https://projects.dev/",
            kind: "snapshot",
          },
        ],
      },
      {
        id: "agentic-commerce",
        name: "Agentic Commerce Protocol",
        category: "commerce",
        description: "An open protocol for secure programmatic checkout between buyers, agents, and businesses.",
        sourceUrl: "https://www.agenticcommerce.dev/",
        sourceLabel: "agenticcommerce.dev",
        accent: "#0f766e",
        monogram: "AC",
        updates: [
          {
            date: "2026-07-16",
            title: "Source watch: open checkout standard",
            summary:
              "ACP remains REST- and MCP-compatible, keeps businesses as merchant of record, and supports physical goods, digital goods, subscriptions, and asynchronous purchases.",
            sourceLabel: "agenticcommerce.dev",
            sourceUrl: "https://www.agenticcommerce.dev/",
            kind: "snapshot",
          },
        ],
      },
    ],
  },
  ar: {
    ...shared,
    meta: {
      title: "المتابعة | 10 Claws",
      description: "قائمة متابعة حيّة لوكلاء البرمجة والبنية التحتية للمطورين والتجارة الوكيلة.",
    },
    eyebrow: "قائمة متابعة التقنية / يوليو 2026",
    title: "نتابع ما يغيّر طريقة البناء.",
    intro: "موجز منتقى للتقنيات التي أقيّمها فعلياً—ليس كل إعلان، بل التغييرات التي تستحق العودة إليها.",
    updatedLabel: "آخر تحديث للبحث",
    sourcesLabel: "مصادر أساسية",
    topicsLabel: "تقنيات قيد المتابعة",
    updateCountLabel: "إشارات يوليو",
    sections: {
      agents: "الوكلاء",
      infrastructure: "البنية التحتية",
      commerce: "التجارة الوكيلة",
    },
    sourceAction: "فتح المصدر",
    noDatedUpdate: "لم نجد إصداراً مؤرخاً في يوليو؛ نستمر في مراقبة المصدر الأساسي.",
    footer: "مساحة بحث حيّة. الخطوة التالية هي التحديثات المجدولة.",
    home: "العودة إلى 10 Claws",
    technologies: [
      {
        id: "codex",
        name: "Codex",
        category: "agents",
        description: "وكيل البرمجة من OpenAI عبر تطبيق سطح المكتب وواجهة الأوامر والسحابة وبيئات التطوير.",
        sourceUrl: "https://learn.chatgpt.com/docs/changelog",
        sourceLabel: "سجل تغييرات Codex",
        accent: "#111111",
        monogram: "CX",
        updates: [
          {
            date: "2026-07-16",
            title: "الإصدار 0.144.5 يعزّز اكتشاف الأوامر الخطرة",
            summary: "تحسين رصد أنماط الحذف القسري وتوضيح سبب رفض الأمر للمستخدم.",
            sourceLabel: "سجل تغييرات Codex",
            sourceUrl: "https://learn.chatgpt.com/docs/changelog",
            kind: "release",
          },
          {
            date: "2026-07-09",
            title: "Codex ينضم إلى تطبيق ChatGPT لسطح المكتب",
            summary: "تحرير مباشر للكود وMarkdown، وملاحظات سطرية، ومراجعة طلبات السحب، والعمل عبر عدة مستودعات.",
            sourceLabel: "سجل تغييرات Codex",
            sourceUrl: "https://learn.chatgpt.com/docs/changelog",
            kind: "product",
          },
        ],
      },
      {
        id: "claude-code",
        name: "Claude Code",
        category: "agents",
        description: "وكيل Anthropic للطرفية مع مساحة متنامية لسير العمل متعدد الوكلاء.",
        sourceUrl: "https://github.com/anthropics/claude-code/releases",
        sourceLabel: "إصدارات Claude Code",
        accent: "#d97757",
        monogram: "CC",
        updates: [
          {
            date: "2026-07-15",
            title: "رؤية أوضح لتدفقات الوكلاء الفرعيين",
            summary: "يتيح الإصدار 2.1.211 تمرير نص الوكيل الفرعي وتفكيره ضمن stream-json، مع إصلاحات للأذونات والجلسات المشتركة.",
            sourceLabel: "Claude Code v2.1.211",
            sourceUrl: "https://github.com/anthropics/claude-code/releases/tag/v2.1.211",
            kind: "release",
          },
          {
            date: "2026-07-14",
            title: "تحسينات لإتاحة الوصول وعزل worktree",
            summary: "أضافت إصدارات يوليو وضع قارئ الشاشة وأصلحت تنفيذ الوكلاء المعزولين لتعديلات Git في المجلد الرئيسي.",
            sourceLabel: "إصدارات Claude Code",
            sourceUrl: "https://github.com/anthropics/claude-code/releases",
            kind: "product",
          },
          {
            date: "2026-07-01",
            title: "الوكلاء الفرعيون يعملون في الخلفية افتراضياً",
            summary: "يواصل Claude العمل أثناء تشغيل الوكلاء الفرعيين مع إشعارات عند الاكتمال أو الحاجة إلى تدخل.",
            sourceLabel: "Claude Code v2.1.198",
            sourceUrl: "https://github.com/anthropics/claude-code/releases/tag/v2.1.198",
            kind: "product",
          },
        ],
      },
      {
        id: "pi",
        name: "Pi",
        category: "agents",
        description: "بيئة وكيل برمجة بسيطة وقابلة للتوسعة مع منظومة مزودين وامتدادات سريعة التطور.",
        sourceUrl: "https://github.com/earendil-works/pi/releases",
        sourceLabel: "إصدارات Pi",
        accent: "#6d5dfc",
        monogram: "PI",
        updates: [
          {
            date: "2026-07-14",
            title: "الأدوات الديناميكية تحافظ على ذاكرة التخزين المؤقت",
            summary: "يتيح Pi 0.80.7 للامتدادات تحميل أدوات أثناء التنفيذ مع الحفاظ على بادئات التعليمات المخزنة للنماذج المدعومة.",
            sourceLabel: "Pi v0.80.7",
            sourceUrl: "https://github.com/earendil-works/pi/releases/tag/v0.80.7",
            kind: "release",
          },
          {
            date: "2026-07-09",
            title: "مستوى max جديد للتفكير",
            summary: "يضيف Pi 0.80.6 مستوى max اختيارياً عبر واجهة الأوامر وSDK وRPC واختيار النماذج والسمات.",
            sourceLabel: "Pi v0.80.6",
            sourceUrl: "https://github.com/earendil-works/pi/releases/tag/v0.80.6",
            kind: "release",
          },
        ],
      },
      {
        id: "stripe-projects",
        name: "Stripe Projects",
        category: "infrastructure",
        description: "توفير الخدمات والبيانات السرية والفوترة والبنية التحتية الجاهزة للوكلاء عبر واجهة الأوامر.",
        sourceUrl: "https://projects.dev/",
        sourceLabel: "projects.dev",
        accent: "#635bff",
        monogram: "SP",
        updates: [
          {
            date: "2026-07-16",
            title: "مراقبة المصدر: من الخدمة إلى بيانات الدخول بأمر واحد",
            summary: "تركز الواجهة الحالية على أوامر init وcatalog وadd وupgrade مع مزامنة بيانات الدخول إلى البيئة المحلية.",
            sourceLabel: "projects.dev",
            sourceUrl: "https://projects.dev/",
            kind: "snapshot",
          },
        ],
      },
      {
        id: "agentic-commerce",
        name: "بروتوكول التجارة الوكيلة",
        category: "commerce",
        description: "بروتوكول مفتوح للدفع البرمجي الآمن بين المشترين والوكلاء والشركات.",
        sourceUrl: "https://www.agenticcommerce.dev/",
        sourceLabel: "agenticcommerce.dev",
        accent: "#0f766e",
        monogram: "AC",
        updates: [
          {
            date: "2026-07-16",
            title: "مراقبة المصدر: معيار مفتوح للدفع",
            summary: "يظل ACP متوافقاً مع REST وMCP، ويحافظ على الشركة كبائع رسمي، ويدعم السلع المادية والرقمية والاشتراكات والشراء غير المتزامن.",
            sourceLabel: "agenticcommerce.dev",
            sourceUrl: "https://www.agenticcommerce.dev/",
            kind: "snapshot",
          },
        ],
      },
    ],
  },
}
