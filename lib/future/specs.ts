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
          eyebrow: "AI-authored roadmap / Human-operated proof",
          title: "Future",
          description:
            "This page is generated from a constrained json-render spec. The AI can choose the shape and content, but the site controls the components, data boundaries, and public contract.",
          primaryCta: { label: "View progress", href: "/progress" },
          secondaryCta: { label: "Explore stack", href: "/stack" },
          statusLabel: "Generation mode",
          statusValue: "Approved spec",
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
              label: "Primary question",
              value: "Can AI compound operations?",
              hint: "The page tracks future bets that must become measurable work.",
            },
            {
              label: "Public standard",
              value: "Proof over pitch",
              hint: "Claims should resolve into metrics, launches, or rejected assumptions.",
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
            "The next phase is not about adding more tools. It is about finding which AI workflows survive contact with real customers, revenue, and operating pressure.",
          tone: "white",
        },
        children: ["bet-1", "bet-2", "bet-3"],
      },
      "bet-1": {
        type: "FutureBet",
        props: {
          label: "Bet 01",
          title: "Agent-managed launch loops",
          horizonLabel: "Horizon",
          horizon: "Next 90 days",
          confidenceLabel: "Confidence",
          confidence: "Medium",
          description:
            "Codex should move from implementation assistant to launch operator: identify gaps, patch the product surface, verify the work, and prepare the release path.",
          proof: [
            "Shorter time from idea to public page",
            "Fewer manual release checklists",
            "More fixes discovered through browser verification before deploy",
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
            "The strongest view is not one project at a time. The system should compare projects, surface stalled bets, and show where AI leverage is actually compounding.",
          proof: [
            "Project filters produce sharper decisions",
            "Global sales projections stay separate from public real metrics",
            "Roadmap cards connect directly to measurable project outcomes",
          ],
        },
      },
      "bet-3": {
        type: "FutureBet",
        props: {
          label: "Bet 03",
          title: "Generated interfaces need editorial gates",
          horizonLabel: "Horizon",
          horizon: "Ongoing",
          confidenceLabel: "Confidence",
          confidence: "High",
          description:
            "AI-generated UI is useful when the catalog is narrow and the output is reviewed. The future page should prove that generated structure can still feel intentional.",
          proof: [
            "The renderer accepts only 10 Claws components",
            "The public page uses a checked-in spec",
            "Admin generation can come later as a preview-and-approve workflow",
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
              title: "Ship the generated page",
              description: "Use json-render for a real public route without putting live AI output in the request path.",
            },
            {
              date: "Next",
              title: "Connect future bets to progress metrics",
              description: "Turn the strongest bets into measurable cards on the public progress board and admin roadmap.",
            },
            {
              date: "Later",
              title: "Add admin generation",
              description: "Let an admin ask Codex for a new future spec, preview it, approve it, and publish the stable version.",
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
            "The page is allowed to be generated, but the brand, routing, security posture, and public data rules stay owned by the app.",
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
          title: "The future page is a promise to measure.",
          description:
            "The useful version of this page is not the copy. It is the loop: generate an opinion, constrain it, ship it, then compare it against what actually happened.",
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
          eyebrow: "خارطة طريق يكتبها الذكاء الاصطناعي / إثبات يديره الإنسان",
          title: "المستقبل",
          description:
            "هذه الصفحة مولدة من مواصفة json-render مقيّدة. يستطيع الذكاء الاصطناعي اختيار الشكل والمحتوى، بينما يتحكم الموقع بالمكونات وحدود البيانات والعقد العام.",
          primaryCta: { label: "شاهد التقدم", href: "/progress" },
          secondaryCta: { label: "استكشف التقنيات", href: "/stack" },
          statusLabel: "وضع التوليد",
          statusValue: "مواصفة معتمدة",
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
              label: "السؤال الرئيسي",
              value: "هل تتراكم العمليات بالذكاء الاصطناعي؟",
              hint: "تتابع الصفحة رهانات مستقبلية يجب أن تتحول إلى عمل قابل للقياس.",
            },
            {
              label: "المعيار العام",
              value: "الإثبات قبل العرض",
              hint: "يجب أن تتحول الادعاءات إلى مقاييس أو إطلاقات أو افتراضات مرفوضة.",
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
            "المرحلة التالية لا تعني إضافة أدوات أكثر. الهدف هو معرفة أي سير عمل بالذكاء الاصطناعي يصمد أمام العملاء والإيراد وضغط التشغيل.",
          tone: "white",
        },
        children: ["bet-1", "bet-2", "bet-3"],
      },
      "bet-1": {
        type: "FutureBet",
        props: {
          label: "رهان 01",
          title: "حلقات إطلاق يديرها الوكلاء",
          horizonLabel: "الأفق",
          horizon: "خلال 90 يوماً",
          confidenceLabel: "الثقة",
          confidence: "متوسط",
          description:
            "يجب أن ينتقل Codex من مساعد تنفيذ إلى مشغّل إطلاق: يحدد الفجوات، يصلح سطح المنتج، يتحقق من العمل، ويجهز مسار الإصدار.",
          proof: [
            "وقت أقصر من الفكرة إلى الصفحة العامة",
            "قوائم إصدار يدوية أقل",
            "اكتشاف أعطال أكثر عبر التحقق في المتصفح قبل النشر",
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
            "أقوى عرض ليس مشروعاً واحداً في كل مرة. يجب أن يقارن النظام المشاريع، ويظهر الرهانات المتوقفة، ويوضح أين تتراكم رافعة الذكاء الاصطناعي فعلاً.",
          proof: [
            "فلاتر المشاريع تقود قرارات أوضح",
            "توقعات المبيعات العامة تبقى منفصلة عن المقاييس الحقيقية المنشورة",
            "بطاقات خارطة الطريق ترتبط بنتائج مشاريع قابلة للقياس",
          ],
        },
      },
      "bet-3": {
        type: "FutureBet",
        props: {
          label: "رهان 03",
          title: "الواجهات المولدة تحتاج بوابات تحريرية",
          horizonLabel: "الأفق",
          horizon: "مستمر",
          confidenceLabel: "الثقة",
          confidence: "عال",
          description:
            "الواجهة المولدة بالذكاء الاصطناعي مفيدة عندما يكون الكتالوج ضيقاً والمخرج مراجعاً. يجب أن تثبت صفحة المستقبل أن البنية المولدة يمكن أن تبقى مقصودة.",
          proof: [
            "العارض يقبل مكونات 10 Claws فقط",
            "الصفحة العامة تستخدم مواصفة محفوظة في الكود",
            "يمكن إضافة توليد إداري لاحقاً عبر معاينة واعتماد",
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
              title: "شحن الصفحة المولدة",
              description: "استخدام json-render لمسار عام حقيقي من دون وضع مخرجات ذكاء اصطناعي مباشرة في مسار الطلب.",
            },
            {
              date: "التالي",
              title: "ربط الرهانات المستقبلية بمقاييس التقدم",
              description: "تحويل أقوى الرهانات إلى بطاقات قابلة للقياس في لوحة التقدم العامة وخارطة الطريق الإدارية.",
            },
            {
              date: "لاحقاً",
              title: "إضافة التوليد الإداري",
              description: "تمكين المدير من طلب مواصفة مستقبلية جديدة من Codex ومعاينتها واعتمادها ثم نشر النسخة المستقرة.",
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
          title: "صفحة المستقبل وعد بالقياس.",
          description:
            "النسخة المفيدة من هذه الصفحة ليست النص. إنها الحلقة: توليد رأي، تقييده، شحنه، ثم مقارنته بما حدث فعلاً.",
          cta: { label: "اقرأ سجل التقدم", href: "/progress" },
        },
      },
    },
  },
}
