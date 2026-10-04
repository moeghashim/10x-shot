# Feature map

One file per user-facing feature. Each says how a user reaches it, how the harness drives it, and what proves it works.

| Feature | File | Covered by `verify.sh drive` |
|---|---|---|
| Public pages in both locales | [public-pages.md](public-pages.md) | yes |
| Admin API authentication | [admin-api-auth.md](admin-api-auth.md) | unauthenticated reads only |
| Search and social metadata | [metadata.md](metadata.md) | JSON-LD, sitemap, robots |

Not mapped yet: the admin dashboard UI (`/admin`), which needs a signed-in session against the dev Convex deployment before it can be driven safely.
