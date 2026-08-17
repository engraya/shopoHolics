"use client";

import { useEffect, useRef, useState } from "react";
import { Tag, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/features/cart/context/CartContext";
import type { PromoStatus } from "@/lib/cart/pricing";
import { formatMinor } from "@/lib/utils";

/**
 * Applying a code only writes it to cart state — the discount itself is
 * derived by `computeCartTotals` upstream and re-derived server-side at
 * checkout, so this component never computes money.
 */

interface PromoCodeFieldProps {
  status: PromoStatus;
  promoLabel: string | null;
  discountKobo: number;
  /** Minimum spend for the entered code; only meaningful when below-minimum. */
  minSubtotalKobo: number;
}

export function PromoCodeField({
  status,
  promoLabel,
  discountKobo,
  minSubtotalKobo,
}: PromoCodeFieldProps) {
  const { promoCode, setPromoCode } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const seeded = useRef(false);

  // A code restored from localStorage should be visible on load — expanded,
  // and back in the input if it didn't take, so the customer can correct it
  // rather than retype it blind. Seeded once so it never fights typing.
  useEffect(() => {
    if (!promoCode || seeded.current) return;
    seeded.current = true;
    setIsOpen(true);
    if (status !== "applied") setDraft(promoCode);
  }, [promoCode, status]);

  function handleApply(event: React.FormEvent) {
    event.preventDefault();
    setPromoCode(draft);
  }

  function handleClear() {
    setPromoCode("");
    setDraft("");
  }

  if (status === "applied") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-md border border-success/30 bg-success/12 px-3 py-2.5 animate-fade-in">
        <div className="flex min-w-0 items-center gap-2">
          <Check className="h-4 w-4 shrink-0 text-success" />
          <div className="min-w-0">
            <p className="truncate font-mono text-xs font-semibold uppercase tracking-wide text-success">
              {promoCode}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {promoLabel}
              {discountKobo > 0 && ` · −${formatMinor(discountKobo)}`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClear}
          aria-label={`Remove promo code ${promoCode}`}
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Tag className="h-3.5 w-3.5" />
        Have a promo code?
      </button>
    );
  }

  const errorMessage =
    status === "unknown"
      ? "That code isn't valid."
      : status === "below-minimum"
        ? `Spend at least ${formatMinor(minSubtotalKobo)} to use this code.`
        : null;

  return (
    <form onSubmit={handleApply} className="space-y-1.5 animate-fade-in">
      <label htmlFor="promo-code" className="text-xs font-medium text-muted-foreground">
        Promo code
      </label>
      <div className="flex gap-2">
        <Input
          id="promo-code"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Enter code"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="h-9 font-mono text-sm uppercase"
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={errorMessage ? "promo-code-error" : undefined}
        />
        <Button type="submit" variant="secondary" size="sm" disabled={!draft.trim()}>
          Apply
        </Button>
      </div>
      {errorMessage && (
        <p id="promo-code-error" role="alert" className="text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
