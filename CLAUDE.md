# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application built with React 19 that tracks AI productivity impact across various projects. The project was generated through v0.dev and automatically syncs with deployments.

## Commands

- **Development**: `pnpm dev` or `npm run dev`
- **Build**: `pnpm build` or `npm run build`
- **Production**: `pnpm start` or `npm run start`
- **Linting**: `pnpm lint` or `npm run lint`

Note: The project uses pnpm as the preferred package manager (has pnpm-lock.yaml).

## Architecture & Structure

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **React**: Version 19
- **TypeScript**: Full TypeScript setup
- **Styling**: Tailwind CSS with shadcn/ui components
- **UI Library**: Radix UI primitives with custom styling
- **Analytics**: Vercel Analytics integration

### Key Directories
- `app/` - Next.js App Router pages and layout
- `components/` - React components split into:
  - `components/ui/` - Reusable UI components (shadcn/ui)
  - `components/` - Page-specific components
- `lib/` - Utility functions (contains `cn` utility for class merging)
- `public/` - Static assets
- `styles/` - Global CSS and Tailwind configuration

### Component Architecture
The app follows a section-based layout pattern:
- **HeroSection**: Main landing area
- **StatsSection**: Metrics display
- **ProjectGrid**: Project showcase with ProjectCard components
- **NewsletterSection**: Subscription component
- **Footer**: Site footer

### Styling Approach
- Uses shadcn/ui with "new-york" style variant
- Tailwind CSS with CSS variables for theming
- Path aliases configured: `@/components`, `@/lib/utils`, etc.
- Class merging utility via `lib/utils.ts` (`cn` function)

### Build Configuration
- ESLint and TypeScript errors ignored during builds (configured in next.config.mjs)
- Images are unoptimized for static export compatibility
- Strict TypeScript mode enabled

### Database & Backend
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth for admin access
- **Admin System**: Full CRUD operations for projects and metrics
- **Schema**: See `lib/database-schema.sql` for complete setup
- **Environment**: All credentials configured in `.env.local`

### Admin Features
- **Admin Dashboard**: `/admin` route with authentication
- **Project Management**: Add, edit, update project details and progress
- **Metrics Tracking**: Month-over-month productivity and progress tracking
- **Database Setup**: Run `lib/database-schema.sql` in Supabase to set up tables

### Development Notes
- Project syncs automatically with v0.dev deployments
- Uses Geist font family
- Form handling with react-hook-form and zod validation
- Includes various chart libraries (recharts) and UI enhancements
- Admin system requires authenticated Supabase session