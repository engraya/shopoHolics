"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ArrowRight, LogIn, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/features/cart/context/CartContext";

/**
 * The single owner of checkout initiation — both CartSheet and /cart render
 * this, so the request payload exists in exactly one place.
 *
 * Guests aren't blocked, they're *offered* an account: signing in is the
 * prominent path because it's what gets them order history, but the guest lane
 * stays open underneath it. Paystack requires a customer email on every
 * transaction either way, which is what the guest form collects.
 *
 * Note we send ids, quantities and a promo code only — the server re-resolves
 * every price and re-derives the discount from `@/lib/cart/pricing`.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GUEST_EMAIL_KEY = "shopoholics.guestEmail";

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
  const pathname = usePathname();
  const { cartDetails, cartCount, promoCode, setCartOpen } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [isGateOpen, setGateOpen] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const sessionEmail = session?.user?.email ?? null;
  // Send them back to whatever they were looking at, not a hardcoded /cart.
  const callbackUrl = pathname || "/cart";

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

  function handleClick() {
    if (cartCount === 0) return;

    if (sessionEmail) {
      void startCheckout(sessionEmail);
      return;
    }

    try {
      const saved = window.localStorage.getItem(GUEST_EMAIL_KEY);
      if (saved) setEmail(saved);
    } catch {
      // storage unavailable — the field just starts empty
    }
    // Retire the mini-cart before opening the gate: two stacked Radix modals
    // fight over the focus trap, and the sheet has nothing left to offer here.
    setCartOpen(false);
    setGateOpen(true);
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

  return (
    <>
      <Button
        className={className}
        size={size}
        onClick={handleClick}
        disabled={isLoading || cartCount === 0 || status === "loading"}
      >
        {isLoading ? "Redirecting…" : "Proceed to checkout"}
        {withArrow && !isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>

      <Dialog open={isGateOpen} onOpenChange={setGateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Almost there</DialogTitle>
            <DialogDescription>
              Sign in to save this order to your account, or check out as a guest.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button asChild className="w-full" size="lg">
              <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign in &amp; checkout
              </Link>
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              New here?{" "}
              <Link
                href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="font-medium text-primary hover:underline"
              >
                Create an account
              </Link>{" "}
              to track orders and reorder in one tap.
            </p>

            <div className="relative py-1">
              <div aria-hidden className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <span className="relative mx-auto block w-fit bg-background px-3 text-xs uppercase tracking-wide text-muted-foreground">
                or
              </span>
            </div>

            {showGuestForm ? (
              <form onSubmit={handleGuestSubmit} className="space-y-2 animate-fade-in">
                <label
                  htmlFor="checkout-email"
                  className="text-sm font-medium text-foreground"
                >
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
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Redirecting…" : "Continue to payment"}
                </Button>
              </form>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowGuestForm(true)}
              >
                Continue as guest
              </Button>
            )}

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              Payment is handled by Paystack. We never see your card details.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
