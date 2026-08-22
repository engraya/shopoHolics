"use client";

import { useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/context/CartContext";
import { useStartCheckout } from "@/features/cart/hooks/useStartCheckout";

/**
 * Rendered by both CartSheet and /cart. Signed-in users go straight to
 * checkout; signed-out users get the CheckoutGateDialog, which lives in the
 * (shop) layout so it survives the cart sheet closing underneath it.
 */

interface CheckoutButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg";
  withArrow?: boolean;
}

export function CheckoutButton({
  className,
  size = "default",
  withArrow = false,
}: CheckoutButtonProps) {
  const { data: session, status } = useSession();
  const { cartCount, setCartOpen, setCheckoutGateOpen } = useCart();
  const { startCheckout, isLoading } = useStartCheckout();

  const sessionEmail = session?.user?.email ?? null;

  function handleClick() {
    if (cartCount === 0) return;

    if (sessionEmail) {
      void startCheckout(sessionEmail);
      return;
    }

    // Retire the mini-cart before opening the gate: two stacked Radix modals
    // fight over the focus trap, and the sheet has nothing left to offer here.
    setCartOpen(false);
    setCheckoutGateOpen(true);
  }

  return (
    <Button
      className={className}
      size={size}
      onClick={handleClick}
      disabled={isLoading || cartCount === 0 || status === "loading"}
    >
      {isLoading ? "Redirecting…" : "Proceed to checkout"}
      {withArrow && !isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  );
}
