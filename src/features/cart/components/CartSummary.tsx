"use client";

import Link from "next/link";
import { Lock, ShieldCheck, RotateCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatMinor } from "@/lib/utils";
import { useCart } from "@/features/cart/context/CartContext";
import { computeCartTotals, KOBO_PER_NAIRA, findPromo } from "@/lib/cart/pricing";
import { CheckoutButton } from "./CheckoutButton";
import { FreeShippingMeter } from "./FreeShippingMeter";
import { PromoCodeField } from "./PromoCodeField";

/**
 * Sticky on desktop, in-flow on mobile. Every figure below comes out of
 * `computeCartTotals` — the same function `/api/checkout` calls — so the total
 * shown here is the total Paystack will charge.
 */

const TRUST_POINTS = [
  { icon: Lock, text: "Encrypted checkout via Paystack" },
  { icon: ShieldCheck, text: "Card details never touch our servers" },
  { icon: RotateCcw, text: "7-day returns on every order" },
];

export function CartSummary() {
  const { cartCount, totalPrice, promoCode } = useCart();

  // Cart prices are whole Naira; the pricing module is kobo throughout.
  const totals = computeCartTotals(totalPrice * KOBO_PER_NAIRA, promoCode);
  const enteredPromo = findPromo(promoCode);

  return (
    <aside
      aria-labelledby="order-summary-heading"
      className="lg:sticky lg:top-24"
    >
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {/* Free-delivery meter reads as a banner rather than a summary row —
            it's an incentive, not an amount owed. */}
        <div className="border-b border-border bg-muted/40 p-5">
          <FreeShippingMeter
            progressKobo={totals.subtotalKobo - totals.discountKobo}
            remainingKobo={totals.freeShippingRemainingKobo}
            qualified={totals.qualifiesForFreeShipping}
          />
        </div>

        <div className="space-y-4 p-5">
          <h2 id="order-summary-heading" className="text-base font-semibold text-foreground">
            Order summary
          </h2>

          <dl className="space-y-2.5 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">
                Subtotal{" "}
                <span className="text-xs">
                  ({cartCount} {cartCount === 1 ? "item" : "items"})
                </span>
              </dt>
              <dd className="font-mono tabular-nums text-foreground">
                {formatMinor(totals.subtotalKobo)}
              </dd>
            </div>

            {totals.discountKobo > 0 && (
              <div className="flex items-baseline justify-between gap-4">
                <dt className="truncate text-success">{totals.promo?.label}</dt>
                <dd className="font-mono tabular-nums text-success">
                  −{formatMinor(totals.discountKobo)}
                </dd>
              </div>
            )}

            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="font-mono tabular-nums text-foreground">
                {totals.shippingKobo === 0 ? (
                  <span className="font-sans font-semibold uppercase tracking-wide text-success">
                    Free
                  </span>
                ) : (
                  formatMinor(totals.shippingKobo)
                )}
              </dd>
            </div>
          </dl>

          <Separator />

          <div className="flex items-baseline justify-between gap-4">
            <span className="text-base font-semibold text-foreground">Order total</span>
            <span className="font-mono text-2xl font-bold tabular-nums tracking-tight text-foreground">
              {formatMinor(totals.totalKobo)}
            </span>
          </div>

          <CheckoutButton className="w-full" size="lg" withArrow />

          <PromoCodeField
            status={totals.promoStatus}
            promoLabel={totals.promo?.label ?? null}
            discountKobo={totals.discountKobo}
            minSubtotalKobo={enteredPromo?.minSubtotalKobo ?? 0}
          />

          <Link
            href="/products"
            className="block rounded-md py-1 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            or continue shopping
          </Link>
        </div>

        <ul className="space-y-2 border-t border-border bg-muted/40 p-5">
          {TRUST_POINTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
