"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogIn, Lock } from "lucide-react";
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
import { useStartCheckout } from "@/features/cart/hooks/useStartCheckout";

/**
 * The auth gate shown to signed-out users at checkout. Mounted once in the
 * (shop) layout — outside the cart sheet's portal — because CheckoutButton
 * closes the sheet before opening this, and a gate rendered inside the sheet
 * would be unmounted with it after the exit animation.
 *
 * Guests aren't blocked, they're *offered* an account: signing in is the
 * prominent path because it's what gets them order history, but the guest lane
 * stays open underneath it. Paystack requires a customer email on every
 * transaction either way, which is what the guest form collects.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GUEST_EMAIL_KEY = "shopoholics.guestEmail";

export function CheckoutGateDialog() {
  const pathname = usePathname();
  const { isCheckoutGateOpen, setCheckoutGateOpen } = useCart();
  const { startCheckout, isLoading } = useStartCheckout();

  const [showGuestForm, setShowGuestForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  // Send them back to whatever they were looking at, not a hardcoded /cart.
  const callbackUrl = pathname || "/cart";

  // The dialog stays mounted between opens, so each open resets the form and
  // re-reads the remembered guest email (a remount used to do this for free).
  useEffect(() => {
    if (!isCheckoutGateOpen) return;
    setShowGuestForm(false);
    setEmailError(null);
    try {
      const saved = window.localStorage.getItem(GUEST_EMAIL_KEY);
      if (saved) setEmail(saved);
    } catch {
      // storage unavailable — the field just starts empty
    }
  }, [isCheckoutGateOpen]);

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
    <Dialog open={isCheckoutGateOpen} onOpenChange={setCheckoutGateOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Almost there</DialogTitle>
          <DialogDescription>
            Sign in to save this order to your account, or check out as a guest.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              onClick={() => setCheckoutGateOpen(false)}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign in &amp; checkout
            </Link>
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            New here?{" "}
            <Link
              href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="font-medium text-primary hover:underline"
              onClick={() => setCheckoutGateOpen(false)}
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
  );
}
