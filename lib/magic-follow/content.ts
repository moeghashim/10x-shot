import type { SupportedLocale } from "@/types/database";

export type MagicFollowPerson = {
  name: string;
  handle: string;
  why: Record<SupportedLocale, string>;
};

// Curated by the site owner. Handles omit @; publish only approved entries.
export const magicFollowPeople: MagicFollowPerson[] = [
  {
    name: "Potato",
    handle: "Potato",
    why: {
      en: "For her open-source pstack and the technical knowledge she shares.",
      ar: "من أجل مشروعها المفتوح المصدر pstack والمعرفة التقنية التي تشاركها.",
    },
  },
  {
    name: "Matt Pocock",
    handle: "mattpocockuk",
    why: {
      en: "For his open-source agent skills and tutorials.",
      ar: "من أجل مهاراته المفتوحة المصدر لوكلاء الذكاء الاصطناعي ودروسه التعليمية.",
    },
  },
  {
    name: "Ian Nuttall",
    handle: "iannuttall",
    why: {
      en: "Great technical and SEO tips.",
      ar: "نصائح ممتازة في التقنية وتحسين الظهور في محركات البحث.",
    },
  },
  {
    name: "Kun Chen",
    handle: "kunchenguid",
    why: {
      en: "Great agent setups. Check out his no-mistakes and Firstmate projects.",
      ar: "إعدادات ممتازة لوكلاء الذكاء الاصطناعي. ألقِ نظرة على مشروعيه no-mistakes وFirstmate.",
    },
  },
  {
    name: "Mario Zechner",
    handle: "badlogicgames",
    why: {
      en: "Creator of Pi. That is enough. Just listen to him. Straight to the point, and I still struggle to get his sense of humor :P",
      ar: "صانع Pi. وهذا يكفي. فقط استمع إليه. يدخل في الموضوع مباشرة، وما زلت أعاني لفهم حسّه الفكاهي :P",
    },
  },
  {
    name: "Ahmad Osman",
    handle: "TheAhmadOsman",
    why: {
      en: "A must-follow to learn about the world of open models. أجدع ناس",
      ar: "لازم تتابعه لتتعرف على عالم النماذج المفتوحة. أجدع ناس",
    },
  },
  {
    name: "Steve Sewell",
    handle: "Steve8708",
    why: {
      en: "Building the excellent open-source Agent-Native project. His videos are a must-watch. No crap.",
      ar: "يبني مشروع Agent-Native المفتوح المصدر والمميز. فيديوهاته تستحق المشاهدة. بلا كلام فارغ.",
    },
  },
  {
    name: "Dan McAteer",
    handle: "daniel_mac8",
    why: {
      en: "Great tips on model optimization.",
      ar: "نصائح ممتازة لتحسين أداء النماذج.",
    },
  },
  {
    name: "Trevin Chow",
    handle: "trevin",
    why: {
      en: "For his open-source Compound Engineering work and tips on models.",
      ar: "من أجل عمله المفتوح المصدر في Compound Engineering ونصائحه حول النماذج.",
    },
  },
  {
    name: "Kieran Klaassen",
    handle: "kieranklaassen",
    why: {
      en: "The Compound Engineering co-pilot.",
      ar: "رفيق الرحلة في Compound Engineering.",
    },
  },
  {
    name: "Quinn Slack",
    handle: "sqs",
    why: {
      en: "Amp CEO, which is enough. Read what he publishes. He's six months ahead of us.",
      ar: "الرئيس التنفيذي لـ Amp، وهذا يكفي. اقرأ ما ينشره؛ فهو يسبقنا بستة أشهر.",
    },
  },
];

export const magicFollowContent = {
  en: {
    title: "Magic follow | 10 Claws",
    description: "People worth following on X, and why their work is worth your attention.",
    kicker: "People to follow on X",
    intro: "Good people. Useful ideas. A personal list of voices worth following, and why.",
    name: "Name", handle: "X handle", why: "Why follow them",
    emptyTitle: "The list is taking shape.",
    emptyBody: "People and reasons to follow them will appear here soon.",
    profile: "View profile on X",
  },
  ar: {
    title: "Magic follow | 10 Claws",
    description: "أشخاص يستحقون المتابعة على X، والأسباب التي تجعل أفكارهم جديرة بالاهتمام.",
    kicker: "أشخاص يستحقون المتابعة على X",
    intro: "أشخاص مميزون وأفكار مفيدة. قائمة شخصية بأصوات تستحق المتابعة، ولماذا.",
    name: "الاسم", handle: "المعرّف على X", why: "لماذا تتابعهم",
    emptyTitle: "القائمة قيد الإعداد.",
    emptyBody: "ستظهر هنا قريباً أسماء الأشخاص وأسباب متابعتهم.",
    profile: "عرض الملف الشخصي على X",
  },
};
