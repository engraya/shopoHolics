import { StarRating } from "@/components/ui/StarRating";

interface RatingSummaryProps {
  average: number;
  total: number;
  breakdown: { stars: number; count: number; pct: number }[];
}

/**
 * Average + star histogram. Presentational only, safe in server and client
 * trees; shared by the product page and /reviews.
 */
export function RatingSummary({ average, total, breakdown }: RatingSummaryProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-8">
      <div className="flex flex-col items-center justify-center sm:items-start gap-2">
        <span className="text-5xl font-bold text-foreground">
          {average.toFixed(1)}
        </span>
        <StarRating rating={Math.round(average)} size="md" />
        <span className="text-sm text-muted-foreground">
          Based on {total} review{total === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex-1 space-y-2">
        {breakdown.map(({ stars, count, pct }) => (
          <div key={stars} className="flex items-center gap-3">
            <span className="w-2 text-sm font-medium text-foreground">{stars}</span>
            <svg
              className="h-4 w-4 text-amber-400 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
            </svg>
            <div className="h-2 flex-1 max-w-xs rounded-full bg-muted overflow-hidden">
              <div
                className="h-2 rounded-full bg-amber-400 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-16 text-sm text-muted-foreground text-right">
              {count} <span className="hidden sm:inline">reviews</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
