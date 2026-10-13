"use client"

import Image from "next/image"
import { getStackLogo } from "@/lib/stack-logos"
import type { StackGrade } from "@/types/database"

export type TierItem = { id: string; name: string; grade?: StackGrade; href?: string }

type TierBoardProps<T extends TierItem> = {
  items: T[]
  labels: { grade: string; ungraded: string; unrated: string; skill: string; details: string }
  onSelect?: (item: T, trigger: HTMLButtonElement) => void
}

export function TierBoard<T extends TierItem>({ items, labels, onSelect }: TierBoardProps<T>) {
  const tiers = ["S", "A", "B", "C", "D", "E", ...(items.some((item) => item.grade === "F") ? ["F"] : []), "U"]
  return <div className="stack-tier-board">
    {tiers.map((tier) => {
      const members = items.filter((item) => (item.grade ?? "U") === tier)
      return <section key={tier} className="stack-tier-row" data-tier={tier} data-empty={!members.length} aria-label={tier === "U" ? labels.ungraded : `${labels.grade} ${tier}`}>
        <div className="stack-tier-rank">
          <h2 dir="ltr">{tier === "U" ? "—" : tier}</h2>
          <span>{members.length}</span>
          {tier === "U" && <small>{labels.ungraded}</small>}
        </div>
        {members.length ? <div className="stack-tier-tiles">
          {members.map((item) => {
            const asset = getStackLogo(item.name)
            const content = <>
              <span className="stack-tier-logo" data-logo={asset.file}><Image src={asset.src} alt="" width={40} height={40} unoptimized /></span>
              <b dir="auto">{item.name}</b>
              <span className="stack-tier-domain" dir={asset.domain ? "ltr" : undefined}>{asset.domain || labels.skill}</span>
            </>
            return onSelect ? <button type="button" key={item.id} className="stack-tier-tile" aria-label={`${item.name} — ${labels.details}`} aria-haspopup="dialog" onClick={(event) => onSelect(item, event.currentTarget)}>{content}</button>
              : <a key={item.id} className="stack-tier-tile" href={item.href} target="_blank" rel="noreferrer">{content}</a>
          })}
        </div> : <p className="stack-tier-empty">{labels.unrated}</p>}
      </section>
    })}
  </div>
}
