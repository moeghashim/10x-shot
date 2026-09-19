# 10 Claws redesign QA

final result: passed

## Reference and evidence

Source: `/Users/moe/Downloads/10Claws design direction.zip`, specifically `10 Claws Redesign.dc.html`, rendered locally with its supplied `support.js`. The existing `public/10claws.svg` has identical path geometry to the supplied logo (only metadata differs).

Implementation: `http://localhost:4173/en` and `/ar`, served from the production build.

Portable review screenshots: [desktop](docs/screenshots/10claws-redesign-desktop.png) and [mobile dark mode](docs/screenshots/10claws-redesign-mobile-dark.png).

Screenshot directory: `/Users/moe/.codex/visualizations/2026/09/19/01a0b7f3-d188-75c3-a058-6be8d01cfe0c/10claws-redesign/`.

- `reference-desktop.png` + `implementation-desktop.png`: 1440 × 1000 CSS and image pixels, light, comfortable, Rabbit Brain spotlight. Both opened together in the same comparison call. Implementation uses an isolated temporary reference-data route for carousel verification; its computed tool count is 24 because the reference fixture combines tools and skills. Actual backend data produces the specified 15. The temporary route was removed before the final build.
- `reference-mobile.png` + `implementation-mobile.png`: 390 × 844 CSS and image pixels, light, comfortable, Bannaa spotlight, same scrolled hero state. Both opened together. Remaining ~4px vertical difference is minor divider/scroll-position rounding; no structural mismatch.
- `reference-stack.png` + `final-stack.png`: 1440 × 1000, desktop stack and newsletter. Opened together. The implementation offsets anchor scrolling below its sticky header, so its section begins 70px lower. Catalog content differs from the reference fixture as intended.
- `mobile-dark-footer.png`: 390 × 844, dark, compact, progress hidden, display settings expanded.
- `arabic-mobile-final.png`: 320 × 800 Arabic capture after the font fix. Final DOM measurements additionally verify all four nodes are 138.5 × 138.5px.
- `final-home.png`: final production build with current backend data and the empty spotlight state.

Screenshots are at 1 image pixel per CSS pixel; no density rescaling was required. Full-page stitched captures from the browser produced duplicate bands and were excluded from evidence. Viewport captures above are the reliable comparison inputs.

## Findings and fixes

1. **P2, fixed — headline font width:** Next's initial font import omitted Bricolage Grotesque's optical sizing axis. Enabled the variable `opsz` axis and recaptured desktop. The headline and spotlight now match the reference's font, weight, size, and proportions.
2. **P2, fixed — Arabic fallback and count:** Applied the existing Alexandria font directly to Arabic copy, and calculate tool totals from canonical English names so translated aliases cannot inflate the count. Verified English/Arabic totals of 10 / 2 / 15.
3. **P2, fixed — narrow nodes stretched:** Tightened mobile node padding/gaps, limited long titles to two lines with the full title available on hover, and restricted Arabic line-height overrides to Arabic headings. All four nodes measured exactly square at 320px.
4. **P2, fixed — planning URLs:** Preserved the previous “Soon” behavior for planning projects. Launch links normalize missing HTTPS schemes and reject unsafe schemes.

No actionable P0/P1/P2 visual findings remain.

## Fidelity surfaces

- **Typography:** Bricolage Grotesque with optical sizing, weights 400–600; JetBrains Mono 400/500; 13px body, 10–11px labels. Arabic uses the site's Alexandria font. Exact supplied headline and newsletter copy retained in English, translated in Arabic.
- **Spacing/layout:** 32px desktop / 20px mobile padding, 760px breakpoint, six-column ledger and mobile card areas, 24px/14px row padding, 1:2 stack columns, square nodes. The hero reserves both stats and spotlight tracks before hydration.
- **Colors/tokens:** Exact specified light/dark values; green confined to grade segments and growth. No rounded corners or shadows in the redesigned homepage.
- **Assets:** Original SVG paths retained; header 28px, footer 18px, dark inversion. No fabricated assets.
- **Content:** Live catalog names and grades are authoritative. Explicit “Ungraded” labels widen some tags compared with the HTML reference, as required by the written brief. No reference metrics were written to the database.

## Interaction and verification

- Stack selection switched to Deep Res's empty state and back to Bannaa's four nodes.
- Spotlight automatic rotation and manual buttons verified with the reference fixture, including 611 commits, 12.4k visits, and +38% growth. Pause control and focus/hover suspension are included; reduced motion disables autoplay and transition/count animation in code/CSS. Reduced-motion OS emulation was not available in this browser session, so that branch was reviewed rather than claimed as browser-tested.
- Initial mobile ledger position was 734.09375px before counting and remained 734.09375px after the reveal. A second check at a scrolled position was also identical before/after (-3742.90625px).
- Theme changed to computed `rgb(10, 10, 10)`, compact row padding to `14px`, and progressbar count to zero when disabled.
- Native email validation rejected malformed input. A valid example address navigated to the existing Substack subscribe page. An independent read of the destination HTML verified its email-prefill support. No subscription was completed.
- English and Arabic checked at mobile and desktop widths. Arabic verified at 320px and the 760px breakpoint with document width equal to viewport width. Desktop verified at 1440px. Browser console reported no errors on the final homepage.
- `pnpm lint`: passed, no warnings.
- `pnpm exec tsc --noEmit`: passed independently of Next's disabled build checks.
- `pnpm build`: passed after removing the temporary fixture route.
- `node --test tests/home-redesign.test.mjs`: five tests passed (Node 25), covering eligibility/zero/missing metrics, ID-based catalog grades, grade segments, visit formatting, and safe launch URLs.
- `git diff --check`: passed.

## Release and data notes

This work changes the homepage; the other public route layouts remain in their existing design. Footer display settings expose theme, row density, and progress visibility for this page.

The optional project fields `sector`, `commits`, `visits`, and `growth` are wired through schema, validators, save/read mappings, API route, shared types, and admin editor. Commits and visits must be non-negative safe integers; growth must be finite. Zero metrics qualify, negative growth qualifies, and any missing field excludes the project from rotation. Clearing a field removes it from the spotlight. Existing catalog A–E grades are reused; legacy F remains supported with zero filled segments.

Production has not been deployed or modified. Before releasing the frontend, deploy the compatible Convex backend (`npx convex deploy`) and enter real spotlight metrics using the admin editor. No existing project qualifies yet, so the current preview correctly shows an empty spotlight. Authenticated backend persistence was not exercised against production.

## Follow-up polish

Long single-word tool names can wrap across two lines at the exact requested node sizes. Full names remain available in the title attribute. No release-blocking action remains in the local implementation.
