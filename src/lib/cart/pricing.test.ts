import { describe, it, expect } from "vitest";
import {
  KOBO_PER_NAIRA,
  FREE_SHIPPING_THRESHOLD_KOBO,
  STANDARD_SHIPPING_KOBO,
  normalizePromoCode,
  findPromo,
  computeCartTotals,
} from "./pricing";

// Amounts are in kobo. Helper keeps the test copy readable in Naira.
const naira = (n: number) => n * KOBO_PER_NAIRA;

describe("normalizePromoCode", () => {
  it("trims and upper-cases", () => {
    expect(normalizePromoCode("  welcome10 ")).toBe("WELCOME10");
  });

  it("treats null/undefined as empty", () => {
    expect(normalizePromoCode(null)).toBe("");
    expect(normalizePromoCode(undefined)).toBe("");
  });
});

describe("findPromo", () => {
  it("matches a known code case-insensitively", () => {
    expect(findPromo("welcome10")?.code).toBe("WELCOME10");
  });

  it("returns null for an empty or unknown code", () => {
    expect(findPromo("")).toBeNull();
    expect(findPromo("NOPE")).toBeNull();
  });
});

describe("computeCartTotals", () => {
  it("charges standard shipping and no discount with no code", () => {
    const t = computeCartTotals(naira(30_000));
    expect(t.promoStatus).toBe("none");
    expect(t.discountKobo).toBe(0);
    expect(t.shippingKobo).toBe(STANDARD_SHIPPING_KOBO);
    expect(t.totalKobo).toBe(naira(30_000) + STANDARD_SHIPPING_KOBO);
  });

  it("clamps a negative subtotal to zero and ships free at zero", () => {
    const t = computeCartTotals(-500);
    expect(t.subtotalKobo).toBe(0);
    expect(t.qualifiesForFreeShipping).toBe(true);
    expect(t.shippingKobo).toBe(0);
  });

  it("rounds a fractional subtotal", () => {
    expect(computeCartTotals(100.7).subtotalKobo).toBe(101);
  });

  it("applies WELCOME10 as 10% off above its minimum", () => {
    const t = computeCartTotals(naira(30_000), "welcome10");
    expect(t.promoStatus).toBe("applied");
    expect(t.discountKobo).toBe(naira(3_000));
  });

  it("caps WELCOME10 at its maximum discount", () => {
    // 10% of ₦1,000,000 = ₦100,000, but the cap is ₦50,000.
    const t = computeCartTotals(naira(1_000_000), "WELCOME10");
    expect(t.discountKobo).toBe(naira(50_000));
  });

  it("reports below-minimum for a valid code on too-small a basket", () => {
    const t = computeCartTotals(naira(10_000), "WELCOME10");
    expect(t.promoStatus).toBe("below-minimum");
    expect(t.discountKobo).toBe(0);
  });

  it("applies SHOPO5000 as a fixed amount", () => {
    const t = computeCartTotals(naira(60_000), "SHOPO5000");
    expect(t.promoStatus).toBe("applied");
    expect(t.discountKobo).toBe(naira(5_000));
  });

  it("reports unknown for a non-existent code", () => {
    const t = computeCartTotals(naira(60_000), "BOGUS");
    expect(t.promoStatus).toBe("unknown");
    expect(t.discountKobo).toBe(0);
  });

  it("waives shipping with FREESHIP without discounting goods", () => {
    const t = computeCartTotals(naira(10_000), "FREESHIP");
    expect(t.promoStatus).toBe("applied");
    expect(t.discountKobo).toBe(0);
    expect(t.shippingKobo).toBe(0);
    expect(t.qualifiesForFreeShipping).toBe(true);
  });

  it("ships free by value at the threshold", () => {
    const t = computeCartTotals(FREE_SHIPPING_THRESHOLD_KOBO);
    expect(t.qualifiesForFreeShipping).toBe(true);
    expect(t.shippingKobo).toBe(0);
    expect(t.freeShippingRemainingKobo).toBe(0);
  });

  it("reports the exact kobo remaining just under the threshold", () => {
    const t = computeCartTotals(FREE_SHIPPING_THRESHOLD_KOBO - 1);
    expect(t.qualifiesForFreeShipping).toBe(false);
    expect(t.shippingKobo).toBe(STANDARD_SHIPPING_KOBO);
    expect(t.freeShippingRemainingKobo).toBe(1);
  });

  it("lets a discount push an order back under the free-shipping bar", () => {
    // ₦155,000 qualifies by value, but WELCOME10 knocks ₦15,500 off,
    // dropping the goods to ₦139,500 — back below the ₦150,000 bar.
    const t = computeCartTotals(naira(155_000), "WELCOME10");
    expect(t.promoStatus).toBe("applied");
    expect(t.discountKobo).toBe(naira(15_500));
    expect(t.qualifiesForFreeShipping).toBe(false);
    expect(t.shippingKobo).toBe(STANDARD_SHIPPING_KOBO);
  });

  it("keeps the total equal to discounted goods plus shipping", () => {
    const t = computeCartTotals(naira(60_000), "SHOPO5000");
    expect(t.totalKobo).toBe(
      t.subtotalKobo - t.discountKobo + t.shippingKobo
    );
  });
});
