"use client";

import { Truck, PartyPopper } from "lucide-react";
import { cn, formatMinor } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD_KOBO } from "@/lib/cart/pricing";

/**
 * The progress bar is decorative — the sentence above it carries the same
 * information, so the bar itself is `aria-hidden` and the text is what a
 * screen reader announces.
 */

interface FreeShippingMeterProps {
  /** Post-discount goods value, in kobo. */
  progressKobo: number;
  remainingKobo: number;
  qualified: boolean;
  className?: string;
}

export function FreeShippingMeter({
  progressKobo,
  remainingKobo,
  qualified,
  className,
}: FreeShippingMeterProps) {
  const percent = Math.min(
    100,
    Math.round((progressKobo / FREE_SHIPPING_THRESHOLD_KOBO) * 100)
  );

  return (
    <div className={cn("space-y-2", className)}>
      <p className="flex items-start gap-2 text-sm leading-snug">
        {qualified ? (
          <>
            <PartyPopper className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span className="text-foreground">
              Your order qualifies for <span className="font-semibold text-success">free delivery</span>.
            </span>
          </>
        ) : (
          <>
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="text-muted-foreground">
              Add{" "}
              <span className="font-semibold text-foreground">
                {formatMinor(remainingKobo)}
              </span>{" "}
              more to unlock free delivery.
            </span>
          </>
        )}
      </p>

      <div
        aria-hidden
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-out",
            qualified ? "bg-success" : "bg-gradient-brand"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
