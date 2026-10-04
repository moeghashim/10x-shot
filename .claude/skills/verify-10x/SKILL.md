---
name: verify-10x
description: "Prove behaviour of the 10x Next.js app by launching it locally and driving its public pages and API routes with read-only HTTP requests. Use after any change to pages, metadata, locale or RTL handling, or admin API auth, and before declaring such a change done."
---

# Verify 10x

The app is a Next.js 15 site with `en` and `ar` locales, backed by Convex. A user touches the public pages (`/`, `/stack`, `/progress`, `/future`, `/track`, `/magic-follow`) and an admin dashboard at `/admin`.

**The app's envs point at the production Convex deployment.** This skill only sends GET requests. Never POST, PATCH or DELETE to `/api/admin/*` from here, never sign in, and never run the translation backfill or stack migrate routes. To prove a write path, call the route and Convex handlers against an in-memory database in a `node --test` file instead.

All commands run from the repo root through one helper:

```bash
.claude/skills/verify-10x/verify.sh all       # launch, doctor, drive, cleanup
.claude/skills/verify-10x/verify.sh launch    # start the dev server and wait until ready
.claude/skills/verify-10x/verify.sh doctor    # is this instance worth driving?
.claude/skills/verify-10x/verify.sh drive     # run every check, save evidence
.claude/skills/verify-10x/verify.sh cleanup   # stop the server this harness started
```

## Launch

`verify.sh launch` runs `next dev` on port 3210 (override with `VERIFY_PORT`) and waits for `/robots.txt` to answer. It refuses to start if the port is taken, so it never drives a server you did not start. The server log is at `$TMPDIR/verify-10x/dev.log`.

## Doctor

`verify.sh doctor` checks that the process this harness started is alive, that something is listening on the port, and that `/robots.txt` returns 200. Run it first whenever a check fails unexpectedly.

## Drive

`verify.sh drive` prints one `PASS` or `FAIL` line per check and exits non-zero on any failure. It checks that:

- every public page returns 200 in both locales, with `lang="en" dir="ltr"` or `lang="ar" dir="rtl"`;
- the home page carries a JSON-LD script, and `/sitemap.xml`, `/robots.txt` and `/api/public/stats` respond with the expected shape;
- each admin API route returns 401 to a request with no session.

To check something new, add a `page <path> <name> <expected substring>...` or `status <path> <code>` line inside `drive()`. Prefer stable strings such as attributes, meta tag names and JSON keys over visible copy, which is edited from the admin dashboard.

For layout, RTL or interaction checks that need a real browser, launch with this helper and open `http://localhost:3210` with the T3 preview tools (`preview_open`, `preview_snapshot`). Stay on public pages.

## Evidence

Each response body is saved to `$TMPDIR/verify-10x/evidence/<name>.html` (override with `VERIFY_EVIDENCE`). Quote the `PASS`/`FAIL` lines in your reply, and the relevant saved markup when the claim is about content. A 200 alone does not prove a content change; grep the saved file for the value you changed.

## Cleanup

`verify.sh cleanup` stops only the process recorded in `$TMPDIR/verify-10x/dev.pid`. It keeps the evidence directory. Run it after a failed run too.

## Feature map

See [`features/README.md`](features/README.md).
