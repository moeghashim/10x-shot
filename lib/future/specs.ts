import type { FutureSpec } from "@/lib/future/catalog"

export function normalizeFutureSpec(spec: FutureSpec): FutureSpec {
  return {
    ...spec,
    elements: Object.fromEntries(
      Object.entries(spec.elements).map(([key, element]) => [
        key,
        {
          children: [],
          visible: true,
          ...element,
        },
      ])
    ),
  }
}

export const futureSpecs: Record<"en" | "ar", FutureSpec> = {
  en: {
    root: "future-page",
    elements: {
      "future-page": {
        type: "FuturePage",
        props: {},
        children: ["hero", "signals", "bets-section", "timeline-section", "principles-section", "cta"],
      },
      hero: {
        type: "FutureHero",
        props: {
          eyebrow: "AI-authored page / Human-approved spec",
          title: "Future",
          description:
            "This page is generated from a constrained json-render spec. The AI can propose structure and copy, but the app enforces the component catalog, data boundaries, and public contract.",
          primaryCta: { label: "View progress", href: "/progress" },
          secondaryCta: { label: "Explore stack", href: "/stack" },
          statusLabel: "Generation mode",
          statusValue: "Checked-in & reviewed",
        },
      },
      signals: {
        type: "FutureSignals",
        props: {
          items: [
            {
              label: "Runtime rule",
              value: "No live public model call",
              hint: "Generated, reviewed, then shipped as a stable spec.",
            },
            {
              label: "Shipped surfaces",
              value: "Progress + roadmap cards + stack matrix",
              hint: "Future bets must map back to a public surface we can measure or ship.",
            },
            {
              label: "Public standard",
              value: "Proof over pitch",
              hint: "Claims should resolve into metrics, launches, or rejected assumptions.",
            },
            {
              label: "Data boundary",
              value: "Public metrics ≠ private projections",
              hint: "Forecasts can guide decisions, but public pages stay strict about what is real today.",
            },
          ],
        },
      },
      "bets-section": {
        type: "FutureSection",
        props: {
          eyebrow: "Future bets / What gets tested next",
          title: "Bets worth proving",
          description:
            "The next phase is not about adding more tools. It is about turning AI workflows into repeatable operations that survive real revenue, real users, and real operating pressure.",
          tone: "white",
        },
        children: ["bet-1", "bet-2", "bet-3"],
      },
      "bet-1": {
        type: "FutureBet",
        props: {
          label: "Bet 01",
          title: "Roadmap cards become execution loops",
          horizonLabel: "Horizon",
          horizon: "Next 30 days",
          confidenceLabel: "Confidence",
          confidence: "Medium",
          description:
            "Every planning card should be able to become a loop: spec → patch → verify → ship → measure. The bet is that tighter loops beat bigger plans.",
          proof: [
            "Roadmap cards link to shipped routes and measurable outcomes",
            "Validation becomes default: typecheck, lint, build, browser checks",
            "Fewer “done” cards without a public surface to inspect",
          ],
        },
      },
      "bet-2": {
        type: "FutureBet",
        props: {
          label: "Bet 02",
          title: "Portfolio intelligence beats isolated dashboards",
          horizonLabel: "Horizon",
          horizon: "Next 6 months",
          confidenceLabel: "Confidence",
          confidence: "High",
          description:
            "The strongest view is not one project at a time. The system should compare projects, surface stalled bets, and show where leverage is compounding across the portfolio.",
          proof: [
            "Project filters produce sharper decisions",
            "Stack items stay linked to projects, usage, and reasons",
            "Projections stay private while public pages stay factual",
          ],
        },
      },
      "bet-3": {
        type: "FutureBet",
        props: {
          label: "Bet 03",
          title: "Generated pages need editorial + automation gates",
          horizonLabel: "Horizon",
          horizon: "Ongoing",
          confidenceLabel: "Confidence",
          confidence: "High",
          description:
            "AI-generated UI is useful when the catalog is narrow and the output is reviewed. The bet is that a monthly refresh loop keeps the page honest without putting generation into runtime.",
          proof: [
            "The renderer accepts only 10 Claws components",
            "The public page ships a checked-in spec (English + Arabic)",
            "Draft updates happen on a branch with validation notes",
          ],
        },
      },
      "timeline-section": {
        type: "FutureSection",
        props: {
          eyebrow: "Experiment cadence / Decision points",
          title: "How the future becomes real",
          description:
            "Every future claim needs a date, a surface, and a way to decide whether it stays in the system.",
          tone: "paper",
        },
        children: ["timeline"],
      },
      timeline: {
        type: "FutureTimeline",
        props: {
          items: [
            {
              date: "Now",
              title: "Keep the public surfaces current",
              description: "Progress, roadmap cards, and the stack view should stay accurate and easy to inspect.",
            },
            {
              date: "Next",
              title: "Refresh the future spec monthly",
              description: "Review recent commits, update the spec, run validations, and ship as a stable public contract.",
            },
            {
              date: "Later",
              title: "Add an admin preview-and-approve workflow",
              description: "Generate a draft spec, preview it, approve it, then publish the checked-in version (no runtime generation).",
            },
          ],
        },
      },
      "principles-section": {
        type: "FutureSection",
        props: {
          eyebrow: "Operating rules / What the AI should respect",
          title: "The constraints matter",
          description:
            "The page is allowed to be AI-authored, but the brand, routing, security posture, and public data rules stay owned by the app.",
          tone: "ink",
        },
        children: ["principles"],
      },
      principles: {
        type: "FuturePrinciples",
        props: {
          items: [
            {
              title: "Generate structure, not authority",
              description: "The model can propose sections and copy, but production content is still reviewed and versioned.",
            },
            {
              title: "Keep projections out of public truth",
              description: "Admin forecasts can guide decisions, while public pages should keep real metrics clearly separated.",
            },
            {
              title: "Keep locales aligned",
              description: "English and Arabic specs ship together so the public contract stays consistent.",
            },
            {
              title: "Prefer narrow catalogs",
              description: "A smaller set of components produces a page that feels designed instead of assembled from random parts.",
            },
            {
              title: "Make every claim inspectable",
              description: "Future bets should point back to progress, stack decisions, experiments, or explicit things not being built yet.",
            },
          ],
        },
      },
      cta: {
        type: "FutureCta",
        props: {
          eyebrow: "Next checkpoint / Follow the proof",
          title: "The future page is a promise to verify.",
          description:
            "The useful version of this page is not the copy. It is the loop: propose a bet, constrain it, ship it, then compare it against what actually happened.",
          cta: { label: "Read the progress ledger", href: "/progress" },
        },
      },
    },
  },
  ar: {
    root: "future-page",
    elements: {
      "future-page": {
        type: "FuturePage",
        props: {},
        children: ["hero", "signals", "bets-section", "timeline-section", "principles-section", "cta"],
      },
      hero: {
        type: "FutureHero",
        props: {
          eyebrow: "صفحة يكتبها الذكاء الاصطناعي / مواصفة يعتمدها الإنسان",
          title: "المستقبل",
          description:
            "هذه الصفحة مولدة من مواصفة json-render مقيّدة. يمكن للذكاء الاصطناعي اقتراح البنية والنص، بينما يفرض التطبيق كتالوج المكونات وحدود البيانات والعقد العام.",
          primaryCta: { label: "شاهد التقدم", href: "/progress" },
          secondaryCta: { label: "استكشف التقنيات", href: "/stack" },
          statusLabel: "وضع التوليد",
          statusValue: "مواصفة محفوظة ومراجَعة",
        },
      },
      signals: {
        type: "FutureSignals",
        props: {
          items: [
            {
              label: "قاعدة التشغيل",
              value: "لا استدعاء نموذج مباشر للعامة",
              hint: "يتم التوليد والمراجعة ثم الشحن كمواصفة مستقرة.",
            },
            {
              label: "أسطح تم شحنها",
              value: "التقدم + بطاقات خارطة الطريق + مصفوفة التقنيات",
              hint: "يجب أن تعود الرهانات المستقبلية إلى سطح عام يمكن قياسه أو شحنه.",
            },
            {
              label: "المعيار العام",
              value: "الإثبات قبل العرض",
              hint: "يجب أن تتحول الادعاءات إلى مقاييس أو إطلاقات أو افتراضات مرفوضة.",
            },
            {
              label: "حدود البيانات",
              value: "المقاييس العامة ≠ التوقعات الخاصة",
              hint: "يمكن للتوقعات أن تقود القرار، بينما تبقى الصفحات العامة صارمة فيما هو حقيقي اليوم.",
            },
          ],
        },
      },
      "bets-section": {
        type: "FutureSection",
        props: {
          eyebrow: "رهانات مستقبلية / ما الذي سنختبره لاحقاً",
          title: "رهانات تستحق الإثبات",
          description:
            "المرحلة التالية لا تعني إضافة أدوات أكثر. الهدف هو تحويل سير العمل بالذكاء الاصطناعي إلى عمليات قابلة للتكرار تصمد أمام إيراد حقيقي ومستخدمين حقيقيين وضغط تشغيل حقيقي.",
          tone: "white",
        },
        children: ["bet-1", "bet-2", "bet-3"],
      },
      "bet-1": {
        type: "FutureBet",
        props: {
          label: "رهان 01",
          title: "بطاقات خارطة الطريق تصبح حلقات تنفيذ",
          horizonLabel: "الأفق",
          horizon: "خلال 30 يوماً",
          confidenceLabel: "الثقة",
          confidence: "متوسط",
          description:
            "يجب أن تتحول كل بطاقة تخطيط إلى حلقة: مواصفة → إصلاح → تحقق → شحن → قياس. الرهان أن الحلقات الأقصر تتفوق على الخطط الأكبر.",
          proof: [
            "بطاقات خارطة الطريق ترتبط بمسارات مشحونة ونتائج قابلة للقياس",
            "التحقق يصبح افتراضياً: فحص الأنواع، lint، build، واختبار المتصفح",
            "عدد أقل من البطاقات «المكتملة» بلا سطح عام يمكن فحصه",
          ],
        },
      },
      "bet-2": {
        type: "FutureBet",
        props: {
          label: "رهان 02",
          title: "ذكاء المحفظة يتفوق على اللوحات المعزولة",
          horizonLabel: "الأفق",
          horizon: "خلال 6 أشهر",
          confidenceLabel: "الثقة",
          confidence: "عال",
          description:
            "أقوى عرض ليس مشروعاً واحداً في كل مرة. يجب أن يقارن النظام المشاريع، ويظهر الرهانات المتوقفة، ويوضح أين تتراكم الرافعة عبر المحفظة.",
          proof: [
            "فلاتر المشاريع تقود قرارات أوضح",
            "عناصر التقنية تبقى مرتبطة بالمشاريع والاستخدام وأسباب الاختيار",
            "التوقعات تبقى خاصة بينما تبقى الصفحات العامة واقعية",
          ],
        },
      },
      "bet-3": {
        type: "FutureBet",
        props: {
          label: "رهان 03",
          title: "الصفحات المولدة تحتاج بوابات تحرير + أتمتة",
          horizonLabel: "الأفق",
          horizon: "مستمر",
          confidenceLabel: "الثقة",
          confidence: "عال",
          description:
            "الواجهة المولدة بالذكاء الاصطناعي مفيدة عندما يكون الكتالوج ضيقاً والمخرج مراجعاً. الرهان أن تحديثاً شهرياً يحافظ على صدق الصفحة من دون وضع التوليد في وقت التشغيل.",
          proof: [
            "العارض يقبل مكونات 10 Claws فقط",
            "الصفحة العامة تشحن مواصفة محفوظة في الكود (إنجليزي + عربي)",
            "التحديثات تتم عبر فرع مع ملاحظات تحقق واضحة",
          ],
        },
      },
      "timeline-section": {
        type: "FutureSection",
        props: {
          eyebrow: "إيقاع التجارب / نقاط القرار",
          title: "كيف يصبح المستقبل حقيقياً",
          description: "كل ادعاء مستقبلي يحتاج تاريخاً وسطحاً وطريقة لتقرير هل يبقى داخل النظام.",
          tone: "paper",
        },
        children: ["timeline"],
      },
      timeline: {
        type: "FutureTimeline",
        props: {
          items: [
            {
              date: "الآن",
              title: "إبقاء الأسطح العامة محدثة",
              description: "التقدم وبطاقات خارطة الطريق وعرض التقنيات يجب أن تبقى دقيقة وسهلة الفحص.",
            },
            {
              date: "التالي",
              title: "تحديث مواصفة المستقبل شهرياً",
              description: "مراجعة آخر التغييرات، تحديث المواصفة، تشغيل التحقق، ثم شحنها كعقد عام مستقر.",
            },
            {
              date: "لاحقاً",
              title: "إضافة سير عمل معاينة واعتماد للإدارة",
              description: "توليد مسودة، معاينتها، اعتمادها، ثم نشر النسخة المحفوظة في الكود (من دون توليد وقت التشغيل).",
            },
          ],
        },
      },
      "principles-section": {
        type: "FutureSection",
        props: {
          eyebrow: "قواعد التشغيل / ما يجب أن يحترمه الذكاء الاصطناعي",
          title: "القيود مهمة",
          description:
            "يمكن للصفحة أن تكون مولدة، لكن الهوية والتوجيه والأمان وقواعد البيانات العامة تبقى مملوكة للتطبيق.",
          tone: "ink",
        },
        children: ["principles"],
      },
      principles: {
        type: "FuturePrinciples",
        props: {
          items: [
            {
              title: "ولّد البنية لا السلطة",
              description: "يمكن للنموذج اقتراح الأقسام والنص، لكن محتوى الإنتاج يبقى مراجعاً ومحفوظ النسخ.",
            },
            {
              title: "أبعد التوقعات عن الحقيقة العامة",
              description: "يمكن لتوقعات الإدارة أن تقود القرارات، بينما تبقى الصفحات العامة واضحة في فصل المقاييس الحقيقية.",
            },
            {
              title: "حافظ على اتساق اللغات",
              description: "يجب أن تُشحن مواصفات الإنجليزي والعربي معاً حتى يبقى العقد العام متسقاً.",
            },
            {
              title: "فضّل الكتالوجات الضيقة",
              description: "مجموعة مكونات أصغر تنتج صفحة تبدو مصممة لا مركبة من أجزاء عشوائية.",
            },
            {
              title: "اجعل كل ادعاء قابلاً للفحص",
              description: "يجب أن تعود الرهانات المستقبلية إلى التقدم أو قرارات التقنية أو التجارب أو الأشياء التي لن نبنيها بعد.",
            },
          ],
        },
      },
      cta: {
        type: "FutureCta",
        props: {
          eyebrow: "نقطة التحقق التالية / تابع الإثبات",
          title: "صفحة المستقبل وعد بالتحقق.",
          description:
            "النسخة المفيدة من هذه الصفحة ليست النص. إنها الحلقة: اقتراح رهان، تقييده، شحنه، ثم مقارنته بما حدث فعلاً.",
          cta: { label: "اقرأ سجل التقدم", href: "/progress" },
        },
      },
    },
  },
}
