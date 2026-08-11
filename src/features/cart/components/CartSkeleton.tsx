import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shown until the cart has been read out of localStorage. Without it the page
 * flashes its empty state on every load for anyone who actually has a cart.
 */
export function CartSkeleton() {
  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">
      <div className="space-y-4">
        <Skeleton className="h-9 w-48" />
        <div className="rounded-lg border border-border bg-card">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex gap-4 border-b border-border p-4 last:border-b-0 sm:p-6"
            >
              <Skeleton className="h-24 w-24 shrink-0 rounded-md sm:h-28 sm:w-28" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-9 w-32 rounded-full" />
              </div>
              <Skeleton className="h-5 w-20 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-4 rounded-lg border border-border bg-card p-6 lg:mt-0">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-1.5 w-full rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
    </div>
  );
}
