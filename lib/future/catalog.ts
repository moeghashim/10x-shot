import { defineCatalog } from "@json-render/core"
import type { Spec } from "@json-render/core"
import { schema } from "@json-render/react/schema"
import { z } from "zod"

const linkProps = z.object({
  label: z.string(),
  href: z.enum(["/", "/progress", "/stack"]),
})

const signalProps = z.object({
  label: z.string(),
  value: z.string(),
  hint: z.string(),
})

export const futureCatalog = defineCatalog(schema, {
  components: {
    FuturePage: {
      props: z.object({}),
      slots: ["default"],
      description: "Root wrapper for the future page content.",
    },
    FutureHero: {
      props: z.object({
        eyebrow: z.string(),
        title: z.string(),
        description: z.string(),
        primaryCta: linkProps,
        secondaryCta: linkProps,
        statusLabel: z.string(),
        statusValue: z.string(),
      }),
      description: "Large page hero with status metadata and two calls to action.",
    },
    FutureSignals: {
      props: z.object({
        items: z.array(signalProps).min(1).max(4),
      }),
      description: "Compact signal row for the measures guiding future bets.",
    },
    FutureSection: {
      props: z.object({
        eyebrow: z.string(),
        title: z.string(),
        description: z.string(),
        tone: z.enum(["paper", "white", "ink"]),
      }),
      slots: ["default"],
      description: "Full-width section wrapper with a title and generated child modules.",
    },
    FutureBet: {
      props: z.object({
        label: z.string(),
        title: z.string(),
        horizonLabel: z.string(),
        horizon: z.string(),
        confidenceLabel: z.string(),
        confidence: z.string(),
        description: z.string(),
        proof: z.array(z.string()).min(1).max(4),
      }),
      description: "A strategic future bet with horizon, confidence, and evidence to watch.",
    },
    FutureTimeline: {
      props: z.object({
        items: z.array(
          z.object({
            date: z.string(),
            title: z.string(),
            description: z.string(),
          })
        ).min(1).max(6),
      }),
      description: "Timeline for planned experiments and decision points.",
    },
    FuturePrinciples: {
      props: z.object({
        items: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
          })
        ).min(1).max(6),
      }),
      description: "Operating principles for what 10 Claws will and will not build next.",
    },
    FutureCta: {
      props: z.object({
        eyebrow: z.string(),
        title: z.string(),
        description: z.string(),
        cta: linkProps,
      }),
      description: "Closing call to action for following the future work.",
    },
  },
  actions: {},
})

export type FutureSpec = Spec
