import Link from "next/link";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";

/**
 * An empty cart is a merchandising surface, not a dead end — hence the
 * category shortcuts. Kept as a server component so it costs nothing on the
 * client when the cart isn't empty.
 */
export function EmptyCart({ categories }: { categories: Category[] }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card px-6 py-16 text-center shadow-sm sm:py-24">
      {/* Brand glow, purely decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-brand opacity-20 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand text-brand-ink shadow-lg">
          <ShoppingBag className="h-7 w-7" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Your cart is empty
        </h2>
        <p className="text-balance text-sm text-muted-foreground">
          Nothing here yet. Browse the catalogue and the things you add will show
          up right here, saved on this device.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/products">
              Start shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/newest">
              <Sparkles className="mr-2 h-4 w-4" />
              What&apos;s new
            </Link>
          </Button>
        </div>

        {categories.length > 0 && (
          <div className="mt-6 w-full border-t border-border pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Popular categories
            </p>
            <ul className="mt-3 flex flex-wrap justify-center gap-2">
              {categories.slice(0, 8).map((category) => (
                <li key={category._id}>
                  <Link
                    href={`/categories/${encodeURIComponent(category._id)}`}
                    className="inline-flex rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
