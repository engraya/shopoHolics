"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Bookmark } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/features/cart/context/CartContext";
import type { CartEntry } from "@/types";
import { QuantityStepper } from "./QuantityStepper";

/**
 * Removals are undoable rather than confirmed. A confirm dialog on every line
 * would tax the common case to protect the rare one; an undo toast does the
 * reverse. Restoring re-adds the entry at its original quantity, which is why
 * the whole `entry` is captured in the closure before it leaves the store.
 */

export function CartLineItem({ entry }: { entry: CartEntry }) {
  const { incrementItem, decrementItem, removeItem, addItem, saveForLater } = useCart();

  const lineTotal = entry.price * entry.quantity;

  function handleRemove() {
    removeItem(entry.id);
    toast(`${entry.name} removed`, {
      action: {
        label: "Undo",
        onClick: () => addItem(entry, entry.quantity),
      },
    });
  }

  function handleSaveForLater() {
    saveForLater(entry.id);
    toast(`${entry.name} saved for later`, {
      action: {
        label: "Undo",
        onClick: () => addItem(entry, entry.quantity),
      },
    });
  }

  return (
    <li className="group relative flex gap-4 p-4 transition-colors hover:bg-accent/40 sm:gap-6 sm:p-6">
      <Link
        href={`/product/${entry.id}`}
        className="shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={entry.image}
          alt=""
          height={128}
          width={128}
          sizes="(max-width: 640px) 96px, 128px"
          className="h-24 w-24 object-cover transition-transform duration-300 group-hover:scale-105 sm:h-32 sm:w-32"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold leading-snug text-foreground sm:text-base">
              <Link
                href={`/product/${entry.id}`}
                className="line-clamp-2 rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {entry.name}
              </Link>
            </h3>
            {entry.description && (
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {entry.description}
              </p>
            )}
            <p className="mt-1.5 font-mono text-xs tabular-nums text-muted-foreground">
              {formatPrice(entry.price)} each
            </p>
          </div>

          {/* Line total sits top-right on desktop, exactly where a receipt puts it. */}
          <p className="hidden shrink-0 font-mono text-base font-semibold tabular-nums text-foreground sm:block">
            {formatPrice(lineTotal)}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3">
          <QuantityStepper
            quantity={entry.quantity}
            label={entry.name}
            onIncrement={() => incrementItem(entry.id)}
            onDecrement={() => decrementItem(entry.id)}
            onRemove={handleRemove}
          />

          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={handleSaveForLater}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Bookmark className="h-3.5 w-3.5" />
              Save for later
            </button>
            <span aria-hidden className="text-border">|</span>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-md px-2 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Delete
            </button>
          </div>

          {/* Mobile keeps the line total inline — no room for a receipt column. */}
          <p className="ml-auto font-mono text-sm font-semibold tabular-nums text-foreground sm:hidden">
            {formatPrice(lineTotal)}
          </p>
        </div>
      </div>
    </li>
  );
}
