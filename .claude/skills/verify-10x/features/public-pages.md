# Public pages in both locales

## Sub-features

- Home (`/`), stack, progress, future, track and magic-follow pages.
- English (`/en/...`, left to right) and Arabic (`/ar/...`, right to left).
- `/about` redirects, so it is not checked directly.

## How to get to it (user POV)

Open the site. `/` redirects to the default locale, `/en`. The locale toggle in the navigation switches to `/ar`.

## Driving it with verify.sh

`drive()` requests each page in each locale and asserts a 200 with the matching `lang` and `dir` attributes on `<html>`. Bodies are saved as `en.html`, `ar-stack.html` and so on.

## Gotchas

- Page copy and project data come from Convex and change without a deploy. Assert on structure, not on wording.
- When Convex is unreachable the pages still return 200 with fallback data (`lib/data-fetching.ts`), so a 200 does not prove the backend answered.
