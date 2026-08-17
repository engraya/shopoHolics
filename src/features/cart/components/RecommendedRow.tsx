"use client";

import { useMemo } from "react";
import ProductCard from "@/features/products/components/ProductCard";
import { useCart } from "@/features/cart/context/CartContext";
import type { ProductSummary } from "@/types";

/**
 * Recommendations are fetched on the server and filtered here, because
 * "what's already in the cart" only exists on the client. A horizontal
 * scroll-snap strip rather than a grid — it keeps the row from competing with
 * the cart itself for vertical space.
 */

interface RecommendedRowProps {
  products: ProductSummary[];
  limit?: number;
}

export function RecommendedRow({ products, limit = 8 }: RecommendedRowProps) {
  const { cartDetails, savedDetails, isHydrated } = useCart();

  const shortlist = useMemo(
    () =>
      products
        .filter((p) => !cartDetails[p.slug] && !savedDetails[p.slug])
        .slice(0, limit),
    [products, cartDetails, savedDetails, limit]
  );

  // Rendering before hydration would show items that are already in the cart,
  // then visibly drop them a tick later.
  if (!isHydrated || shortlist.length === 0) return null;

  return (
    <section aria-labelledby="recommended-heading" className="mt-12">
      <h2
        id="recommended-heading"
        className="text-lg font-semibold tracking-tight text-foreground"
      >
        You might also like
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Fresh arrivals picked from the catalogue.
      </p>

      <ul className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
        {shortlist.map((product) => (
          <li
            key={product._id}
            className="w-44 shrink-0 snap-start sm:w-52"
          >
            <ProductCard product={product} badgeLabel="" />
          </li>
        ))}
      </ul>
    </section>
  );
}
