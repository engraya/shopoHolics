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

**Stack**: Next.js 14 App Router, TypeScript (strict), Tailwind CSS, Sanity CMS, Paystack (redirect checkout, no SDK), Radix UI primitives.

**Directory layout**:
- `src/app/` — File-based routes (App Router). Pages are async server components by default.
- `src/features/` — Feature-domain code co-located by concern (`products/`, `cart/`).
- `src/components/` — Shared UI primitives (`ui/`), layout shells (`layout/`), context providers (`providers/`).
- `src/lib/sanity/` — Sanity client, image URL builder, and all GROQ queries with ISR constants.
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge), `formatPrice()` (Intl NGN, whole Naira), `formatMinor()` (kobo → Naira).
- `src/lib/confetti.ts` — `runFireworks()` (canvas-confetti). Kept out of `utils.ts` so server components can import the formatters without pulling in a browser-only dependency.
- `src/lib/paystack.ts` — Paystack transaction initialize/verify and webhook HMAC verification.
- `src/lib/orders/fulfillOrder.ts` — shared, idempotent order fulfilment used by both the webhook and the callback verify route.
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

- **Cart**: custom React context in `src/features/cart/context/CartContext.tsx` (`useCart()`), persisted to localStorage under `shopoholics.cart.v2`. Entries are keyed by product slug. Gate cart-dependent UI on `isHydrated` — state is empty on the server pass and on the client's first render, by design. Re-exported through `src/components/providers/CartProvider.tsx`.
- **Theme**: `next-themes` (light/dark). Wrapped by `src/components/providers/ThemeProvider.tsx`.
- **Local UI**: `useState` only — no Zustand, Redux, or other global state libraries.

Both providers are composed in `src/app/layout.tsx`.

## Server vs. Client Component Rules

Pages and data-fetching components are server components (no directive). Mark a component `"use client"` only when it needs browser APIs, `useState`/`useEffect`, or a Context hook (cart, theme). Keep client boundaries at leaf components — don't push them up the tree unnecessarily.

## Styling

Tailwind utility-first throughout. Color system uses HSL CSS custom properties (`--primary`, `--muted`, `--accent`, etc.) with `dark:` variants toggled via class strategy. Custom animations: `fade-in` (0.15s), `accordion-down/up`. Fonts: Inter (`--font-inter`) and JetBrains Mono (`--font-mono`), self-hosted from `src/app/fonts/` through `next/font/local` in `src/app/layout.tsx` — variable woff2, latin subset. No `next/font/google`, so builds never touch the network.

Merge classes with `cn()` from `src/lib/utils.ts` — never concatenate raw strings.

## Image Handling

Remote image domains allowed in `next.config.mjs`: `cdn.sanity.io`, `tailwindui.com`. Use the `urlFor()` helper from `src/lib/sanity/client.ts` to build Sanity CDN URLs. Always use `next/image` with a `sizes` prop for responsive images.

## Environment Variables

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=            # server-only; also signs webhooks
```

`PAYSTACK_SECRET_KEY` must never be `NEXT_PUBLIC_` — Paystack has no separate
webhook secret, so the secret key doubles as the webhook signing key. The
redirect flow never needs a public key.

See `.env.example` for the full list.

## Payments

Paystack redirect flow, no SDK — two `fetch` calls and `node:crypto`.

1. `POST /api/checkout` receives **ids and quantities only**, re-resolves every price through `src/lib/api/queries.ts`, writes a `PENDING` order plus its items, then initializes the Paystack transaction and returns `authorization_url`.
2. The browser redirects to Paystack and returns to `/payment/success?reference=…`.
3. That page calls `POST /api/payments/verify`, which confirms the transaction and fulfils the order inline. **Paystack has no cancel URL** — abandoned payments land on the same callback, so the page redirects to `/payment/error` when the transaction is not successful.
4. `POST /api/webhooks/paystack` handles `charge.success` for the same fulfilment.

Both paths call `fulfillOrder()`, whose atomic `updateMany` on `status: PENDING` makes double-fulfilment impossible. The verify route means checkout works end-to-end with no webhook configured, which is what makes local development practical.

**Money:** the DB `*Cents` columns and all Paystack amounts are **kobo** (integer minor units). Product and cart prices are **whole Naira**. Render `*Cents` values with `formatMinor()`, never `formatPrice()`. Catalogue prices are scaled by `NGN_PRICE_MULTIPLIER` in `src/lib/api/queries.ts` — the single conversion point, which is why client and server can't disagree on price.

Every `*Cents` column is **`BigInt`**, not `Int`. A 32-bit column tops out at 2,147,483,647 kobo — only ₦21,474,836 — which the catalogue passes on a single item (a ₦55M car), never mind a multi-unit order. Prisma therefore types these fields as `bigint`, while the rest of the app works in `number` (exact to 2^53 kobo, about ₦90tn). Two rules follow:

- `JSON.stringify` **throws** on a bigint. Any order leaving the server as JSON goes through `serializeOrder()` in `src/lib/orders/serialize.ts`.
- Arithmetic and `>` comparisons against plain numbers need an explicit `Number(...)`; `formatMinor()` accepts either, so display-only sites can render a Prisma row directly.

Writes need no conversion — Prisma accepts `number` for a `BigInt` field.

## Path Aliases

```
@/*          → src/
@components/* → components/  (root-level, legacy)
@public/*    → public/
```
