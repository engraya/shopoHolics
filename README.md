# Shopoholics

A full-stack e-commerce storefront built with the Next.js App Router — real Paystack payments, server-authoritative pricing, and a fully typed domain layer.

[![CI](https://github.com/engraya/shopoHolics/actions/workflows/ci.yml/badge.svg)](https://github.com/engraya/shopoHolics/actions/workflows/ci.yml)
[![Live demo](https://img.shields.io/badge/demo-shopoholics.vercel.app-0ea5e9)](https://shopoholics.vercel.app/)

> **Live:** https://shopoholics.vercel.app/ · **Stack:** Next.js 14 · TypeScript · Prisma/Postgres · NextAuth v5 · Paystack · Tailwind

<!-- Add a screenshot or short GIF here: docs/preview.png -->

---

## Highlights

- **Server-authoritative money.** The client never submits prices. `/api/checkout` re-derives every total from `src/lib/cart/pricing.ts` — the single source of truth shared by the cart UI and the server — so the amount on the summary card and the amount Paystack charges cannot drift apart.
- **Verified Paystack webhooks.** Payments are confirmed via HMAC-SHA512 signature verification over the raw request body (`verifyWebhookSignature`), with a `timingSafeEqual` comparison and idempotent order fulfilment.
- **Promo engine.** Percentage (capped), fixed-amount, and free-shipping promo codes with minimum-basket rules and a free-delivery threshold, all computed in integer kobo.
- **Typed catalog with ISR.** A DummyJSON-backed catalog adapter normalizes products into the app's domain types and caches with per-route revalidation.
- **Auth done carefully.** NextAuth v5 (credentials + optional Google OAuth), bcrypt-hashed passwords, and an open-redirect-safe `callbackUrl` sanitizer.
- **Security baseline.** Global security headers (`X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`) in `next.config.mjs`; secrets stay server-side.
- **Accessible UI.** Radix + shadcn primitives, keyboard-friendly cart stepper with a live-region quantity, dark mode via `next-themes`.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router, RSC) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui + Radix |
| Data | Prisma ORM + Neon serverless Postgres |
| Auth | NextAuth v5 (credentials + Google) |
| Payments | Paystack (redirect + webhooks) |
| Email | Resend + React Email |
| Testing | Vitest + Testing Library + Playwright |
| CI | GitHub Actions |

## Getting started

```bash
git clone https://github.com/engraya/shopoHolics.git
cd shopoHolics
npm install                 # installs deps and runs `prisma generate`
cp .env.example .env        # then fill in the values
npm run db:push             # sync the Prisma schema to your database
npm run dev                 # http://localhost:3000
```

### Environment

See [`.env.example`](./.env.example). Required to run: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_BASE_URL`, `PAYSTACK_SECRET_KEY`. Optional: Google OAuth and Resend email keys.

## Testing

```bash
npm run test            # unit + component tests (Vitest)
npm run test:watch      # watch mode
npm run test:coverage   # coverage report
npm run e2e             # Playwright storefront smoke tests
```

**What's covered**

- **Unit** — cart pricing/promo math, Paystack HMAC verification, the open-redirect `callbackUrl` guard, currency formatting, BigInt order serialization, and the DummyJSON adapter (with `fetch` mocked).
- **Component** — the cart `QuantityStepper` (remove-at-one behaviour, max clamp, ARIA) and `ProductCard` rendering.
- **E2E** — a storefront smoke path: home → products → product detail → add to cart.

Business logic is deliberately separated from Prisma (see `src/lib/**`), so the money-critical paths are unit-testable without a database.

## Scripts

| Script | Purpose |
| --- | --- |
| `dev` / `build` / `start` | Next.js dev / production build / serve |
| `lint` / `typecheck` | ESLint / `tsc --noEmit` |
| `test` / `test:watch` / `test:coverage` | Vitest |
| `e2e` | Playwright |
| `db:push` / `db:migrate` / `db:studio` | Prisma |

## CI

Every push and PR runs, via GitHub Actions: config-size and committed-secret guards, install, lint, typecheck, unit tests, and a production build — plus a separate Playwright smoke job. See [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

## License

MIT
