"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Amazon's stepper collapses its decrement control into a delete affordance at
 * one unit, which is what stops customers from hammering "−" and wondering why
 * nothing happens. Same behaviour here, so `onRemove` is required rather than
 * optional.
 */

interface QuantityStepperProps {
  quantity: number;
  max?: number;
  label: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  className?: string;
}

const controlClass =
  "flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

export function QuantityStepper({
  quantity,
  max = 99,
  label,
  onIncrement,
  onDecrement,
  onRemove,
  className,
}: QuantityStepperProps) {
  const atMinimum = quantity <= 1;

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-full border border-border bg-background shadow-sm",
        className
      )}
    >
      <button
        type="button"
        onClick={atMinimum ? onRemove : onDecrement}
        className={cn(controlClass, atMinimum && "hover:bg-destructive/10 hover:text-destructive")}
        aria-label={atMinimum ? `Remove ${label} from cart` : `Decrease quantity of ${label}`}
      >
        {atMinimum ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      </button>

      <output
        aria-live="polite"
        aria-label={`Quantity of ${label}`}
        className="flex min-w-[2.75rem] items-center justify-center border-x border-border px-1 font-mono text-sm font-semibold tabular-nums text-foreground"
      >
        {quantity}
      </output>

      <button
        type="button"
        onClick={onIncrement}
        disabled={quantity >= max}
        className={controlClass}
        aria-label={`Increase quantity of ${label}`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
