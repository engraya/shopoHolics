"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice, formatMinor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { computeCartTotals, KOBO_PER_NAIRA } from "@/lib/cart/pricing";
import { CheckoutButton } from "./CheckoutButton";
import { FreeShippingMeter } from "./FreeShippingMeter";
import { QuantityStepper } from "./QuantityStepper";

/**
 * The mini-cart. Deliberately a summary, not a second cart page — quantity and
 * removal only, with everything else (promo codes, save-for-later) living at
 * /cart. Totals come from the same `computeCartTotals` the full page uses.
 */
export function CartSheet() {
  const {
    cartCount,
    cartDetails,
    removeItem,
    decrementItem,
    incrementItem,
    totalPrice,
    promoCode,
    isCartOpen,
    setCartOpen,
    isHydrated,
  } = useCart();

  // Cart state only exists after localStorage is read, so the badge and totals
  // render as empty on the server pass to keep hydration consistent.
  const count = isHydrated ? cartCount : 0;
  const totals = computeCartTotals(totalPrice * KOBO_PER_NAIRA, promoCode);

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Cart with ${count} items`} className="relative">
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex max-h-screen flex-col overflow-y-auto">
        <SheetTitle className="mb-4 flex items-center gap-2">
          Shopping Cart
          {count > 0 && (
            <Badge variant="secondary">{count} {count === 1 ? "item" : "items"}</Badge>
          )}
        </SheetTitle>

        <div className="flex flex-1 flex-col">
          {count === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Add some products to get started"
              actionLabel="Browse Products"
              actionHref="/products"
            />
          ) : (
            <div className="space-y-4">
              <FreeShippingMeter
                progressKobo={totals.subtotalKobo - totals.discountKobo}
                remainingKobo={totals.freeShippingRemainingKobo}
                qualified={totals.qualifiesForFreeShipping}
                className="rounded-md border border-border bg-muted/40 p-3"
              />

              {Object.values(cartDetails).map((entry) => (
                <div key={entry.id} className="flex items-start gap-4 border-b border-border pb-4">
                  <Link
                    href={`/product/${entry.id}`}
                    onClick={() => setCartOpen(false)}
                    className="shrink-0 overflow-hidden rounded-lg bg-muted"
                  >
                    <Image
                      src={entry.image}
                      alt={entry.name}
                      className="h-20 w-20 object-cover"
                      height={80}
                      width={80}
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <h6 className="line-clamp-2 text-sm font-semibold text-foreground">
                      <Link href={`/product/${entry.id}`} onClick={() => setCartOpen(false)}>
                        {entry.name}
                      </Link>
                    </h6>
                    <p className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                      {formatPrice(entry.price)} each
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QuantityStepper
                        quantity={entry.quantity}
                        label={entry.name}
                        onIncrement={() => incrementItem(entry.id)}
                        onDecrement={() => decrementItem(entry.id)}
                        onRemove={() => removeItem(entry.id)}
                        className="scale-90 origin-left"
                      />
                      <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
                        {formatPrice(entry.price * entry.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {count > 0 && (
          <div className="mt-auto space-y-3 pt-4">
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-mono text-base font-semibold tabular-nums text-foreground">
                {formatMinor(totals.subtotalKobo)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Delivery{" "}
              {totals.shippingKobo === 0 ? (
                <span className="font-semibold text-success">free</span>
              ) : (
                <span className="font-mono">{formatMinor(totals.shippingKobo)}</span>
              )}{" "}
              · calculated in full at checkout
            </p>
            <CheckoutButton className="w-full" />
            <Button variant="outline" className="w-full" asChild>
              <Link href="/cart" onClick={() => setCartOpen(false)}>
                View cart &amp; edit
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
