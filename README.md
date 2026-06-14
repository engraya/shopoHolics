<div align="center">

# 🛍️ Shopoholics

### A modern, production-grade e-commerce storefront built for performance, scalability, and great developer experience.

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Sanity](https://img.shields.io/badge/Sanity-CMS-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)](https://www.sanity.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

> Built with the App Router, headless CMS, Stripe Checkout, dark mode, and full TypeScript — production-ready from day one.

<br/>

[Live Demo](#) · [Report Bug](https://github.com/Engraya/shopoholics/issues) · [Request Feature](https://github.com/Engraya/shopoholics/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Page Routes](#-page-routes)
- [Data Layer — Sanity CMS](#-data-layer--sanity-cms)
- [Payment Flow — Stripe](#-payment-flow--stripe)
- [Performance Optimizations](#-performance-optimizations)
- [Security](#-security)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Developer Notes](#-developer-notes)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧭 Overview

**Shopoholics** is a full-stack e-commerce storefront built with **Next.js 14 App Router**, designed to deliver a fast, accessible, and polished shopping experience. It uses **Sanity** as a headless CMS for structured product and category management, and **Stripe** for secure payment processing — all wrapped in a fully type-safe TypeScript codebase with a dark-mode-ready UI.

### The Problem It Solves

Most e-commerce templates are either too opinionated and hard to extend, or too bare-bones for production use. Shopoholics bridges that gap — it's a clean, well-structured starting point that handles the hard parts (CMS integration, Stripe checkout, image optimization, ISR, loading/error states, dark mode, accessibility) while remaining easy to customize and scale.

### Who It's For

- **Developers** building a real store and needing a production-ready foundation
- **Freelancers** looking for a clean client-deliverable template
- **Portfolio projects** that need to impress with both design and engineering quality
- **Businesses** wanting a fast, SEO-friendly, and maintainable storefront

---

## ✨ Features

### 🛒 Core Commerce
- Browse products across a responsive grid (2 → 3 → 4 columns on mobile → tablet → desktop)
- Category-based filtering with dedicated category pages and breadcrumb navigation
- Full product detail pages with multi-image gallery and thumbnail carousel
- New arrivals section with "New" badge indicators
- Persistent shopping cart powered by `use-shopping-cart`
- Dedicated full-page cart view with quantity controls and live order summary
- Stripe Checkout integration with success and error recovery pages

### 🎨 UI & Design
- Clean, modern interface built on **shadcn/ui** and **Radix UI** primitives
- Dark / Light / System theme switching with persistent preference via `next-themes`
- Smooth hover and transition animations throughout
- Skeleton loading screens for perceived performance on every route
- Slide-out cart drawer accessible from any page
- Confetti celebration animation on successful purchase
- Toast notifications via **Sonner**

### ⚡ Performance
- Incremental Static Regeneration (ISR) with per-route revalidation windows (60–300s)
- `generateStaticParams` for pre-built product pages at build time — zero cold starts
- Next.js Image optimization with Sanity CDN remote patterns
- Responsive `sizes` attributes for efficient srcset generation
- Zero layout shift with skeleton placeholders during data fetches

### 🔒 Accessibility & Standards
- Radix UI primitives provide full ARIA compliance and keyboard navigation out of the box
- Semantic HTML throughout all page components
- Focus management handled automatically by Radix on modal/drawer interactions

### 🧑‍💻 Developer Experience
- Strict TypeScript — zero `any`, zero compiler errors
- Clean feature-based folder structure (`src/features/`) for long-term scalability
- Centralized GROQ queries with typed return projections
- Path aliases (`@/*`, `@components/*`) for clean, refactor-friendly imports
- `shadcn/ui` `components.json` for frictionless component additions via CLI
- `.env.example` for instant developer onboarding

### 🔐 Security
- Strict HTTP security headers applied globally in `next.config.mjs`
- No secrets exposed to the client (only `NEXT_PUBLIC_` keys)
- Stripe Checkout is hosted — no raw card data ever touches the application
- Permissions Policy that disables camera, microphone, and geolocation browser APIs

---

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Full-stack React framework, SSR / ISR / SSG |
| **Language** | TypeScript 5 (strict) | Type safety across the entire codebase |
| **Styling** | Tailwind CSS 3 | Utility-first responsive styling |
| **UI Components** | shadcn/ui + Radix UI | Accessible, composable component primitives |
| **Icons** | Lucide React | Clean, consistent icon set |
| **Theme** | next-themes | System-aware dark/light/system mode |
| **Animations** | tailwindcss-animate + canvas-confetti | UI transitions and post-purchase celebration |
| **Notifications** | Sonner | Lightweight, beautiful toast system |
| **CMS** | Sanity (headless) | Structured content for products and categories |
| **CMS Client** | next-sanity + @sanity/image-url | ISR-aware Sanity client with image URL builder |
| **Payments** | Stripe + use-shopping-cart | Hosted Stripe Checkout and cart state management |
| **Cart State** | use-shopping-cart | Client-side cart with localStorage persistence |
| **Class Utilities** | clsx + tailwind-merge + class-variance-authority | Safe, conflict-free className composition |
| **Deployment** | Vercel (recommended) | Edge-optimized Next.js hosting |

---

## 📁 Project Architecture

```
shopoHolics/
│
├── src/
│   ├── app/                          # Next.js App Router (pages & layouts)
│   │   ├── layout.tsx                # Root layout — fonts, providers, metadata
│   │   ├── page.tsx                  # Homepage — hero, featured products, CTAs
│   │   ├── globals.css               # CSS variables, dark theme, Tailwind layers
│   │   ├── loading.tsx               # Global suspense skeleton
│   │   ├── error.tsx                 # Global error boundary
│   │   ├── not-found.tsx             # Custom 404 page
│   │   │
│   │   ├── products/
│   │   │   ├── page.tsx              # All products grid with sort control
│   │   │   └── loading.tsx           # Products skeleton loader
│   │   │
│   │   ├── categories/
│   │   │   ├── page.tsx              # Category browser with cover images
│   │   │   ├── [category]/page.tsx   # Products filtered by category
│   │   │   └── loading.tsx           # Categories skeleton loader
│   │   │
│   │   ├── product/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx          # Product detail — gallery, info, add to cart
│   │   │       └── not-found.tsx     # Product-specific 404 page
│   │   │
│   │   ├── newest/page.tsx           # New arrivals with "New" badges
│   │   ├── reviews/page.tsx          # Customer reviews and rating breakdown
│   │   ├── cart/page.tsx             # Full cart page with order summary sidebar
│   │   │
│   │   └── stripe/
│   │       ├── success/page.tsx      # Post-checkout success + confetti
│   │       └── error/page.tsx        # Payment failure with recovery options
│   │
│   ├── components/                   # Shared layout and UI components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Sticky nav — links, cart button, theme toggle
│   │   │   ├── Footer.tsx            # Footer with brand and navigation links
│   │   │   └── PageContainer.tsx     # Centered max-width content wrapper
│   │   │
│   │   ├── providers/
│   │   │   ├── ThemeProvider.tsx     # next-themes wrapper component
│   │   │   ├── ThemeToggler.tsx      # Light/Dark/System dropdown switcher
│   │   │   └── CartProvider.tsx      # use-shopping-cart configuration
│   │   │
│   │   └── ui/                       # shadcn/ui component library
│   │       ├── button.tsx            # 6 variants, 4 sizes
│   │       ├── sheet.tsx             # Slide-out drawer
│   │       ├── dropdown-menu.tsx     # Rich dropdown menu primitives
│   │       ├── badge.tsx             # Status/category labels
│   │       ├── skeleton.tsx          # Loading placeholder shapes
│   │       ├── input.tsx             # Form text input
│   │       ├── separator.tsx         # Horizontal/vertical divider
│   │       ├── Breadcrumb.tsx        # Navigation hierarchy
│   │       ├── EmptyState.tsx        # No-data UI with call-to-action
│   │       └── sonner.tsx            # Toast notification provider
│   │
│   ├── features/                     # Domain-specific feature modules
│   │   ├── products/
│   │   │   └── components/
│   │   │       ├── ProductCard.tsx           # Grid card — image, price, badge, CTA
│   │   │       ├── AddToCartButton.tsx       # Cart add handler with sheet trigger
│   │   │       ├── ImageGallery.tsx          # Main image + thumbnail carousel
│   │   │       └── LandingPageCollections.tsx # Hero image grid for homepage
│   │   │
│   │   └── cart/
│   │       └── components/
│   │           └── CartSheet.tsx     # Slide-out cart — items, quantities, checkout
│   │
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts             # Sanity client + image URL builder
│   │   │   └── queries.ts            # Typed GROQ queries with revalidation
│   │   └── utils.ts                  # cn(), formatPrice(), runFireworks()
│   │
│   └── types/
│       └── index.ts                  # Shared TypeScript interfaces
│
├── sanity/
│   └── sanity.config.ts             # Sanity Studio configuration
│
├── public/                           # Static assets
├── .env.example                      # Environment variable template
├── next.config.mjs                   # Security headers, image remote patterns
├── tailwind.config.ts                # Theme tokens, dark mode, animations
├── tsconfig.json                     # Strict TypeScript, path aliases
├── components.json                   # shadcn/ui CLI configuration
└── package.json
```

### Key Architectural Decisions

| Decision | Rationale |
|---|---|
| **Feature-based structure** (`src/features/`) | Co-locates components with their domain — scales cleanly without a bloated `components/` directory |
| **Centralized GROQ queries** (`src/lib/sanity/queries.ts`) | Single source of truth for all data fetching; typed projections prevent over-fetching |
| **ISR over static-only** | Allows content updates without redeployment while keeping pages fast and cacheable |
| **`use-shopping-cart`** | Official Stripe cart library — handles state, localStorage persistence, and checkout redirect |
| **shadcn/ui** | Copy-owned components: no black-box upgrades, full control over styling and behavior |
| **Server Components by default** | Data fetching happens at the server component level with `async/await` — no client-side fetch waterfalls |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.17.0
- **npm** >= 9 (or pnpm / yarn)
- A [Sanity](https://www.sanity.io/) account with a configured project and dataset
- A [Stripe](https://stripe.com/) account with products and a publishable key

### 1. Clone the Repository

```bash
git clone https://github.com/Engraya/shopoholics.git
cd shopoholics
```

### 2. Install Dependencies

```bash
npm install
```

> **Note:** This project uses `legacy-peer-deps=true` (set in `.npmrc`) to handle peer dependency compatibility across the current package ecosystem.

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Sanity and Stripe credentials (see [Environment Variables](#-environment-variables) below).

### 4. Set Up Sanity

If setting up a new Sanity project:

```bash
# Install the Sanity CLI
npm install -g @sanity/cli

# Initialize a project (from the sanity/ directory)
cd sanity
sanity init

# Deploy the Studio
sanity deploy
```

Your Sanity dataset should contain documents of type `product` and `category` with the fields expected by the GROQ queries in `src/lib/sanity/queries.ts`.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build

```bash
npm run build
npm run start
```

---

## 🔑 Environment Variables

Create a `.env.local` file at the project root:

```env
# ─── Sanity CMS ─────────────────────────────────────────────────────────────
# Your Sanity project ID — found at sanity.io/manage
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here

# Sanity dataset name (default: "production")
NEXT_PUBLIC_SANITY_DATASET=production

# ─── Stripe ──────────────────────────────────────────────────────────────────
# Stripe publishable key — starts with pk_test_ (dev) or pk_live_ (prod)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# ─── Application ─────────────────────────────────────────────────────────────
# Full base URL for Stripe redirect callbacks — no trailing slash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> **Security note:** All variables prefixed with `NEXT_PUBLIC_` are bundled into the client. Never expose your Stripe **secret key** or Sanity **write token** via a `NEXT_PUBLIC_` variable. Stripe payments run through hosted Checkout — no secret key is required on the client.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js development server on port 3000 |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint across the entire project |

---

## 🗺️ Page Routes

| Route | Description | Data Source | ISR Revalidation |
|---|---|---|---|
| `/` | Homepage — hero section and featured products | Sanity (4 products) | 60s |
| `/products` | Full product catalog grid with sort | Sanity (all products) | 60s |
| `/categories` | Category browser with cover images | Sanity | 300s |
| `/categories/[category]` | Products filtered by a specific category | Sanity | 60s |
| `/product/[slug]` | Product detail — gallery, description, add to cart | Sanity | 60s |
| `/newest` | Latest 4 products with "New" badge | Sanity | 120s |
| `/reviews` | Customer reviews and rating breakdown | Static | — |
| `/cart` | Full cart page with order summary | Client state | — |
| `/stripe/success` | Order confirmation with confetti animation | — | — |
| `/stripe/error` | Payment failure with retry and home options | — | — |

Dynamic product routes (`/product/[slug]`) use `generateStaticParams` to pre-render all product pages at build time.

---

## 🗄️ Data Layer — Sanity CMS

### Client

The Sanity client (`src/lib/sanity/client.ts`) is initialized with `next-sanity` and exports:

- **`client`** — ISR-aware client for server component data fetching with `{ next: { revalidate } }` options
- **`urlFor(source)`** — image URL builder that resolves Sanity asset references to CDN URLs

### GROQ Query Functions

All data-fetching logic is centralized in `src/lib/sanity/queries.ts` as typed async functions:

```typescript
getAllProducts()              // → ProductSummary[]   revalidates: 60s
getNewestProducts(limit)      // → ProductSummary[]   revalidates: 120s
getProductBySlug(slug)        // → Product | null     revalidates: 60s
getAllProductSlugs()           // → { slug: string }[] for generateStaticParams
getAllCategories()             // → Category[]         revalidates: 300s
getProductsByCategory(name)   // → ProductSummary[]   revalidates: 60s
```

Each query uses a typed GROQ projection that fetches only the fields required by its consumer — no over-fetching.

### Data Models

```typescript
interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  price_id: string         // Stripe Price ID used for checkout
  categoryName: string
  images: SanityImage[]    // Full images array for gallery
}

interface ProductSummary {
  _id: string
  name: string
  slug: string
  price: number
  price_id: string
  categoryName: string
  imageUrl: string         // Pre-resolved CDN URL (no client-side resolution needed)
}

interface Category {
  _id: string
  name: string
  imageUrl: string
}
```

---

## 💳 Payment Flow — Stripe

Shopoholics uses **Stripe Checkout** (hosted) via the official `use-shopping-cart` library. The full flow:

```
User adds item to cart
        ↓
Cart state updated in memory + persisted to localStorage
        ↓
User opens CartSheet → reviews items, adjusts quantities
        ↓
User clicks "Checkout" → use-shopping-cart calls redirectToCheckout()
        ↓
Browser redirects to Stripe-hosted payment page
        ↓
     Payment succeeds → redirect to /stripe/success → cart cleared + confetti
     Payment fails    → redirect to /stripe/error  → recovery options shown
```

**Cart features:**
- Real-time item count badge in the Navbar
- Quantity increment / decrement per item
- Individual item removal
- Formatted subtotal display via `Intl.NumberFormat`
- Auto-persists across page reloads via localStorage

Each product carries a Stripe `price_id`. Stripe resolves the canonical price server-side — client-submitted price values are ignored, preventing price tampering.

---

## ⚡ Performance Optimizations

| Optimization | How It's Implemented |
|---|---|
| **Incremental Static Regeneration** | Per-route `revalidate` values (60–300s) — pages stay cached between deploys and update automatically |
| **Build-time pre-rendering** | `generateStaticParams` on `/product/[slug]` ensures every product page is pre-built — no SSR cold starts |
| **Next.js Image** | Automatic WebP/AVIF conversion, lazy loading by default, and responsive `sizes` for efficient bandwidth |
| **Sanity CDN** | Images served from Sanity's global CDN with on-the-fly resizing via URL parameters |
| **Skeleton loaders** | Per-route `loading.tsx` files using Skeleton components prevent layout shift during data fetches |
| **Automatic code splitting** | App Router splits JavaScript per route — users only load code for pages they visit |
| **Efficient GROQ projections** | Queries fetch only required fields — no full documents transferred over the wire |

---

## 🔐 Security

The following HTTP security headers are applied globally via `next.config.mjs`:

| Header | Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks |
| `X-Frame-Options` | `DENY` | Blocks the site from being embedded in iframes (clickjacking protection) |
| `X-XSS-Protection` | `1; mode=block` | Enables XSS filtering in legacy browsers |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls how much referrer information is sent cross-origin |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables sensitive browser APIs not required by the app |

**Additional security measures:**
- Stripe handles all card data on its own PCI-compliant hosted page — the app never sees raw card numbers
- Product prices are validated server-side by Stripe — client-submitted values are disregarded
- Only `NEXT_PUBLIC_` (non-secret) keys are used on the client side

---

## 📸 Screenshots

> Add screenshots to `public/screenshots/` and update the paths below.

### Homepage
![Homepage](public/screenshots/homepage.png)

### Product Catalog
![Products Grid](public/screenshots/products.png)

### Product Detail Page
![Product Detail](public/screenshots/product-detail.png)

### Shopping Cart
![Cart Drawer](public/screenshots/cart.png)

### Dark Mode
![Dark Mode](public/screenshots/dark-mode.png)

### Mobile View
![Mobile](public/screenshots/mobile.png)

### Order Confirmation
![Success Page](public/screenshots/success.png)

---

## 🚢 Deployment

### Vercel (Recommended)

Shopoholics is optimized for Vercel — zero-configuration deployment for Next.js with automatic ISR and edge caching.

1. Push the repository to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add all `NEXT_PUBLIC_*` environment variables in the Vercel dashboard
4. Click **Deploy** — Vercel handles builds, ISR revalidation, and CDN automatically

```bash
# Or deploy directly from the terminal
npm install -g vercel
vercel
```

### Other Platforms

Any platform with Node.js 18+ support can serve this app:

```bash
npm run build   # Output to .next/
npm run start   # Serve on $PORT (default: 3000)
```

Ensure all environment variables are configured in your platform's environment settings **before running the build** — `NEXT_PUBLIC_*` values are inlined at build time.

---

## 🧑‍💻 Developer Notes

### Key Patterns

| Pattern | Where Used |
|---|---|
| **Server Components** | All page-level data fetching with `async/await` — no `useEffect` waterfalls |
| **`cn()` for classNames** | Every component — `cn(clsx(...), tailwind-merge(...))` prevents Tailwind conflicts |
| **Typed GROQ projections** | Every query returns a named, typed shape — never raw `any` from the CMS |
| **Feature isolation** | `src/features/` — each domain owns its components; shared primitives live in `src/components/ui/` |

### Adding shadcn/ui Components

```bash
npx shadcn-ui@latest add <component-name>
```

Components land in `src/components/ui/` with full source ownership — customize freely.

### Adding a New Sanity Query

1. Define the TypeScript return type in `src/types/index.ts`
2. Write the GROQ query in `src/lib/sanity/queries.ts` with a `revalidate` option
3. Call it directly in a Server Component — no API routes needed

### Path Aliases Reference

| Alias | Resolves To |
|---|---|
| `@/*` | `src/*` |
| `@src/*` | `src/*` |
| `@components/*` | `components/*` |
| `@public/*` | `public/*` |

---

## 🗺️ Roadmap

Realistic improvements grounded in the current architecture:

- [ ] **Sanity Studio embedded** — serve the Studio at `/studio` for in-app content editing
- [ ] **Full-text search** — product search using Sanity's search API or Algolia
- [ ] **Authentication** — NextAuth.js for user accounts and session management
- [ ] **Order history** — Stripe webhook listener to persist completed orders
- [ ] **Wishlist** — server-persisted wishlist linked to user accounts
- [ ] **Real-time stock management** — stock levels synced from Sanity with sold-out states
- [ ] **Per-page SEO metadata** — `generateMetadata()` on product and category pages
- [ ] **Sitemap + robots.txt** — Next.js native sitemap generation for search indexing
- [ ] **Analytics** — Vercel Analytics or PostHog for pageview and conversion tracking
- [ ] **E2E test suite** — Playwright tests covering the core checkout flow

---

## 🤝 Contributing

Contributions are welcome. Please follow these steps:

1. **Fork** the repository
2. **Create a feature branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make your changes** — keep commits focused and atomic
4. **Lint before pushing:**
   ```bash
   npm run lint
   ```
5. **Open a Pull Request** against `master` with a clear description of what changed and why

### Code Standards

- TypeScript strict mode is enforced — no `any`, no `@ts-ignore`
- New components belong in the appropriate feature folder or `src/components/ui/`
- New data-fetching logic belongs in `src/lib/sanity/queries.ts` with a typed return shape
- Use `cn()` for all className composition — never raw string concatenation

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute for personal or commercial purposes.

See the [LICENSE](LICENSE) file for full details.

---

<div align="center">

Built with care using [Next.js](https://nextjs.org/), [Sanity](https://www.sanity.io/), and [Stripe](https://stripe.com/)

**[⬆ Back to top](#-shopoholics)**

</div>
