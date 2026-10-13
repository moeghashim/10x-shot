# Stack tier board design QA

Source: `/var/folders/7n/jwn8cbhx0cj313yjrqnsj7sw0000gn/T/codex-clipboard-6323d04f-9c54-41a3-a140-1fe19cbb15e3.png` (1542 × 1078).
Implementation: `http://localhost:4176/en/stack`, production Next.js build.

## Comparison scope

This is an inspired adaptation, rather than a copy of the reference's unrelated products or ratings. Preserve the supplied horizontal tier bands, narrow colored grade column, charcoal rows, logo/name/domain tiles, and wrapping grid. Retain 10 Claws fonts and shared navigation. Use actual A–F backend grades; never infer SS/S ratings. Empty tiers are intentionally shorter, and unrated tools occupy their own neutral row.

Desktop evidence: `docs/screenshots/stack-tier-desktop.png` (1542 × 1078 viewport), `stack-tier-full.png` (full page at the same width), and `stack-tier-details.png` (open details panel). Mobile: `stack-tier-mobile.png` and `stack-tier-ar-mobile.png`, 390 × 844. Arabic details: `stack-tier-ar-details.png`. Browser captures are at 1 pixel per CSS pixel. Reference and implementation were opened together in the same comparison input; mobile and detail captures were inspected separately because the source provides neither state.

## Review and fixes

- Typography: Bricolage headings/grades and JetBrains labels retain the site system. Name and domain hierarchy follows the reference; Arabic uses the existing Arabic fallback.
- Layout: 76px grade column, approximately 144px populated rows, 7px separation, 64px desktop logos, responsive two-column tile layout on mobile. Names wrap without truncation. Compact empty tiers and the existing page header are intentional adaptations.
- Colors: #111 outer background, #222 rows, colored A–E labels, neutral ungraded label, white ink and muted domains. Green five-segment grade bars remain in tool details.
- Assets: all 22 current entries have loaded local SVGs. Official/established marks and custom identifying symbols are documented in `docs/stack-logo-sources.md`. The unrelated Pi chatbot logo was replaced with a custom pi symbol for the coding agent.
- Copy/data: 22 entries, 14 tools, 8 skills; two A ratings, 20 ungraded. Counts derive from backend project assignments, including deduplication. Empty grades are explicitly described rather than filled with fabricated rankings.
- Interaction: category filters show matching entries; tiles open accessible details with grade, familiarity, notes, usage, project links, and domain link. Escape and Close dismiss the panel. Shared nav is consistent with the homepage; Magic follow remains footer-only.
- Accessibility finding P2: closing the programmatically opened details panel initially did not restore focus to its originating tile. Fixed by explicitly storing and restoring that tile on dialog close. Final verification below is required before passing.
- Capture note: the first Arabic panel image caught its slide-in animation and is superseded by the final stable capture.

## Final verification

Final production capture reviewed against the reference at 1542 × 1078. Stable Arabic details fill the 390px viewport without clipping. Escape and Close restore focus to the originating tile in both languages. All / Tools / AI skills show 22 / 14 / 8 tiles. No overflow at 1542px, 390px, or Arabic 320px. No browser console errors in the verified production session. All local SVGs load. `pnpm lint`, `pnpm typecheck`, `pnpm test` (38 passing), and `pnpm build` passed. No remaining P0/P1/P2 findings.

final result: passed
