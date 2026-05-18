"use client"

import { ActionProvider, defineRegistry, Renderer, StateProvider, VisibilityProvider } from "@json-render/react"
import { ArrowUpRight, CheckCircle2, GitBranch, Radar, Sparkles, Telescope } from "lucide-react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { futureCatalog, type FutureSpec } from "@/lib/future/catalog"

const { registry } = defineRegistry(futureCatalog, {
  components: {
    FuturePage: ({ children }) => <div className="bg-[#f7f5f1] text-black">{children}</div>,
    FutureHero: ({ props }) => (
      <section className="overflow-hidden border-b border-black/15 bg-[#f7f5f1]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-4xl">
            <div className="mb-8 flex items-center gap-3">
              <span className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">
                {props.eyebrow}
              </span>
              <span className="h-px flex-1 bg-black/15" />
            </div>
            <h1 className="stitch-display text-[clamp(3.8rem,13vw,8.5rem)] font-semibold uppercase leading-[0.86] tracking-[-0.11em] text-black">
              {props.title}
            </h1>
            <p className="mt-8 max-w-3xl text-base leading-7 text-black/68 md:text-lg">
              {props.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={props.primaryCta.href}
                className="stitch-mono inline-flex h-12 items-center justify-center gap-2 bg-black px-5 text-[10px] uppercase tracking-[0.28em] text-white transition-transform hover:-translate-y-0.5"
              >
                {props.primaryCta.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={props.secondaryCta.href}
                className="stitch-mono inline-flex h-12 items-center justify-center gap-2 border border-black/15 bg-white px-5 text-[10px] uppercase tracking-[0.28em] text-black transition-colors hover:border-black"
              >
                {props.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="border border-black/15 bg-white p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-black/10 pb-5">
              <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">
                {props.statusLabel}
              </p>
              <Sparkles className="h-4 w-4 text-cyan-700" />
            </div>
            <p className="stitch-display mt-6 text-4xl font-semibold uppercase leading-none tracking-[-0.08em]">
              {props.statusValue}
            </p>
            <div className="mt-6 grid grid-cols-3 border border-black/15">
              {["catalog", "spec", "render"].map((item) => (
                <div key={item} className="border-r border-black/15 px-3 py-4 last:border-r-0">
                  <p className="stitch-mono text-[9px] uppercase tracking-[0.24em] text-black/45">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
    FutureSignals: ({ props }) => (
      <section className="border-b border-black/15 bg-white">
        <div className="mx-auto grid max-w-7xl gap-px border-x border-black/15 bg-black/15 md:grid-cols-3">
          {props.items.map((item) => (
            <article key={item.label} className="min-h-48 bg-white p-6 md:p-8">
              <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">{item.label}</p>
              <h2 className="stitch-display mt-4 text-2xl font-semibold uppercase leading-tight tracking-[-0.08em] md:text-3xl">
                {item.value}
              </h2>
              <p className="mt-4 text-sm leading-6 text-black/62">{item.hint}</p>
            </article>
          ))}
        </div>
      </section>
    ),
    FutureSection: ({ props, children }) => (
      <section
        className={cn(
          "border-b border-black/15",
          props.tone === "paper" && "bg-[#f7f5f1]",
          props.tone === "white" && "bg-white",
          props.tone === "ink" && "bg-black text-white"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div>
              <p
                className={cn(
                  "stitch-mono text-[10px] uppercase tracking-[0.35em]",
                  props.tone === "ink" ? "text-white/50" : "text-black/55"
                )}
              >
                {props.eyebrow}
              </p>
              <h2 className="stitch-display mt-5 text-[clamp(2.6rem,7vw,5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.1em]">
                {props.title}
              </h2>
              <p className={cn("mt-6 text-sm leading-7 md:text-base", props.tone === "ink" ? "text-white/64" : "text-black/64")}>
                {props.description}
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">{children}</div>
          </div>
        </div>
      </section>
    ),
    FutureBet: ({ props }) => (
      <article className="flex min-h-[420px] flex-col border border-black/15 bg-[#f7f5f1] p-6 text-black md:p-7">
        <div className="flex items-start justify-between gap-4">
          <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">{props.label}</p>
          <Telescope className="h-5 w-5 text-emerald-700" />
        </div>
        <h3 className="stitch-display mt-7 text-3xl font-semibold uppercase leading-none tracking-[-0.08em]">
          {props.title}
        </h3>
        <p className="mt-5 text-sm leading-7 text-black/66">{props.description}</p>
        <div className="mt-6 grid grid-cols-2 gap-px bg-black/15">
          <div className="bg-white p-3">
            <p className="stitch-mono text-[9px] uppercase tracking-[0.24em] text-black/45">{props.horizonLabel}</p>
            <p className="mt-2 text-sm font-medium">{props.horizon}</p>
          </div>
          <div className="bg-white p-3">
            <p className="stitch-mono text-[9px] uppercase tracking-[0.24em] text-black/45">{props.confidenceLabel}</p>
            <p className="mt-2 text-sm font-medium">{props.confidence}</p>
          </div>
        </div>
        <div className="mt-auto space-y-3 pt-6">
          {props.proof.map((item) => (
            <div key={item} className="flex gap-3 text-sm leading-6 text-black/70">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </article>
    ),
    FutureTimeline: ({ props }) => (
      <div className="lg:col-span-3">
        <div className="grid gap-px border border-black/15 bg-black/15 md:grid-cols-3">
          {props.items.map((item) => (
            <article key={`${item.date}-${item.title}`} className="bg-white p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-black/10 pb-5">
                <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">{item.date}</p>
                <GitBranch className="h-4 w-4 text-black/55" />
              </div>
              <h3 className="stitch-display mt-6 text-3xl font-semibold uppercase leading-none tracking-[-0.08em]">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-black/64">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    ),
    FuturePrinciples: ({ props }) => (
      <div className="grid gap-px bg-white/18 lg:col-span-3 md:grid-cols-2">
        {props.items.map((item) => (
          <article key={item.title} className="bg-black p-6 text-white md:p-8">
            <Radar className="h-5 w-5 text-cyan-300" />
            <h3 className="stitch-display mt-6 text-3xl font-semibold uppercase leading-none tracking-[-0.08em]">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/62">{item.description}</p>
          </article>
        ))}
      </div>
    ),
    FutureCta: ({ props }) => (
      <section className="bg-[#f7f5f1]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <div className="border border-black/15 bg-white p-6 md:p-10">
            <p className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">{props.eyebrow}</p>
            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
              <div>
                <h2 className="stitch-display text-[clamp(2.8rem,8vw,5.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.1em]">
                  {props.title}
                </h2>
                <p className="mt-6 max-w-3xl text-base leading-7 text-black/64">{props.description}</p>
              </div>
              <Link
                href={props.cta.href}
                className="stitch-mono inline-flex h-12 items-center justify-center gap-2 bg-black px-5 text-[10px] uppercase tracking-[0.28em] text-white transition-transform hover:-translate-y-0.5"
              >
                {props.cta.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    ),
  },
})

export function FutureJsonRenderer({ spec }: { spec: FutureSpec }) {
  return (
    <StateProvider initialState={spec.state ?? {}}>
      <ActionProvider handlers={{}}>
        <VisibilityProvider>
          <Renderer spec={spec} registry={registry} />
        </VisibilityProvider>
      </ActionProvider>
    </StateProvider>
  )
}
