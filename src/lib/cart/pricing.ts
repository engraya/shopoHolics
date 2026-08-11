/**
 * The single source of truth for cart arithmetic.
 *
 * Both the cart UI and `/api/checkout` import this module — that is the only
 * reason the number on the summary card and the number Paystack actually
 * charges cannot drift apart. Keep it dependency-free: it has to stay
 * importable from a client component and from a Node route handler alike, so
 * nothing here may reach for `node:crypto`, Prisma, or the DOM.
 *
 * Every amount is KOBO (integer minor units), matching the DB `*Cents` columns
 * and Paystack. Cart prices are whole Naira, so callers multiply by 100.
 */

export const KOBO_PER_NAIRA = 100;

/** Orders at or above this (after discount) ship free. */
export const FREE_SHIPPING_THRESHOLD_KOBO = 150_000 * KOBO_PER_NAIRA;
export const STANDARD_SHIPPING_KOBO = 4_500 * KOBO_PER_NAIRA;

export type PromoKind = "percent" | "fixed" | "freeship";

export interface Promo {
  code: string;
  kind: PromoKind;
  /** `percent`: whole percent off. `fixed`: kobo off. `freeship`: unused. */
  value: number;
  /** Shown on the summary row once the code is applied. */
  label: string;
  minSubtotalKobo: number;
  /** `percent` only — stops a large basket from discounting without bound. */
  maxDiscountKobo?: number;
}

/**
 * Hardcoded on purpose: promotions are a business rule, not user data, and
 * every code has to be verifiable server-side. Moving these to the DB later
 * only means swapping `findPromo` for an async lookup.
 */
const PROMOS: readonly Promo[] = [
  {
    code: "WELCOME10",
    kind: "percent",
    value: 10,
    label: "10% welcome discount",
    minSubtotalKobo: 20_000 * KOBO_PER_NAIRA,
    maxDiscountKobo: 50_000 * KOBO_PER_NAIRA,
  },
  {
    code: "SHOPO5000",
    kind: "fixed",
    value: 5_000 * KOBO_PER_NAIRA,
    label: "₦5,000 off",
    minSubtotalKobo: 50_000 * KOBO_PER_NAIRA,
  },
  {
    code: "FREESHIP",
    kind: "freeship",
    value: 0,
    label: "Free delivery",
    minSubtotalKobo: 0,
  },
];

export function normalizePromoCode(code: string | null | undefined): string {
  return (code ?? "").trim().toUpperCase();
}

export function findPromo(code: string | null | undefined): Promo | null {
  const normalized = normalizePromoCode(code);
  if (!normalized) return null;
  return PROMOS.find((p) => p.code === normalized) ?? null;
}

export type PromoStatus =
  /** No code entered. */
  | "none"
  /** Code matched and the discount is reflected in the totals. */
  | "applied"
  /** Code does not exist. */
  | "unknown"
  /** Code exists but the basket is too small for it. */
  | "below-minimum";

export interface CartTotals {
  subtotalKobo: number;
  discountKobo: number;
  shippingKobo: number;
  totalKobo: number;
  promo: Promo | null;
  promoStatus: PromoStatus;
  /** Kobo still needed to unlock free delivery; 0 once qualified. */
  freeShippingRemainingKobo: number;
  qualifiesForFreeShipping: boolean;
}

/**
 * Derives every money row on the summary card from the subtotal and an
 * optional promo code. Pure and total — an unknown or ineligible code degrades
 * to "no discount" rather than throwing, because this runs on the render path.
 */
export function computeCartTotals(
  subtotalKobo: number,
  code?: string | null
): CartTotals {
  const subtotal = Math.max(0, Math.round(subtotalKobo));

  const normalized = normalizePromoCode(code);
  const promo = findPromo(normalized);

  let promoStatus: PromoStatus = "none";
  if (normalized) {
    if (!promo) promoStatus = "unknown";
    else if (subtotal < promo.minSubtotalKobo) promoStatus = "below-minimum";
    else promoStatus = "applied";
  }

  const active = promoStatus === "applied" ? promo : null;

  let discount = 0;
  if (active?.kind === "percent") {
    discount = Math.round((subtotal * active.value) / 100);
    if (active.maxDiscountKobo !== undefined) {
      discount = Math.min(discount, active.maxDiscountKobo);
    }
  } else if (active?.kind === "fixed") {
    discount = active.value;
  }
  // Never let a discount exceed the basket — a negative total is unchargeable.
  discount = Math.min(discount, subtotal);

  const discountedSubtotal = subtotal - discount;

  // The threshold is measured against what the customer actually pays for
  // goods, so a discount can push an order back under the free-delivery bar.
  const qualifiesByValue = discountedSubtotal >= FREE_SHIPPING_THRESHOLD_KOBO;
  const qualifiesForFreeShipping =
    subtotal === 0 || qualifiesByValue || active?.kind === "freeship";

  const shipping = qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING_KOBO;

  return {
    subtotalKobo: subtotal,
    discountKobo: discount,
    shippingKobo: shipping,
    totalKobo: discountedSubtotal + shipping,
    promo: active,
    promoStatus,
    freeShippingRemainingKobo: Math.max(
      0,
      FREE_SHIPPING_THRESHOLD_KOBO - discountedSubtotal
    ),
    qualifiesForFreeShipping,
  };
}
