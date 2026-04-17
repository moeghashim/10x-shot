## Overview
10 Claws is a bilingual public-facing AI experiment site with an editorial dashboard aesthetic. The visual direction is monochrome-first and paper-like: warm off-white backgrounds, sharp black rules, oversized uppercase headlines, and dense metric panels that feel like a live operating ledger instead of a glossy SaaS app. The interface should read as precise, structural, and information-forward, with Arabic using Alexandria while the Latin experience pairs Space Grotesk display type with Geist Sans and Geist Mono.

## Colors
- **brand-ink** (`#000000`): primary text, dividers, progress bars, filled CTAs, emphasis, icon color.
- **canvas-paper** (`#F7F5F1`): default page background, hero/footer surfaces, muted timeline rails, shell sections.
- **surface-elevated** (`#FFFFFF`): cards, stat panels, stack tiles, content blocks placed on paper backgrounds.
- **surface-muted** (`#F3F1ED`): stack section background and secondary paper surfaces.
- **border-subtle** (`#D9D6D1`): default border/grid tone; represents the visual effect of `black/15` on light surfaces.
- **text-secondary** (`#5C5954`): secondary body copy and supporting descriptions; approximates the repeated `black/62` to `black/68` treatment.
- **text-tertiary** (`#8B8781`): metadata, eyebrow labels, timestamps, and passive utility text; approximates the repeated `black/45` to `black/55` treatment.
- **status-live** (`#059669`): live-status dot only. Do not use as a general accent.

## Typography
- Display LTR: `Space Grotesk`, 600 weight, uppercase, tracking `-0.08em` to `-0.11em`, used for major headings and numeric hero stats.
- Body LTR: `Geist Sans`, 400 weight, typically 14px to 18px, leading 1.6 to 1.75, used for paragraph copy and descriptions.
- Data/Meta LTR: `Geist Mono`, 400-500 weight, typically 10px to 12px, uppercase, tracking `0.24em` to `0.35em`, used for labels, pills, timestamps, and controls.
- RTL mode: `Alexandria` replaces display and mono treatments for Arabic content; letter-spacing should reset to normal rather than preserving aggressive Latin tracking.
- Hero headline scale: `clamp(3rem, 10vw, 7.5rem)` depending page context, always uppercase and tightly stacked.
- Section headings: 36px to 60px equivalent, uppercase, Space Grotesk/Alexandria display treatment.
- Stat numerals: 32px to 64px equivalent with display treatment, never decorative gradients or outlined numerals.

## Spacing
Base unit: 4px.
- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 24px
- `2xl`: 32px
- `3xl`: 40px
- `4xl`: 48px
- `5xl`: 64px
- `6xl`: 80px
- Page frame: content constrained to `max-w-7xl` with horizontal padding `24px` mobile / `40px` desktop.
- Section rhythm: hero and page intros use `64px` to `96px` vertical padding; content sections use `48px` to `64px`.
- Card padding: standard white panels use `24px` mobile / `32px` desktop.
- Grid separators: use 1px borders and `gap-px` layouts to create ledger-style grids rather than soft card gutters.

## Components
### Header
- Sticky top navigation with warm paper background at high opacity and backdrop blur.
- Bottom border only; no drop shadow.
- Logo at left, mono uppercase nav links on desktop, locale toggle and progress CTA on the right.
- Navigation should feel quiet and editorial, not app-chrome heavy.

### Hero Shell
- Use the `stitch-shell` graph-paper background for homepage and major intro sections.
- Pair a large uppercase display headline on the left with a white bordered status/stat panel on the right.
- Eyebrow label sits in mono uppercase with a horizontal rule extending across the row.
- Follow the hero with a 3-column metric strip separated by 1px grid lines.

### Section Headers
- Each major section begins with a mono eyebrow, then a large uppercase heading, then restrained supporting copy.
- Use border-bottom rules to separate section header blocks from content grids.
- Keep copy widths constrained; visual hierarchy should come from typography and structure, not color.

### Cards and Panels
- Default surface is white with 1px subtle border.
- Corners are sharp. Do not introduce rounded card systems for the public site.
- Cards often live inside a `gap-px` parent with a dark border background to create structural gutters.
- Information is stacked in layers: meta label, display title/value, then supporting rows or tags.

### Metric Cards
- White panels with mono 10px labels, large display numeric values, and occasional monochrome icons.
- Use black or muted text only; no colorful KPI tiles.
- Progress indicators are thin horizontal black bars on faint black tracks.

### Project Cards
- Two-column desktop board using white cards inside a bordered grid.
- Top row contains build ID, title, and status pill.
- Middle contains description, optional timeframe, progress bar, AI skill tags, and tool tags.
- Planning/unlaunched cards blur their content slightly and show a centered “Launching Soon” overlay.
- Primary action is a full-width black button with white mono label and arrow icon.

### Tags and Pills
- Rectangular, bordered, mono uppercase, 10px text with wide tracking.
- Default tags are white or transparent with black border.
- Status tags can invert to black fill with white text, but remain sharp-cornered.

### Buttons and Links
- Primary button: black fill, white mono uppercase text, height about 44px, no rounded corners.
- Secondary button: white fill, black border, black mono uppercase text.
- Hover states should be subtle: border darkening or slight upward translation on filled CTAs.
- External links may include `ArrowUpRight`; icon size stays small and utilitarian.

### Stack Selector
- Section background shifts to muted paper (`#F3F1ED`) to distinguish from the homepage project board.
- Project selector uses compact rectangular chips; active chip is black with white text.
- Stack items are white tiles in a ledger grid with a small square icon frame, mono label, and uppercase item name.

### Timeline / Progress Log
- Timeline entries are ledger blocks with a muted left rail for month metadata and white metric cells on the right.
- Lower half splits into white skills area and paper-toned milestones area.
- Icons stay monochrome and functional.
- This section should feel archival and tabular rather than celebratory.

### Footer
- Simple bordered footer on paper background.
- Logo/title block on the left, quiet mono links on the right.
- Keep density light; footer is informational, not promotional.

## Do's and Don'ts
- DO preserve the monochrome-first palette with warm paper tones and black structure.
- DO keep corners sharp across cards, buttons, tags, and grids.
- DO use uppercase display headlines and mono metadata to maintain the editorial dashboard voice.
- DO rely on borders, rules, and grid seams for separation before adding shadows or color.
- DO keep RTL typography softer by removing aggressive letter spacing in Arabic.
- DO keep section widths, padding, and rhythm consistent with the existing `max-w-7xl` layout.
- DON'T introduce bright accent colors beyond the small green live-status indicator.
- DON'T use gradients, glassmorphism, neon effects, or colorful KPI cards on the public site.
- DON'T switch to soft, rounded SaaS-style components; this design language is structural and hard-edged.
- DON'T mix more than one elevation style; most surfaces should feel flat and print-like.
- DON'T center every layout block by default; hero and content sections should preserve asymmetry where the current design uses it.
- DON'T use default system fonts for prominent interface moments when `Space Grotesk`, `Geist`, and `Alexandria` are available.
