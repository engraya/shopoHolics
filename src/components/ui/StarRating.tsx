"use client";

import { cn } from "@/lib/utils";

/**
 * The single star-rating primitive. Two divergent copies previously lived in
 * `(shop)/reviews/page.tsx` and `(shop)/product/[slug]/page.tsx`.
 *
 * Read-only by default and renders inert `<svg>`s with one label on the group.
 * Pass `interactive` (with `onChange`) for the review form: it then renders
 * real `<button>`s so the control is keyboard-operable and each star announces
 * the value it selects, which a grid of `<svg>`s cannot do.
 */

const SIZE_CLASS = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
} as const;

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  /** Rendered on the interactive group so screen readers get a field name. */
  label?: string;
}

function StarIcon({ filled, className }: { filled: boolean; className: string }) {
  return (
    <svg
      className={cn(className, filled ? "text-amber-400" : "text-muted")}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
    </svg>
  );
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "sm",
  className,
  interactive = false,
  onChange,
  label = "Rating",
}: StarRatingProps) {
  const sizeClass = SIZE_CLASS[size];
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  if (!interactive) {
    return (
      <div
        className={cn("flex items-center gap-0.5", className)}
        aria-label={`${rating} out of ${maxRating} stars`}
      >
        {stars.map((value) => (
          <StarIcon key={value} filled={value <= rating} className={sizeClass} />
        ))}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("flex items-center gap-0.5", className)}
    >
      {stars.map((value) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={value === rating}
          aria-label={`${value} star${value === 1 ? "" : "s"}`}
          onClick={() => onChange?.(value)}
          className="rounded-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <StarIcon filled={value <= rating} className={sizeClass} />
        </button>
      ))}
    </div>
  );
}
