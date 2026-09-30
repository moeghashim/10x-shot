import type { SupportedLocale } from "@/types/database";

export type MagicFollowPerson = {
  name: string;
  handle: string;
  why: Record<SupportedLocale, string>;
};

// Curated by the site owner. Handles omit @; publish only approved entries.
export const magicFollowPeople: MagicFollowPerson[] = [];

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
