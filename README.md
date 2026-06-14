<div align="center">

# Shopoholics

**A production-grade, full-stack e-commerce platform — headless CMS, real authentication, Stripe payments, order persistence, and transactional email out of the box.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Sanity](https://img.shields.io/badge/Sanity-CMS-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)](https://www.sanity.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Live Demo](#) · [Report Bug](https://github.com/Engraya/shopoholics/issues) · [Request Feature](https://github.com/Engraya/shopoholics/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Page Routes](#page-routes)
- [Data Layer](#data-layer)
- [Authentication](#authentication)
- [Payments & Order Flow](#payments--order-flow)
- [Email Notifications](#email-notifications)
- [API Reference](#api-reference)
- [Performance](#performance)
- [Security](#security)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Developer Notes](#developer-notes)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Shopoholics** is a complete, production-ready e-commerce application built on **Next.js 14 App Router** with TypeScript strict mode throughout. It handles every layer of a real storefront — from content management and product browsing to authenticated checkout, webhook-driven order persistence, and transactional email delivery.

The project deliberately covers the parts most tutorials skip: what happens *after* the payment, how orders get persisted reliably, how users manage their accounts, and how the back-end stays secure.

### The Problem It Solves

Most e-commerce starters give you a product grid and a Stripe redirect. Shopoholics goes further — it's a fully wired system where a completed payment triggers a webhook, creates an order record in PostgreSQL, emails the customer a receipt, and surfaces the order in the user's account history. Everything connects.

### Who It's For

- Developers who want a **reference implementation** of a production Next.js storefront
- Freelancers and agencies needing a **battle-tested foundation** to build on for clients
- Engineers studying how **auth, payments, webhooks, and email** fit together in a single Next.js app
- Portfolio projects that need to demonstrate genuine full-stack depth

---

## Features

### Storefront

- Responsive product grid — 2 → 3 → 4 columns across breakpoints
- Browse by category with dedicated filtered views and breadcrumb navigation
- Full product detail pages with multi-image gallery and thumbnail carousel
- New arrivals page with "New" badge indicators
- Empty states and 404 handling at both global and per-route levels
- Skeleton loading screens on every route for zero layout shift

### Cart & Checkout

- Persistent slide-out cart drawer accessible from any page (localStorage-backed)
- Per-item quantity controls and individual item removal
- Dedicated full cart page with live order summary
- Stripe Checkout integration — hosted, PCI-compliant payment page
- Shipping address collection (US, CA, GB, AU)
- Confetti celebration animation on successful purchase
- Payment error page with clear recovery options

### Authentication

- Email/password registration with bcrypt hashing (cost factor 12)
- Password validation enforced at the server action level (minimum 8 characters)
- Google OAuth sign-in via NextAuth v5 (Auth.js) with PrismaAdapter
- Forgot password flow
- Unified session handling across credentials and OAuth providers
- Role-based access control — `CUSTOMER` and `ADMIN` roles baked into the JWT and session

### Order Management

- Stripe webhook listener (`checkout.session.completed`) persists orders to PostgreSQL
- Idempotency guard — duplicate webhooks do not create duplicate orders
- Order history page in the user account dashboard
- Per-order detail view with itemized breakdown and shipping address
- Order status lifecycle: `PENDING → PROCESSING → SHIPPED → DELIVERED` (plus `REFUNDED` and `CANCELLED`)

### User Account

- Profile management page
- Saved shipping addresses with default address support
- Account dashboard with navigation between profile, orders, and addresses

### Email Notifications

- Welcome email sent immediately on registration (non-blocking)
- Order confirmation email with full itemized receipt sent on payment success
- React Email templates — fully styled, maintainable, version-controlled markup

### UI & Design

- Clean, modern interface built on shadcn/ui and Radix UI primitives
- Dark / Light / System theme with persistent preference via next-themes
- Smooth hover and transition animations throughout
- Toast notifications via Sonner
- Admin dashboard link visible in the user menu for ADMIN role users

### Developer Experience

- Feature-domain folder structure (`features/auth/`, `features/products/`, `features/cart/`, `features/orders/`)
- Single source of truth for GROQ projections and ISR revalidation constants
- DummyJSON adapter that mirrors the exact Sanity query interface — swap data sources without touching page components
- Path aliases (`@/*` → `src/`) throughout
- Prisma singleton pattern for safe connection reuse in serverless environments
- Zero TypeScript errors in strict mode

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 (strict) |
| **Styling** | Tailwind CSS 3.4, tailwindcss-animate |
| **UI Components** | shadcn/ui, Radix UI |
| **Icons** | Lucide React, Radix Icons |
| **Fonts** | Inter via `next/font/google` |
| **Toasts** | Sonner |
| **Animations** | canvas-confetti |
| **CMS** | Sanity (headless) with DummyJSON dev fallback |
| **Database** | Neon (serverless PostgreSQL) |
| **ORM** | Prisma 7 with `@prisma/adapter-neon` |
| **Authentication** | NextAuth v5 / Auth.js (Credentials + Google OAuth) |
| **Password Hashing** | bcryptjs |
| **Payments** | Stripe Checkout, Stripe Webhooks |
| **Cart State** | use-shopping-cart v3 (localStorage-persisted) |
| **Theme** | next-themes |
| **Email** | Resend + React Email |
| **Class Utilities** | clsx, tailwind-merge, class-variance-authority |
| **Deployment** | Vercel (recommended) |

---

## Architecture

Shopoholics uses a feature-domain layout inside the Next.js App Router. Server components handle all data fetching by default; client components are pushed to leaf nodes only to keep the client bundle tight.

```
src/
├── app/
│   ├── (auth)/                        # Auth route group — independent layout
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   │
│   ├── (shop)/                        # Storefront route group
│   │   ├── page.tsx                   # Homepage — hero + featured products
│   │   ├── products/                  # Full product catalog
│   │   ├── categories/                # Category index + [category] filtered view
│   │   ├── product/[slug]/            # Product detail (ISR + generateStaticParams)
│   │   ├── newest/                    # New arrivals
│   │   ├── cart/                      # Full cart page
│   │   ├── account/                   # Protected: profile, orders, addresses
│   │   │   ├── orders/[orderId]/      # Per-order detail view
│   │   │   ├── profile/
│   │   │   └── addresses/
│   │   └── stripe/                    # Post-checkout success and error pages
│   │
│   └── api/
│       ├── auth/[...nextauth]/        # NextAuth catch-all
│       ├── checkout/                  # Creates Stripe Checkout session
│       ├── orders/                    # Order history (authenticated)
│       │   ├── [orderId]/             # Single order by DB ID
│       │   └── by-session/[sessionId]/ # Order lookup by Stripe session
│       └── webhooks/stripe/           # Stripe event handler
│
├── components/
│   ├── layout/                        # Navbar, Footer, PageContainer
│   ├── providers/                     # ThemeProvider, CartProvider, SessionProvider
│   └── ui/                            # shadcn/ui primitives
│
├── features/
│   ├── auth/                          # Login/Register forms, UserMenu, Server Actions
│   ├── products/                      # ProductCard, AddToCartButton, ImageGallery
│   ├── cart/                          # CartSheet slide-out drawer
│   └── orders/                        # OrderCard, OrderStatusBadge
│
├── lib/
│   ├── sanity/                        # Sanity client, urlFor(), GROQ queries + ISR constants
│   ├── api/                           # DummyJSON adapter (same interface as Sanity queries)
│   ├── email/                         # Resend client + React Email templates
│   ├── auth.ts                        # NextAuth configuration
│   ├── db.ts                          # Prisma singleton with Neon adapter
│   └── utils.ts                       # cn(), formatPrice(), runFireworks()
│
└── types/
    ├── index.ts                       # Product, Category, Order, CartItem interfaces
    └── auth.ts                        # NextAuth session type augmentation
```

### Database Schema

Managed by Prisma. Models:

| Model | Purpose |
|---|---|
| `User` | Accounts created via credentials or OAuth. Has `role` (CUSTOMER / ADMIN) and `passwordHash` |
| `Account` | OAuth provider linkage (PrismaAdapter) |
| `Session` | NextAuth sessions |
| `VerificationToken` | Email verification tokens |
| `Address` | User-saved shipping addresses with `isDefault` flag |
| `Order` | One order per Stripe session. Stores amounts in cents, customer info, and shipping address |
| `OrderItem` | Individual line items within an order — name, slug, imageUrl, price, quantity |

All monetary values are stored in **cents** to eliminate floating-point rounding errors.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Sanity](https://www.sanity.io/) project with `product` and `category` documents (or rely on the DummyJSON fallback for development)
- A [Stripe](https://stripe.com/) account with products and price IDs created
- A [Neon](https://neon.tech/) serverless PostgreSQL database
- A [Google Cloud Console](https://console.cloud.google.com/) OAuth 2.0 client
- A [Resend](https://resend.com/) account with a verified sender domain

### 1. Clone & Install

```bash
git clone https://github.com/Engraya/shopoholics.git
cd shopoholics
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Fill in all values — see [Environment Variables](#environment-variables) for a full reference.

### 3. Set Up the Database

```bash
# Push the Prisma schema to your Neon database
npm run db:push

# Or run migrations (for a tracked schema history)
npm run db:migrate

# Inspect data visually
npm run db:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Test Stripe Webhooks Locally

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and forward events to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret printed by the CLI into `STRIPE_WEBHOOK_SECRET` in your `.env`.

### 6. Production Build

```bash
npm run build
npm run start
```

---

## Environment Variables

```env
# ─── Sanity CMS ────────────────────────────────────────────────────────────────
# Your Sanity project ID — found at sanity.io/manage
NEXT_PUBLIC_SANITY_PROJECT_ID=

# Dataset name (default: production)
NEXT_PUBLIC_SANITY_DATASET=production

# ─── Stripe ────────────────────────────────────────────────────────────────────
# Publishable key — safe to expose to the browser (pk_test_ or pk_live_)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Secret key — NEVER expose to the client (sk_test_ or sk_live_)
STRIPE_SECRET_KEY=

# Webhook signing secret — from Stripe Dashboard or `stripe listen` CLI output
STRIPE_WEBHOOK_SECRET=

# ─── Application ───────────────────────────────────────────────────────────────
# Full canonical URL — used in Stripe redirect URLs and email links (no trailing slash)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ─── Database (Neon PostgreSQL) ────────────────────────────────────────────────
# Connection string from your Neon project dashboard
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require

# ─── NextAuth v5 (Auth.js) ─────────────────────────────────────────────────────
# Random secret: openssl rand -base64 32
AUTH_SECRET=

# Canonical URL of your app (same as NEXT_PUBLIC_BASE_URL)
AUTH_URL=http://localhost:3000

# ─── Google OAuth ──────────────────────────────────────────────────────────────
# From Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ─── Resend (Transactional Email) ──────────────────────────────────────────────
# API key from resend.com/api-keys
RESEND_API_KEY=

# Verified sender address — must be a domain verified in your Resend account
RESEND_FROM_EMAIL=orders@yourdomain.com
```

> **Security:** `NEXT_PUBLIC_` variables are inlined into the client bundle at build time. Never prefix secret keys or tokens with `NEXT_PUBLIC_`. The Stripe secret key and webhook secret are server-only and must remain in server-side environment variables.

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js development server on port 3000 |
| `npm run build` | Generate Prisma client and create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint across the entire project |
| `npm run db:migrate` | Run Prisma migrations in development |
| `npm run db:push` | Push schema changes directly to the database (no migration history) |
| `npm run db:studio` | Open Prisma Studio — a browser-based database GUI |

---

## Page Routes

| Route | Description | Auth | ISR |
|---|---|---|---|
| `/` | Homepage — hero section and featured products | — | 60s |
| `/products` | Full product catalog grid | — | 60s |
| `/categories` | Category browser with cover images | — | 300s |
| `/categories/[category]` | Products filtered by category | — | 60s |
| `/product/[slug]` | Product detail — gallery, description, add to cart | — | 60s |
| `/newest` | Latest arrivals with "New" badge | — | 120s |
| `/cart` | Full cart review page | — | — |
| `/stripe/success` | Order confirmation with confetti | — | — |
| `/stripe/error` | Payment failure with recovery options | — | — |
| `/login` | Email/password login + Google OAuth | — | — |
| `/register` | Account registration | — | — |
| `/forgot-password` | Password reset request | — | — |
| `/account` | Account dashboard | Required | — |
| `/account/orders` | Order history | Required | — |
| `/account/orders/[orderId]` | Individual order detail | Required | — |
| `/account/profile` | Profile management | Required | — |
| `/account/addresses` | Saved shipping addresses | Required | — |

Dynamic product routes (`/product/[slug]`) use `generateStaticParams()` to pre-render every product page at build time.

---

## Data Layer

### Sanity CMS

All Sanity reads live in `src/lib/sanity/queries.ts` as typed async functions. Each call passes `next: { revalidate }` directly to fetch for ISR — no caching library required.

```typescript
getAllProducts()                    // → ProductSummary[]   revalidates every 60s
getNewestProducts(limit)            // → ProductSummary[]   revalidates every 120s
getProductBySlug(slug)              // → Product | null     revalidates every 60s
getAllProductSlugs()                 // → { slug: string }[] used by generateStaticParams
getAllCategories()                   // → Category[]         revalidates every 300s
getProductsByCategory(categoryName) // → ProductSummary[]   revalidates every 60s
```

Shared GROQ projection strings (`PRODUCT_SUMMARY_PROJECTION`, `PRODUCT_DETAIL_PROJECTION`) are defined once in the queries file — the single source of truth for field selection. This ensures queries never over-fetch and that field additions are made in one place.

The `urlFor()` helper from `src/lib/sanity/client.ts` resolves Sanity image asset references to CDN URLs server-side — no client-side URL building.

### DummyJSON Fallback

`src/lib/api/queries.ts` is a drop-in adapter over the DummyJSON public API that implements the **exact same function signatures** as the Sanity queries. Any page can switch between data sources without any component changes.

---

## Authentication

Authentication is handled by **NextAuth v5 (Auth.js)** with `@auth/prisma-adapter` persisting sessions and accounts to the Neon PostgreSQL database.

### Providers

- **Credentials** — email + bcrypt-validated password, stored in `User.passwordHash`
- **Google OAuth** — standard OAuth 2.0 flow; account linked to User via the `Account` model

### Session Shape

The JWT and session are augmented with `id` and `role` via NextAuth callbacks:

```typescript
// src/types/auth.ts
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole; // "CUSTOMER" | "ADMIN"
    } & DefaultSession["user"];
  }
}
```

### Registration Flow

```
register() Server Action
  → Validate inputs
  → Check for existing email
  → bcrypt.hash(password, 12)
  → db.user.create({ name, email, passwordHash })
  → sendWelcomeEmail() [non-blocking, won't fail the registration]
  → signIn("credentials", { redirectTo: "/" })
```

### Login Flow

```
login() Server Action → signIn("credentials", ...)
  → NextAuth calls authorize() → db.user.findUnique by email
  → bcrypt.compare(password, passwordHash)
  → JWT issued: { id, role, name, email, image }
  → Session available via auth() server-side or useSession() client-side
```

Errors from `AuthError` are mapped to user-facing messages before being returned from the Server Action — the form never sees raw NextAuth errors.

---

## Payments & Order Flow

### Checkout

The cart (managed by `use-shopping-cart`) collects Stripe `price_id` values from each product. On checkout, the cart calls `POST /api/checkout` with the line items:

```
POST /api/checkout  { items: [{ price_id, quantity }] }
  → Stripe verifies prices server-side (client values are ignored)
  → Stripe Checkout session created with success_url and cancel_url
  → Response: { url: "https://checkout.stripe.com/pay/cs_..." }
  → Client redirects to Stripe hosted page
```

### Webhook

On payment success, Stripe calls `POST /api/webhooks/stripe`:

```
Stripe sends checkout.session.completed event
  → Validate Stripe-Signature header against STRIPE_WEBHOOK_SECRET
  → Idempotency check: look for existing order with this stripeSessionId
  → Retrieve full session with expand: ["line_items.data.price.product"]
  → db.order.create() with all items, amounts, customer info, shipping address
  → sendOrderConfirmationEmail() [non-blocking]
  → Return 200 OK
```

The idempotency check means replayed webhooks (Stripe retries on non-2xx) never create duplicate orders.

### Order Lifecycle

```
PENDING → PROCESSING → SHIPPED → DELIVERED
                                    ↘ REFUNDED
                              ↘ CANCELLED
```

### Success Page

After redirect to `/stripe/success?session_id=...`, the page calls `GET /api/orders/by-session/[sessionId]` to display the completed order and fires the confetti animation.

---

## Email Notifications

Email is delivered via **[Resend](https://resend.com/)** using **React Email** templates stored in `src/lib/email/templates/`.

| Template | Trigger | File |
|---|---|---|
| `WelcomeEmail` | User registers | `register()` Server Action (non-blocking) |
| `OrderConfirmation` | Payment webhook received | `POST /api/webhooks/stripe` (non-blocking) |

Both sends are wrapped in `.catch(console.error)` — a failed email never blocks the primary operation (registration or order creation).

Templates are standard React components using `@react-email/components` — they're version-controlled, fully typed, and renderable as HTML via `@react-email/render`.

---

## API Reference

All API routes are under `src/app/api/`. Protected routes use `auth()` from `src/lib/auth.ts`.

### `POST /api/checkout`

Creates a Stripe Checkout session.

| Detail | Value |
|---|---|
| Auth | Optional (guests allowed; authenticated users get `customer_email` pre-filled) |
| Body | `{ items: Array<{ price_id: string; quantity: number }> }` |
| Response | `{ url: string }` — Stripe hosted checkout URL |

### `POST /api/webhooks/stripe`

Stripe event handler. Validates `Stripe-Signature` header before processing.

Processes: `checkout.session.completed`

### `GET /api/orders`

Returns the authenticated user's full order history with nested items, ordered by `createdAt` descending.

| Detail | Value |
|---|---|
| Auth | Required |
| Response | `Order[]` with nested `OrderItem[]` |

### `GET /api/orders/[orderId]`

Returns a single order by database ID, scoped to the authenticated user.

### `GET /api/orders/by-session/[sessionId]`

Looks up an order by Stripe `checkout.session.id`. Used by the success page immediately after checkout.

---

## Performance

| Optimization | Implementation |
|---|---|
| **ISR per route** | `next: { revalidate }` on every Sanity fetch — pages update without redeployment |
| **Build-time pre-rendering** | `generateStaticParams()` on `/product/[slug]` — every product page is pre-built at deploy time |
| **Server components by default** | Data fetching is on the server; zero-bundle-cost for queries and data transformation |
| **Leaf-node client boundaries** | `"use client"` only on interactive leaves (cart, forms, theme toggle) |
| **Efficient GROQ projections** | Queries fetch only the fields their consumers use — no full documents over the wire |
| **Next.js Image** | Automatic WebP/AVIF conversion, lazy loading, responsive `sizes` attributes |
| **Neon serverless driver** | `@neondatabase/serverless` uses WebSockets — avoids TCP cold-start overhead in serverless |
| **Prisma singleton** | Connection reused across hot reloads in development; no connection pool exhaustion |
| **Font optimization** | Inter loaded via `next/font/google` with `display: swap` — no FOUT, self-hosted |

---

## Security

### HTTP Headers (global, via `next.config.mjs`)

| Header | Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Blocks iframe embedding — clickjacking protection |
| `X-XSS-Protection` | `1; mode=block` | XSS filtering in legacy browsers |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls cross-origin referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables sensitive browser APIs |

### Application Security

- Passwords hashed with bcrypt at cost factor 12 — never stored in plain text
- Stripe handles all card data on its PCI-compliant hosted page — raw card numbers never reach the application
- Stripe webhook signature validated before any database writes
- Server Actions for auth mutations — credential validation runs entirely on the server
- Only `NEXT_PUBLIC_` keys (non-secret) are accessible in the browser
- Product prices resolved server-side by Stripe from `price_id` — client-submitted amounts are ignored

---

## Screenshots

> Add screenshots to `public/screenshots/` and update the paths below.

**Homepage — Hero & Featured Products**
![Homepage](public/screenshots/homepage.png)

**Product Catalog**
![Products](public/screenshots/products.png)

**Product Detail**
![Product Detail](public/screenshots/product-detail.png)

**Cart Drawer**
![Cart](public/screenshots/cart.png)

**Order Confirmation**
![Success](public/screenshots/success.png)

**Order History**
![Orders](public/screenshots/orders.png)

**Dark Mode**
![Dark Mode](public/screenshots/dark-mode.png)

**Mobile View**
![Mobile](public/screenshots/mobile.png)

---

## Deployment

### Vercel (Recommended)

Vercel provides zero-configuration Next.js hosting with automatic ISR and global edge caching.

1. Push the repository to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables in the Vercel dashboard
4. Set `NEXT_PUBLIC_BASE_URL` to your production domain (e.g., `https://shopoholics.vercel.app`)
5. Deploy

```bash
# Or via CLI
npm i -g vercel && vercel
```

### Stripe Webhook (Production)

In the Stripe Dashboard, create a webhook endpoint:

```
https://your-domain.com/api/webhooks/stripe
```

Subscribe to `checkout.session.completed`. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

### Database

After provisioning your Neon database, run migrations before the first deploy:

```bash
npx prisma migrate deploy
```

### Other Platforms

Any platform with Node.js 18+ support can host this app:

```bash
npm run build
npm run start  # Listens on $PORT, defaults to 3000
```

> Ensure all environment variables are set **before** running the build. `NEXT_PUBLIC_*` values are inlined at build time — setting them after the build has no effect.

---

## Developer Notes

### Key Conventions

| Convention | Where |
|---|---|
| `cn()` for all class composition | Every component — prevents Tailwind class conflicts via tailwind-merge |
| Monetary values in cents | All `Order` and `OrderItem` DB fields (`totalCents`, `priceCents`, etc.) |
| Server Actions for mutations | `features/auth/actions/auth.actions.ts` — no API routes needed for form submissions |
| GROQ projection constants | `src/lib/sanity/queries.ts` — define once, reuse in every related query |
| Feature-domain imports | Components import from their own feature; shared UI comes from `@/components/ui/` |

### Adding a New Page

1. Create `src/app/(shop)/your-route/page.tsx` as an async server component
2. Call the relevant query from `src/lib/sanity/queries.ts` at the top
3. Add `loading.tsx` alongside it with a skeleton layout

### Adding a New Sanity Query

1. Define the TypeScript return type in `src/types/index.ts`
2. Add a GROQ projection constant and async function in `src/lib/sanity/queries.ts`
3. Call it directly in a server component — no API route required

### Adding a shadcn/ui Component

```bash
npx shadcn-ui@latest add <component-name>
```

Components land in `src/components/ui/` with full source ownership.

### Path Aliases

| Alias | Resolves To |
|---|---|
| `@/*` | `src/*` |
| `@src/*` | `src/*` |
| `@components/*` | `components/*` (root-level) |
| `@public/*` | `public/*` |

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Make your changes — keep commits focused and atomic
4. Verify TypeScript compiles cleanly: `npx tsc --noEmit`
5. Run the linter: `npm run lint`
6. Open a pull request against `master` with a clear description of what changed and why

### Code Standards

- TypeScript strict mode is enforced — no `any`, no `@ts-ignore`
- New components belong in the appropriate feature folder or `src/components/ui/`
- All class names composed with `cn()` — never raw string concatenation
- New data-fetching logic belongs in `src/lib/sanity/queries.ts` with a typed return shape
- Secrets must never be committed — `.env` is gitignored, use `.env.example` for documentation

---

## License

This project is licensed under the **MIT License** — free to use, modify, and distribute for personal and commercial purposes.

See the [LICENSE](LICENSE) file for full details.

---

<div align="center">

Built with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), [Sanity](https://www.sanity.io/), [Stripe](https://stripe.com/), and [Resend](https://resend.com/)

**[Back to top](#shopoholics)**

</div>
