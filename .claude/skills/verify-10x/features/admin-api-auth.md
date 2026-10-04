# Admin API authentication

## Sub-features

- Every route under `/api/admin/*` must reject a caller with no session.
- Reads (GET) and writes (POST, PATCH, DELETE) are both guarded by `requireAdmin` in `convex/lib.ts`.

## How to get to it (user POV)

An admin signs in at `/admin`; the dashboard then calls these routes with the session cookie. Anyone else calling them directly must get 401.

## Driving it with verify.sh

`drive()` sends a GET with no cookie to `projects`, `project-metrics`, `planning-cards`, `stack`, `users` and `activity` and expects 401.

## Gotchas

- Only GET is safe here. A write request reaches the production deployment. Prove write-path ordering (auth before translation, auth before mutation) with a `node --test` file that mocks `@/lib/auth-server` and `@/lib/translation`.
- The production deployment redacts error messages to `[Request ID: ...] Server Error`. The auth code survives only in `ConvexError.data`, which is what `lib/auth-error.ts` reads.
- `global-metrics` GET calls a public Convex query and returns 200 by design, so it is not in the 401 list.
