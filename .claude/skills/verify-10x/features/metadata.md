# Search and social metadata

## Sub-features

- JSON-LD structured data on the home page.
- `/sitemap.xml` and `/robots.txt`.
- Open Graph and Twitter tags per page.

## How to get to it (user POV)

A visitor never sees these directly. Crawlers and link previews read them from the page source.

## Driving it with verify.sh

`drive()` asserts the home page contains an `application/ld+json` script, the sitemap contains `<urlset`, and robots contains `User-Agent`. To check a meta tag, grep the saved page, for example `grep -o '<meta property="og:image"[^>]*>' "$TMPDIR/verify-10x/evidence/en.html"`.

## Gotchas

- Project titles and descriptions from the database are embedded in the JSON-LD script, so any check of escaping must look at the raw saved HTML, not at parsed JSON.
- This proves what the server emits. It does not prove a platform renders the preview image.
