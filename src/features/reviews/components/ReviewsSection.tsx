"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { MyReview, SerializedReview } from "@/features/reviews/serialize";
import type { ReviewSort } from "@/features/reviews/queries";
import { RatingSummary } from "./RatingSummary";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";

const SORT_OPTIONS: { value: ReviewSort; label: string }[] = [
  { value: "recent", label: "Most recent" },
  { value: "helpful", label: "Most helpful" },
  { value: "rating-high", label: "Highest rating" },
  { value: "rating-low", label: "Lowest rating" },
];

interface ReviewsSectionProps {
  slug: string;
  productId: string;
  ratingAvg: number;
  ratingCount: number;
  breakdown: { stars: number; count: number; pct: number }[];
  initialReviews: SerializedReview[];
  initialTotal: number;
  initialHasMore: boolean;
}

interface ReviewsResponse {
  reviews: SerializedReview[];
  total: number;
  hasMore: boolean;
  myReview: MyReview | null;
}

/**
 * Client half of the reviews block. The server renders it with anonymous
 * page-1 data (the route is ISR, so the static payload can't know the
 * viewer); signed-in visitors get one hydration fetch that overlays their
 * votes and their own review. Sorting and paging reuse the same endpoint.
 */
export function ReviewsSection({
  slug,
  productId,
  ratingAvg,
  ratingCount,
  breakdown,
  initialReviews,
  initialTotal,
  initialHasMore,
}: ReviewsSectionProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const viewerId = session?.user?.id ?? null;

  const [sort, setSort] = useState<ReviewSort>("recent");
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState(initialReviews);
  const [total, setTotal] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [myReview, setMyReview] = useState<MyReview | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hydratedRef = useRef(false);

  const loadPage = useCallback(
    async (nextSort: ReviewSort, nextPage: number, append: boolean) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/products/${slug}/reviews?sort=${nextSort}&page=${nextPage}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ReviewsResponse = await res.json();
        setReviews((prev) => (append ? [...prev, ...data.reviews] : data.reviews));
        setTotal(data.total);
        setHasMore(data.hasMore);
        setMyReview(data.myReview);
        setSort(nextSort);
        setPage(nextPage);
      } catch (err) {
        console.error("Loading reviews failed:", err);
        toast.error("Could not load reviews. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [slug]
  );

  // One overlay fetch per mount once the session resolves, so the static list
  // gains viewerVote annotations and the viewer's own review.
  useEffect(() => {
    if (status !== "authenticated" || hydratedRef.current) return;
    hydratedRef.current = true;
    void loadPage("recent", 1, false);
  }, [status, loadPage]);

  function handleMutated() {
    setIsFormOpen(false);
    void loadPage(sort, 1, false);
    // Refresh the server payload so header stars + histogram update too.
    router.refresh();
  }

  const loginHref = `/login?callbackUrl=${encodeURIComponent(`/product/${slug}`)}`;

  return (
    <section id="reviews" aria-label="Customer reviews" className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">Customer Reviews</h2>
        {viewerId ? (
          <Button
            variant={isFormOpen ? "outline" : "default"}
            onClick={() => setIsFormOpen((open) => !open)}
          >
            {isFormOpen
              ? "Close"
              : myReview
                ? "Edit your review"
                : "Write a review"}
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href={loginHref}>Sign in to review</Link>
          </Button>
        )}
      </div>

      {ratingCount > 0 && (
        <RatingSummary average={ratingAvg} total={ratingCount} breakdown={breakdown} />
      )}

      {isFormOpen && viewerId && (
        <ReviewForm
          key={myReview?.id ?? "new"}
          productId={productId}
          existing={myReview}
          onSuccess={handleMutated}
          onDeleted={handleMutated}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {total > 0 ? (
        <div>
          <div className="flex items-center gap-2">
            <Label htmlFor="review-sort" className="text-sm text-muted-foreground">
              Sort by
            </Label>
            <select
              id="review-sort"
              value={sort}
              disabled={isLoading}
              onChange={(e) => void loadPage(e.target.value as ReviewSort, 1, false)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="divide-y divide-border">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                viewerId={viewerId}
                onEditOwn={() => setIsFormOpen(true)}
              />
            ))}
          </div>

          {hasMore && (
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => void loadPage(sort, page + 1, true)}
            >
              {isLoading ? "Loading…" : "Load more reviews"}
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border py-10 text-center">
          <p className="text-base font-semibold text-foreground">No reviews yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to review this product.
          </p>
        </div>
      )}
    </section>
  );
}
