# 10 Claws

10 Claws is a bilingual build-in-public portfolio for testing whether AI can produce measurable leverage across a group of real projects. The public site shows what is being built, the tools being used, operating progress, future bets, and a curated technology watchlist. An authenticated admin dashboard keeps the underlying portfolio data current.

[![Live site](https://img.shields.io/badge/Live-10claws.com-black?style=for-the-badge)](https://www.10claws.com/en)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/bannaa/v0-10x-builder-ai-website)
[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

## What the site contains

All public pages are available in English and Arabic through the `app/[locale]/` route segment.

| Route | Purpose | Source of truth |
| --- | --- | --- |
| `/en` · `/ar` | Portfolio homepage with project status, progress, tools, and AI skills | Convex, with checked-in fallback projects |
| `/en/progress` · `/ar/progress` | Public metrics, achievements, and roadmap cards | Convex |
| `/en/stack` · `/ar/stack` | Tool and AI-skill inventory with grades, familiarity, and project usage | Convex |
| `/en/future` · `/ar/future` | Reviewed future bets rendered through a constrained component catalog | `lib/future/specs.ts` |
| `/en/track` · `/ar/track` | Curated updates for coding agents, infrastructure, and agentic commerce | `lib/track/data.ts` |
| `/en/about` · `/ar/about` | Company overview and CAPTCHA-protected enquiry form | `lib/about/content.ts` and FormSubmit |
| `/en/admin` · `/ar/admin` | Authenticated management for projects, stack, metrics, roadmap, copy, and users | Convex + Better Auth |

The Future page does not generate content at runtime. Its English and Arabic JSON-render specs are checked in, validated against `lib/future/catalog.ts`, reviewed, and then deployed. Track follows a similar reviewed-content model so scheduled research updates can safely modify one typed data module.

## Product architecture

```text
Next.js App Router
├── Public portfolio and research pages
├── Authenticated admin dashboard
├── next-intl locale routing (English + Arabic/RTL)
└── Server-side data layer
    ├── Convex queries and mutations
    ├── 60-second public caches with revalidation tags
    └── Checked-in fallback data for the homepage

Convex
├── Projects and stack relationships
├── Project and global metrics
├── Planning/roadmap cards
├── Localized site copy
├── Admin users and activity
└── Better Auth integration
```

Content entered in English through the admin can be translated into Arabic through the OpenAI Responses API. Persisted localization records retain sync status and translation metadata; the public routes then select the requested locale in Convex.

## Technology

- Next.js 15 App Router, React 19, and TypeScript
- Tailwind CSS 4 and shadcn/ui-style Radix primitives
- Convex for application data and server functions
- Better Auth with the Convex adapter for admin sessions
- next-intl for English and Arabic routing and messages
- JSON Render for the constrained Future page
- Vercel Analytics and Google Analytics
- Vercel for hosting and continuous deployment

## Local development

Requirements:

- Node.js 22 or another version supported by Next.js 15
- pnpm 10 (the exact version is pinned in `package.json`)
- Access to the appropriate Convex deployment for live data and admin work

Install dependencies and start the app:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) or [http://localhost:3000/ar](http://localhost:3000/ar).

### Environment variables

Secrets belong in `.env.local` and must not be committed. The application reads the following variables:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | Convex client and server query endpoint |
| `NEXT_PUBLIC_CONVEX_SITE_URL` or `CONVEX_SITE_URL` | Convex HTTP/auth site endpoint |
| `NEXT_PUBLIC_SITE_URL` or `SITE_URL` | Canonical application URL used by auth |
| `BETTER_AUTH_SECRET` | Better Auth signing secret |
| `OPENAI_API_KEY` | Optional; required for automatic admin-content translation |
| `OPENAI_TRANSLATION_MODEL` | Optional translation-model override; defaults in `lib/translation.ts` |

The current local runtime configuration points at production Convex URLs, while the Convex CLI defaults to the development deployment. Check the active target before changing backend data.

## Commands and validation

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm lint` | Run Next.js ESLint checks |
| `pnpm exec tsc --noEmit` | Run TypeScript validation explicitly |
| `pnpm build` | Create an optimized production build |
| `pnpm start` | Serve the completed production build |
| `npx convex dev` | Push Convex changes to the configured development deployment |
| `npx convex deploy` | Deploy Convex functions and schema to production |
| `npx convex env set --prod NAME VALUE` | Set a production Convex environment variable |

`next.config.mjs` currently allows production builds to continue when TypeScript or ESLint errors exist. A successful build is therefore not a substitute for `pnpm exec tsc --noEmit` and targeted browser checks.

Run `pnpm lint` separately as part of validation; the current Next.js ESLint checks pass with the installed configuration.

There is no general unit-test runner configured. The `tests/` directory contains standalone integration scripts, including a persisted project-update check that requires `.env.local` and a TypeScript-capable runner.

For a public-page change, the expected verification path is:

```bash
pnpm exec tsc --noEmit
pnpm build
pnpm exec next start -p 3000
```

Then check the affected English and Arabic routes in a browser, including RTL layout and console errors.

## Updating content

Use the authenticated admin dashboard for portfolio data:

- projects and their statuses
- stack items and project relationships
- project and global metrics
- public roadmap cards
- localized site copy
- admin users

Use checked-in files for reviewed research surfaces:

- Update `lib/future/specs.ts` for Future page copy and structure. Keep English and Arabic aligned and stay within `lib/future/catalog.ts`.
- Update `lib/track/data.ts` for technology topics and dated signals. Cite primary sources and distinguish dated releases from undated source snapshots.
- Update `messages/en.json` and `messages/ar.json` together when changing message-catalog copy.

## Repository structure

```text
app/                 Next.js routes, localized pages, and API handlers
components/          Public UI, admin managers, and shared primitives
convex/              Schema, queries, mutations, auth, and generated bindings
i18n/                next-intl routing and request configuration
lib/                 Data access, caching, localization, and reviewed page data
messages/            English and Arabic message catalogs
public/              Logos, social image, manifest, and static assets
tests/               Standalone integration checks
types/               Shared application and persistence types
```

## Deployment

Pull requests and GitHub pushes flow through the linked Vercel project. Public frontend changes deploy through Vercel after merge.

Convex production changes are a separate operation and must be deployed deliberately:

```bash
npx convex deploy
```

Do not assume a Vercel deployment also publishes Convex schema or function changes.

The project remains linked to its original [v0 workspace](https://v0.dev/chat/projects/Jj03MH9lC8M). Coordinate edits made in v0 with this repository to avoid source drift.
