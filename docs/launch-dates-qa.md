# Project launch dates — 30 September 2026

Project summaries now show launch dates instead of completion percentages and progress bars. The admin project editor accepts an optional calendar date or month; clearing it shows TBA (Arabic: يُحدد لاحقاً). Existing project percentages and monthly metrics remain stored, and existing projects were not assigned inferred launch dates.

Validation:

- `pnpm lint` and `pnpm exec tsc --noEmit` passed.
- `pnpm build` and the production Vercel build passed.
- `node --test tests/launch-date.test.mjs tests/home-redesign.test.mjs`: 12 tests passed, including invalid calendar dates, leap days, unknown dates, consistent formatting across timezones, and launch ordering without mutating the input.
- Live English desktop and Arabic mobile (390px) show launch-date cells without project progress bars or horizontal overflow.
- Live English and Arabic ledgers and stack selectors show 10 Signals first, followed by the ten projects without launch dates. Launched dates sort newest first; future dates follow in upcoming-date order, then missing or invalid dates. Equal dates use Build ID order.
- Production Convex contains 10 Signals (BUILD_13), Active, using ChatGPT, Trigger.dev, and Stripe Projects, with the Opus 5.5 design credit. Its launch month is September 2026 (`2026-09`), as supplied by the owner; no day is inferred. All ten pre-existing project query results were unchanged by this insertion.
- Temporary insertion helper removed and backend redeployed.
- Authenticated admin form submission was not exercised because the browser session was signed out; field plumbing and backend validation passed type checks and review.

![Live English project rows](screenshots/project-launch-dates-desktop.png)

![Live Arabic mobile project rows](screenshots/project-launch-dates-mobile-ar.png)

![Launch ordering: 10 Signals first](screenshots/project-launch-order.png)
