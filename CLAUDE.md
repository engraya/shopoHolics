# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (port 3000)
npm run build     # Production build
npm run start     # Run production server
npm run lint      # ESLint via next lint
```

No test suite is configured.

## Architecture

**Stack**: Next.js 14 App Router, TypeScript (strict), Tailwind CSS, Sanity CMS, Stripe (via `use-shopping-cart`), Radix UI primitives.

**Directory layout**:
- `src/app/` — File-based routes (App Router). Pages are async server components by default.
- `src/features/` — Feature-domain code co-located by concern (`products/`, `cart/`).
- `src/components/` — Shared UI primitives (`ui/`), layout shells (`layout/`), context providers (`providers/`).
- `src/lib/sanity/` — Sanity client, image URL builder, and all GROQ queries with ISR constants.
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge), `formatPrice()` (Intl USD), `runFireworks()` (canvas-confetti).
- `src/types/` — Shared TypeScript interfaces.

## Data Fetching Pattern

All Sanity fetches live in `src/lib/sanity/queries.ts` as named async functions (e.g. `getAllProducts()`, `getProductBySlug(slug)`). Each call passes `next: { revalidate: N }` directly in the `fetch` options for ISR:

| Data | Revalidate |
|------|-----------|
| Products / Product detail | 60s |
| Newest products | 120s |
| Categories | 300s |

Pages call these functions at the top of their async server component and pass data down as props. Product pages use `generateStaticParams()` to pre-render all slugs at build time.

## State Management

- **Cart**: `use-shopping-cart` v3 (Context, persisted to localStorage, Stripe Checkout integration). Wrapped by `src/components/providers/CartProvider.tsx`.
- **Theme**: `next-themes` (light/dark). Wrapped by `src/components/providers/ThemeProvider.tsx`.
- **Local UI**: `useState` only — no Zustand, Redux, or other global state libraries.

Both providers are composed in `src/app/layout.tsx`.

## Server vs. Client Component Rules

Pages and data-fetching components are server components (no directive). Mark a component `"use client"` only when it needs browser APIs, `useState`/`useEffect`, or a Context hook (cart, theme). Keep client boundaries at leaf components — don't push them up the tree unnecessarily.

## Styling

Tailwind utility-first throughout. Color system uses HSL CSS custom properties (`--primary`, `--muted`, `--accent`, etc.) with `dark:` variants toggled via class strategy. Custom animations: `fade-in` (0.15s), `accordion-down/up`. Font: Inter via `--font-inter` CSS variable.

Merge classes with `cn()` from `src/lib/utils.ts` — never concatenate raw strings.

## Image Handling

Remote image domains allowed in `next.config.mjs`: `cdn.sanity.io`, `tailwindui.com`. Use the `urlFor()` helper from `src/lib/sanity/client.ts` to build Sanity CDN URLs. Always use `next/image` with a `sizes` prop for responsive images.

## Environment Variables

All are `NEXT_PUBLIC_` (client-exposed). Required:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

See `.env.example` for the full list.

## Path Aliases

```
@/*          → src/
@components/* → components/  (root-level, legacy)
@public/*    → public/
```
