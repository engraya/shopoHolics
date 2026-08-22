"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/features/cart/context/CartContext";

/**
 * The single owner of checkout initiation — CheckoutButton (signed-in path)
 * and CheckoutGateDialog (guest path) both call this, so the request payload
 * exists in exactly one place.
 *
 * Note we send ids, quantities and a promo code only — the server re-resolves
 * every price and re-derives the discount from `@/lib/cart/pricing`.
 */
export function useStartCheckout() {
  const { cartDetails, promoCode } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  async function startCheckout(customerEmail: string) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerEmail,
          promoCode: promoCode || undefined,
          items: Object.values(cartDetails).map((entry) => ({
            id: entry.id,
            quantity: entry.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.authorization_url) {
        toast.error(data.error ?? "Could not start checkout. Please try again.");
        setIsLoading(false);
        return;
      }

      // Deliberately not clearing the cart here — an abandoned payment should
      // leave it intact. The success page clears it once payment is confirmed.
      window.location.href = data.authorization_url;
    } catch {
      toast.error("Could not reach the payment service. Please try again.");
      setIsLoading(false);
    }
  }

  return { startCheckout, isLoading };
}
