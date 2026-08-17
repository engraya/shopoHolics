"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/features/cart/context/CartContext";

/**
 * The shelf outlives checkout on purpose — items here were never bought, so
 * `clearCart` leaves them alone (see the CLEAR case in the cart reducer).
 */
export function SavedForLater() {
  const { savedDetails, savedCount, moveToCart, removeSaved } = useCart();

  if (savedCount === 0) return null;

  return (
    <section aria-labelledby="saved-heading" className="mt-8">
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-4 py-4 sm:px-6">
          <Bookmark className="h-4 w-4 text-primary" />
          <h2 id="saved-heading" className="text-base font-semibold text-foreground">
            Saved for later
          </h2>
          <span className="font-mono text-xs text-muted-foreground">({savedCount})</span>
        </div>

        <ul className="grid grid-cols-2 divide-border sm:grid-cols-3 lg:grid-cols-4">
          {Object.values(savedDetails).map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col gap-2 border-b border-r border-border p-4 last:border-r-0"
            >
              <Link
                href={`/product/${entry.id}`}
                className="overflow-hidden rounded-md bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={entry.image}
                  alt={entry.name}
                  width={200}
                  height={200}
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                  className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </Link>

              <h3 className="line-clamp-2 text-xs font-medium leading-snug text-foreground">
                <Link href={`/product/${entry.id}`} className="hover:text-primary">
                  {entry.name}
                </Link>
              </h3>

              <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
                {formatPrice(entry.price)}
              </p>

              <div className="mt-auto space-y-1.5 pt-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full text-xs"
                  onClick={() => moveToCart(entry.id)}
                >
                  Move to cart
                </Button>
                <button
                  type="button"
                  onClick={() => removeSaved(entry.id)}
                  className="w-full rounded-md py-1 text-xs text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
