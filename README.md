# 10claws

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/bannaa/v0-10x-builder-ai-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/Jj03MH9lC8M)

## Overview

This is the 10claws marketing site and admin dashboard.

- Live site: **[https://www.10claws.com/](https://www.10claws.com/)**
- Frontend: Next.js 15 App Router
- Backend: Convex
- Admin auth: Better Auth with the Convex adapter

## Commands

- `pnpm dev` starts the local Next.js app
- `pnpm build` creates a production build
- `pnpm start` runs the production build
- `pnpm lint` runs ESLint
- `npx convex dev` pushes Convex changes to the configured dev deployment
- `npx convex deploy` pushes Convex changes to the production deployment

## Deployments

The repo now uses separate app runtime and Convex CLI targets on purpose.

- App runtime envs in `.env.local` point at the production Convex deployment
- Convex CLI still defaults to the dev deployment for local backend iteration
- Production Convex changes should go through `npx convex deploy`
- Production Convex env changes should go through `npx convex env set --prod ...`

This keeps local Convex development safe while the app can still be verified against production data when needed.

## Hosting

GitHub pushes trigger the Vercel redeploy flow for the linked project.

Continue building the source project on:

**[https://v0.dev/chat/projects/Jj03MH9lC8M](https://v0.dev/chat/projects/Jj03MH9lC8M)**
