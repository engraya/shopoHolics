"use client";

import { type ReactNode } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/features/cart/context/CartContext";
import type { ProductSummary } from "@/types";
import { CartLineItem } from "./CartLineItem";
import { CartSkeleton } from "./CartSkeleton";
import { CartSummary } from "./CartSummary";
import { RecommendedRow } from "./RecommendedRow";
import { SavedForLater } from "./SavedForLater";

/**
 * Owns the cart page's layout and the hydration gate. `emptyState` arrives as
 * a prop rather than being rendered here so it can stay a server component —
 * its category chips would otherwise be shipped to the client for every
 * customer, including the ones whose cart isn't empty.
 */

interface CartViewProps {
  emptyState: ReactNode;
  recommendations: ProductSummary[];
}

export function CartView({ emptyState, recommendations }: CartViewProps) {
  const {
    cartDetails,
    cartCount,
    lineCount,
    totalPrice,
    clearCart,
    addItem,
    promoCode,
    setPromoCode,
    isHydrated,
  } = useCart();

  if (!isHydrated) return <CartSkeleton />;

  const isEmpty = lineCount === 0;

  function handleClear() {
    // `clearCart` also drops the promo code, so undo has to put both back.
    const snapshot = Object.values(cartDetails);
    const previousPromo = promoCode;
    clearCart();
    toast(`Cart cleared — ${snapshot.length} ${snapshot.length === 1 ? "item" : "items"} removed`, {
      action: {
        label: "Undo",
        onClick: () => {
          snapshot.forEach((entry) => addItem(entry, entry.quantity));
          if (previousPromo) setPromoCode(previousPromo);
        },
      },
    });
  }

  return (
    <>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">
        <div className="min-w-0">
          <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Shopping cart
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {isEmpty
                  ? "No items yet"
                  : `${cartCount} ${cartCount === 1 ? "item" : "items"} across ${lineCount} ${
                      lineCount === 1 ? "product" : "products"
                    }`}
              </p>
            </div>

            {!isEmpty && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Clear cart
              </button>
            )}
          </header>

          {isEmpty ? (
            emptyState
          ) : (
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <ul className="divide-y divide-border">
                {Object.values(cartDetails).map((entry) => (
                  <CartLineItem key={entry.id} entry={entry} />
                ))}
              </ul>

              {/* Mirrors the summary card's subtotal so the figure is visible
                  without scrolling back up on mobile. */}
              <div className="flex items-baseline justify-end gap-2 border-t border-border bg-muted/40 px-4 py-4 sm:px-6">
                <span className="text-sm text-muted-foreground">
                  Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"}):
                </span>
                <span className="font-mono text-lg font-bold tabular-nums text-foreground">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          )}

          <SavedForLater />
        </div>

        {!isEmpty && (
          <div className="mt-8 lg:mt-0">
            <CartSummary />
          </div>
        )}
      </div>

      <RecommendedRow products={recommendations} />
    </>
  );
}
