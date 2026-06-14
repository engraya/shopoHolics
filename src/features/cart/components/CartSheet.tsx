"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useShoppingCart } from "use-shopping-cart";
import { useState } from "react";

export function CartSheet() {
  const {
    cartCount,
    cartDetails,
    removeItem,
    decrementItem,
    incrementItem,
    totalPrice,
  } = useShoppingCart();

  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckoutClick(event: React.MouseEvent) {
    event.preventDefault();
    if (!cartDetails || cartCount === 0) return;
    setIsLoading(true);
    try {
      const items = Object.values(cartDetails).map((entry) => ({
        name: entry.name,
        price: entry.price,
        currency: entry.currency ?? "USD",
        quantity: entry.quantity,
      }));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Cart with ${cartCount ?? 0} items`} className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartCount !== undefined && cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto max-h-screen flex flex-col">
        <SheetTitle className="flex items-center gap-2 mb-4">
          Shopping Cart
          {cartCount !== undefined && cartCount > 0 && (
            <Badge variant="secondary">{cartCount} {cartCount === 1 ? "item" : "items"}</Badge>
          )}
        </SheetTitle>

        <div className="flex-1 flex flex-col">
          {cartCount === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Add some products to get started"
              actionLabel="Browse Products"
              actionHref="/products"
            />
          ) : (
            <div className="space-y-4">
              {Object.values(cartDetails ?? {}).map((entry) => (
                <div key={entry.id} className="flex items-start gap-4 border-b border-border pb-4">
                  <Link href={`/product/${entry.id}`}>
                    <Image
                      src={entry.image as string}
                      className="h-20 w-20 flex-shrink-0 rounded-lg object-cover bg-muted"
                      alt={entry.name}
                      height={80}
                      width={80}
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <h6 className="text-sm font-semibold text-foreground line-clamp-2">{entry.name}</h6>
                    {entry.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {entry.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Qty:</span>
                      <button
                        onClick={() => decrementItem(entry.id)}
                        className="h-6 w-6 flex items-center justify-center rounded-l-md bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="h-6 px-2 flex items-center justify-center bg-muted text-sm font-medium">
                        {entry.quantity}
                      </span>
                      <button
                        onClick={() => incrementItem(entry.id)}
                        className="h-6 w-6 flex items-center justify-center rounded-r-md bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(entry.id)}
                        className="ml-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`Remove ${entry.name}`}
                      >
                        Remove
                      </button>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {formatPrice(entry.price * (entry.quantity ?? 1))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartCount !== undefined && cartCount > 0 && (
          <div className="mt-auto pt-4 space-y-3">
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-base font-semibold text-foreground">{formatPrice(totalPrice ?? 0)}</span>
            </div>
            <Button className="w-full" onClick={handleCheckoutClick} disabled={isLoading}>
              {isLoading ? "Redirecting…" : "Checkout"}
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
