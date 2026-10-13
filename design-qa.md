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

Initial version result: passed

## Light-background revision (user review)

The user requested the original light site background with smaller logos, while retaining the colored tier labels. This instruction supersedes the reference image's charcoal surfaces and 64px logos. Page, header, tier rows, footer, and details now use the shared white background, #0A0A0A ink, #6B6B6B muted text, and #E2E2E2 hairlines. Logo sizes are 40px desktop, 32px mobile, and 48px in details. Monochrome SVGs use dark ink; custom icons use stronger colors for visibility on white.

Evidence: `docs/screenshots/stack-tier-light-preview.png` (full page in the default 774px-wide browser), `stack-tier-light-desktop.png` (1542 × 1078), `stack-tier-light-mobile.png`, `stack-tier-light-ar-mobile.png`, and `stack-tier-light-ar-details.png` (390 × 844). Source and desktop revision were compared together, with the explicit light-background override. Colored grade labels and tile hierarchy remain aligned to the reference. Arabic and English mobile have no horizontal overflow; all current SVGs load; details use white surfaces without clipping. `pnpm lint`, `pnpm typecheck`, and `pnpm build` pass. No additional tests needed for these visual-only changes.

Review state: local preview is running; this revision is uncommitted and unpushed at the user's request.

final result: passed

## Assistants, project filters, and Track fonts

The latest user instructions add S above A, an Assistants page with six supplied assistants, a project filter on Stack, a slightly smaller Stripe Projects mark, and Track's fonts across the public site. Space Grotesk now handles headings and numbers, Geist Sans body text, and Geist Mono labels; Arabic retains Alexandria. Stripe is 32px versus 40px desktop and 26px versus 32px mobile. Assistant ratings are unassigned rather than inferred.

Evidence: `docs/screenshots/assistants-desktop.png`, `stack-project-filter.png`, `track-font-reference.png`, `home-track-fonts.png`, `assistants-ar-mobile.png`, and `stack-filter-ar-mobile.png`. The reference and the desktop tier pages were inspected together. English and Arabic mobile layouts fit 390px without horizontal overflow. Arabic viewport screenshots replace full-page captures affected by an RTL capture offset. Browser-computed homepage fonts match Track, and the final homepage image shows completed counters.

Project filtering uses actual tool assignments: 10 Signals shows Stripe Projects, ChatGPT, and Trigger.dev; Bannaa shows Stripe Projects and ChatGPT. Category filters intersect the selected project and display a clear message when empty. Clearing filters restores all 22 entries. Details close with focus restored to the originating tile. All six assistant links and local SVGs were verified. S appears before A on both boards; S validator changes have not been deployed to Convex.

`pnpm lint`, `pnpm typecheck`, `pnpm test` (40 passing), `pnpm build`, and `git diff --check` passed. No remaining P0/P1/P2 findings. Local production preview runs on port 4176; changes remain uncommitted and unpushed pending user review.

final result: passed
