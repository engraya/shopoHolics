"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/features/cart/context/CartContext";

/**
 * The single owner of checkout initiation — both CartSheet and /cart render
 * this, so the request payload exists in exactly one place. Paystack requires
 * a customer email on every transaction, so guests are asked for one inline.
 *
 * Note we send ids and quantities only; the server re-resolves every price.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GUEST_EMAIL_KEY = "shopoholics.guestEmail";

interface CheckoutButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg";
  withArrow?: boolean;
}

export function CheckoutButton({ className, size = "default", withArrow = false }: CheckoutButtonProps) {
  const { data: session } = useSession();
  const { cartDetails, cartCount } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [showEmailField, setShowEmailField] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const sessionEmail = session?.user?.email ?? null;

  async function startCheckout(customerEmail: string) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerEmail,
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

  function handleClick() {
    if (cartCount === 0) return;

    if (sessionEmail) {
      void startCheckout(sessionEmail);
      return;
    }

    if (!showEmailField) {
      setShowEmailField(true);
      try {
        const saved = window.localStorage.getItem(GUEST_EMAIL_KEY);
        if (saved) setEmail(saved);
      } catch {
        // storage unavailable — the field just starts empty
      }
    }
  }

  function handleGuestSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError(null);
    try {
      window.localStorage.setItem(GUEST_EMAIL_KEY, trimmed);
    } catch {
      // non-fatal
    }
    void startCheckout(trimmed);
  }

  if (showEmailField && !sessionEmail) {
    return (
      <form onSubmit={handleGuestSubmit} className="space-y-2">
        <label htmlFor="checkout-email" className="text-sm font-medium text-foreground">
          Email for your receipt
        </label>
        <Input
          id="checkout-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(null);
          }}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "checkout-email-error" : undefined}
        />
        {emailError && (
          <p id="checkout-email-error" role="alert" className="text-xs text-destructive">
            {emailError}
          </p>
        )}
        <Button type="submit" className={className} size={size} disabled={isLoading}>
          {isLoading ? "Redirecting…" : "Continue to Payment"}
        </Button>
      </form>
    );
  }

  return (
    <Button
      className={className}
      size={size}
      onClick={handleClick}
      disabled={isLoading || cartCount === 0}
    >
      {isLoading ? "Redirecting…" : "Checkout"}
      {withArrow && !isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  );
}
