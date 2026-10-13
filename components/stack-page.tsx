"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { StitchPublicHeader } from "@/components/stitch-public-header"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { GradeBar } from "@/components/grade-bar"
import { getStackLogo } from "@/lib/stack-logos"
import type { StackFamiliarity, SupportedLocale } from "@/types/database"
import type { PublicStackItem } from "@/lib/home/project-presentation"
import "@/styles/stack-tier.css"

type StackPageProps = {
  locale: SupportedLocale
  stackItems: PublicStackItem[]
  strings: {
    title: string; description: string; eyebrow: string; grade: string
    familiarity: string; reason: string; useCase: string; category: string
    usage: string; noProjects: string; empty: string; backToProjects: string
    stack: string; views: { cards: string; matrix: string }
    categories: { tool: string; ai_skill: string }
    familiarityLevels: Record<StackFamiliarity, string>
    nav: { progress: string; home: string }
  }
}

export function StackPage({ locale, stackItems, strings }: StackPageProps) {
  const ar = locale === "ar"
  const [category, setCategory] = useState("all")
  const [selected, setSelected] = useState<PublicStackItem | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const copy = ar ? {
    all: "الكل", tools: "الأدوات", skills: "مهارات الذكاء الاصطناعي", ungraded: "غير مقيّم",
    hint: "اختر أداة لمعرفة أين وكيف أستخدمها.", unrated: "لم تُقيّم الأدوات في هذا المستوى بعد.",
    close: "إغلاق", follow: "متابعات مميزة", skill: "مهارة مخصصة", details: "تفاصيل الأداة",
    ratings: "التقييمات من كتالوج الأدوات. الأدوات غير المقيّمة تظهر في صف مستقل.",
  } : {
    all: "All", tools: "Tools", skills: "AI skills", ungraded: "Ungraded",
    hint: "Select a tool to see where and how I use it.", unrated: "No tools rated in this tier yet.",
    close: "Close", follow: "Magic follow", skill: "Custom skill", details: "Tool details",
    ratings: "Ratings come from the Stack Catalog. Unrated tools live in their own row.",
  }
  const filtered = stackItems.filter((item) => category === "all" || item.category === category)
  const tiers = ["A", "B", "C", "D", "E", ...(stackItems.some((item) => item.grade === "F") ? ["F"] : []), "U"]
  const logo = selected ? getStackLogo(selected.name) : null

  return (
    <div className="claws-home stack-tier-page" data-theme="dark" dir={ar ? "rtl" : "ltr"}>
      <a className="claws-skip" href="#stack-board">{strings.stack}</a>
      <StitchPublicHeader locale={locale} />
      <main>
        <section className="stack-tier-intro">
          <div>
            <p className="claws-label">{strings.eyebrow}</p>
            <h1>{strings.title}</h1>
            <p className="stack-tier-description">{strings.description}</p>
          </div>
          <div className="stack-tier-total">
            <span>{stackItems.length}</span>
            <p className="claws-label">{copy.tools} / {copy.skills}</p>
          </div>
        </section>
        <section className="stack-tier-inventory" id="stack-board" aria-label={strings.stack}>
          <div className="stack-tier-toolbar">
            <div className="stack-tier-filters" role="group" aria-label={strings.category}>
              {[["all", copy.all], ["tool", copy.tools], ["ai_skill", copy.skills]].map(([value, label]) => (
                <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>
                  {label}<span>{value === "all" ? stackItems.length : stackItems.filter((item) => item.category === value).length}</span>
                </button>
              ))}
            </div>
            <p>{copy.hint}</p>
          </div>
          {filtered.length ? (
            <div className="stack-tier-board">
              {tiers.map((tier) => {
                const items = filtered.filter((item) => (item.grade ?? "U") === tier)
                return (
                  <section key={tier} className="stack-tier-row" data-tier={tier} data-empty={!items.length} aria-label={tier === "U" ? copy.ungraded : `${strings.grade} ${tier}`}>
                    <div className="stack-tier-rank">
                      <h2 dir="ltr">{tier === "U" ? "—" : tier}</h2>
                      <span>{items.length}</span>
                      {tier === "U" && <small>{copy.ungraded}</small>}
                    </div>
                    {items.length ? (
                      <div className="stack-tier-tiles">
                        {items.map((item) => {
                          const asset = getStackLogo(item.name)
                          return (
                            <button type="button" key={item.id} className="stack-tier-tile" aria-label={`${item.name} — ${copy.details}`} aria-haspopup="dialog" onClick={(event) => { triggerRef.current = event.currentTarget; setSelected(item) }}>
                              <span className="stack-tier-logo"><Image src={asset.src} alt="" width={64} height={64} unoptimized /></span>
                              <b dir="auto">{item.name}</b>
                              <span className="stack-tier-domain" dir={asset.domain ? "ltr" : undefined}>{asset.domain || copy.skill}</span>
                            </button>
                          )
                        })}
                      </div>
                    ) : <p className="stack-tier-empty">{copy.unrated}</p>}
                  </section>
                )
              })}
            </div>
          ) : <p className="stack-tier-empty">{strings.empty}</p>}
          <p className="stack-tier-note">{copy.ratings}</p>
        </section>
      </main>
      <footer className="stack-tier-footer">
        <Link href="/" className="claws-brand"><Image src="/10claws.svg" alt="" width={18} height={18} /><bdi>10 CLAWS</bdi></Link>
        <nav aria-label={ar ? "روابط التذييل" : "Footer"}>
          <Link href="/">{strings.nav.home}</Link>
          <Link href="/magic-follow">{copy.follow}</Link>
          <Link href="/track">{ar ? "التتبع" : "Track"}</Link>
        </nav>
      </footer>
      <Sheet open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null) }}>
        <SheetContent side={ar ? "left" : "right"} showCloseButton={false} className="claws-home stack-tier-detail" data-theme="dark" dir={ar ? "rtl" : "ltr"} onCloseAutoFocus={(event) => { event.preventDefault(); triggerRef.current?.focus() }}>
          {selected && logo && <>
            <div className="stack-tier-detail-top"><p className="claws-label">{copy.details}</p><SheetClose className="stack-tier-close">{copy.close} ×</SheetClose></div>
            <Image className="stack-tier-detail-logo" src={logo.src} alt="" width={72} height={72} unoptimized />
            <SheetTitle className="stack-tier-detail-title" dir="auto">{selected.name}</SheetTitle>
            <SheetDescription className="stack-tier-detail-description">{selected.reason || strings.categories[selected.category]}</SheetDescription>
            {selected.notes && <p className="stack-tier-detail-notes">{selected.notes}</p>}
            <dl className="stack-tier-facts">
              <div><dt>{strings.grade}</dt><dd><GradeBar grade={selected.grade} ar={ar} node /></dd></div>
              <div><dt>{strings.familiarity}</dt><dd>{selected.familiarity ? strings.familiarityLevels[selected.familiarity] : (ar ? "غير مسجّل" : "Not recorded")}</dd></div>
              <div><dt>{strings.usage}</dt><dd>{selected.usageCount}</dd></div>
            </dl>
            <p className="claws-label">{strings.backToProjects}</p>
            <div className="stack-tier-projects">
              {selected.projects.map((project) => <a key={project.id} href={project.url || `/${locale}#projects`} target={project.url ? "_blank" : undefined} rel={project.url ? "noreferrer" : undefined}>{project.title}<span aria-hidden="true">↗</span></a>)}
              {!selected.projects.length && <p>{strings.noProjects}</p>}
            </div>
            {logo.domain && <a className="stack-tier-visit" href={`https://${logo.domain}`} target="_blank" rel="noreferrer"><bdi>{logo.domain}</bdi><span aria-hidden="true">↗</span></a>}
          </>}
        </SheetContent>
      </Sheet>
    </div>
  )
}
