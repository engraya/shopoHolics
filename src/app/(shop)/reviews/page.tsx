import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import { BadgeCheck } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { EmptyState } from "@/components/ui/EmptyState";
import { RatingSummary } from "@/features/reviews/components/RatingSummary";
import {
  getGlobalRatingSummary,
  getLatestReviews,
} from "@/features/reviews/queries";

// Safety net; every review write already revalidates this path.
export const revalidate = 300;

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type ReviewsData = {
  summary: Awaited<ReturnType<typeof getGlobalRatingSummary>>;
  latest: Awaited<ReturnType<typeof getLatestReviews>>;
};

const EMPTY_SUMMARY: ReviewsData["summary"] = {
  total: 0,
  average: 0,
  breakdown: [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0, pct: 0 })),
};

/**
 * This page is prerendered at build time, where the database may be
 * unreachable (CI builds, cold deploys). Degrade to the empty state rather
 * than failing the build; ISR re-fetches once the DB is available.
 */
async function loadReviews(): Promise<ReviewsData> {
  try {
    const [summary, latest] = await Promise.all([
      getGlobalRatingSummary(),
      getLatestReviews(10),
    ]);
    return { summary, latest };
  } catch (err) {
    console.error("Reviews lookup failed:", err);
    return { summary: EMPTY_SUMMARY, latest: [] };
  }
}

async function ReviewsPage() {
  const { summary, latest } = await loadReviews();

  return (
    <PageContainer>
      <section className="py-8 antialiased md:py-16">
        <div className="mx-auto max-w-screen-xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">Customer Reviews</h1>

          {summary.total === 0 ? (
            <EmptyState
              title="No reviews yet"
              description="Reviews from real customers will show up here once they start coming in."
              actionLabel="Browse products"
              actionHref="/products"
            />
          ) : (
            <>
              {/* Overall rating + breakdown */}
              <div className="mb-10">
                <RatingSummary
                  average={summary.average}
                  total={summary.total}
                  breakdown={summary.breakdown}
                />
              </div>

              {/* Latest reviews */}
              <div className="divide-y divide-border">
                {latest.map((review) => (
                  <div key={review.id} className="gap-6 py-6 sm:flex sm:items-start">
                    <div className="flex-shrink-0 space-y-2 sm:w-48 md:w-64">
                      <StarRating rating={review.rating} />
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-foreground">
                          {review.user.name ?? "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                      {review.isVerifiedPurchase && (
                        <div className="inline-flex items-center gap-1.5">
                          <BadgeCheck className="h-4 w-4 text-primary" />
                          <p className="text-xs font-medium text-foreground">
                            Verified purchase
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 sm:mt-0 min-w-0 flex-1 space-y-2">
                      {review.title && (
                        <p className="text-sm font-semibold text-foreground">
                          {review.title}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {review.body}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        on{" "}
                        <Link
                          href={`/product/${review.product.slug}`}
                          className="font-medium text-primary hover:text-primary/80"
                        >
                          {review.product.name}
                        </Link>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PageContainer>
  );
}

export default ReviewsPage;
