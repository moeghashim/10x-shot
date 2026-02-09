# Repository Guidelines

## Project Structure & Module Organization
- `app/` is the Next.js App Router; localized routes live under `app/[locale]/`, and API routes under `app/api/`.
- `components/` holds React UI, with shared primitives in `components/ui/` (shadcn/ui).
- `lib/`, `hooks/`, and `types/` contain utilities, data access, and shared types.
- `i18n/` and `messages/` power `next-intl` translations; `public/` hosts static assets; `styles/` contains global styling.
- `migrations/` and `setup-database.md` document Supabase database setup and changes.

## Build, Test, and Development Commands
- `pnpm dev` starts the local Next.js dev server.
- `pnpm build` produces a production build.
- `pnpm start` serves the production build.
- `pnpm lint` runs Next.js ESLint checks.
- `pnpm diagnose-rls` runs `scripts/diagnose-and-fix-rls.js` to inspect Supabase RLS issues.

## Coding Style & Naming Conventions
- TypeScript + React (App Router). Follow existing 2-space indentation and double-quote style in TS/TSX.
- Use Tailwind CSS utilities and shadcn/ui components; prefer `cn()` from `lib/utils` for conditional class lists.
- Use path aliases like `@/components`, `@/lib`, and `@/types` instead of deep relative paths.

## Testing Guidelines
- No `test` script is defined; tests are standalone scripts in `tests/`.
- Example: `tests/project-update.test.ts` checks Supabase persistence and requires `.env.local`. Run via a TS-capable runner.

## Commit & Pull Request Guidelines
- Recent commits use short, imperative subjects with optional prefixes (e.g., `feat: add RTL support`). Keep messages concise.
- PRs should include a brief purpose, linked issue (if any), and screenshots for UI changes.
- The repo syncs with v0.dev deployments; coordinate changes there when necessary to avoid drift.

## Configuration & Security Notes
- Store secrets only in `.env.local` (do not commit). Document schema changes in `migrations/` and `setup-database.md`.
- Builds ignore ESLint/TS errors (see `next.config.mjs`), so run `pnpm lint` and fix issues before merging.
