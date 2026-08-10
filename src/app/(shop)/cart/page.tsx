"use client";

import PageContainer from "@/components/layout/PageContainer"
import Link from "next/link"
import Image from "next/image";
import { useCart } from "@/features/cart/context/CartContext";
import { CheckoutButton } from "@/features/cart/components/CheckoutButton";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/EmptyState";
import { X } from "lucide-react";

export default function CartPage() {
  const {
    cartCount,
    cartDetails,
    removeItem,
    decrementItem,
    incrementItem,
    totalPrice,
    isHydrated,
  } = useCart();

  // Cart state only exists after localStorage is read.
  const count = isHydrated ? cartCount : 0;

  return (
    <PageContainer>
      <section>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-2">Your Cart</h1>
        <p className="text-sm text-muted-foreground mb-8">
          {count === 0 ? "No items" : `${count} ${count === 1 ? "item" : "items"}`}
        </p>

        {count === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Looks like you haven't added anything yet."
            actionLabel="Browse Products"
            actionHref="/products"
          />
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Items list */}
            <div className="lg:col-span-2">
              <ul className="divide-y divide-border">
                {Object.values(cartDetails ?? {}).map((entry) => (
                  <li key={entry.id} className="flex gap-4 py-6">
                    <div className="flex-shrink-0">
                      <Link href={`/product/${entry.id}`}>
                        <Image
                          src={entry.image as string}
                          className="h-24 w-24 rounded-lg object-cover bg-muted"
                          alt={entry.name}
                          height={96}
                          width={96}
                        />
                      </Link>
                    </div>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{entry.name}</p>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {formatPrice(entry.price)} each
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(entry.id)}
                          className="flex-shrink-0 p-1.5 rounded text-muted-foreground hover:text-destructive transition-colors"
                          aria-label={`Remove ${entry.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex h-8 items-stretch rounded-md overflow-hidden border border-border">
                          <button
                            onClick={() => decrementItem(entry.id)}
                            className="px-3 flex items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm transition-colors"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <div className="px-4 flex items-center justify-center bg-background text-sm font-medium text-foreground border-x border-border">
                            {entry.quantity}
                          </div>
                          <button
                            onClick={() => incrementItem(entry.id)}
                            className="px-3 flex items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {formatPrice(entry.quantity * entry.price)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order summary sidebar */}
            <div className="mt-8 lg:mt-0">
              <div className="rounded-lg border border-border bg-card p-6 space-y-4 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({count} {count === 1 ? "item" : "items"})</span>
                  <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{formatPrice(totalPrice)}</span>
                </div>
                <CheckoutButton className="w-full" size="lg" withArrow />
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageContainer>
  );
}
