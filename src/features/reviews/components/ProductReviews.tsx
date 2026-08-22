import { EmptyState } from "@/components/ui/EmptyState";
import { getProductReviews } from "@/features/reviews/queries";
import { serializeReview } from "@/features/reviews/serialize";
import { ReviewsSection } from "./ReviewsSection";

export interface ProductRatingData {
  id: string;
  ratingAvg: number;
  ratingCount: number;
  rating1: number;
  rating2: number;
  rating3: number;
  rating4: number;
  rating5: number;
}

interface ProductReviewsProps {
  slug: string;
  /** Null when the product has no DB row (unseeded) — reviews are unavailable. */
  product: ProductRatingData | null;
}

/**
 * Server half of the reviews block: fetches the anonymous first page inside
 * the ISR render and hands off to the client section. Viewer-specific data
 * arrives later via /api/products/[slug]/reviews.
 */
export async function ProductReviews({ slug, product }: ProductReviewsProps) {
  if (!product) {
    return (
      <section id="reviews" aria-label="Customer reviews">
        <h2 className="text-xl font-bold text-foreground">Customer Reviews</h2>
        <EmptyState
          title="Reviews aren't available for this product"
          description="Check back soon — we're still setting things up here."
        />
      </section>
    );
  }

  const { reviews, total, hasMore } = await getProductReviews(product.id, {});

  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = product[`rating${stars}` as keyof ProductRatingData] as number;
    return {
      stars,
      count,
      pct:
        product.ratingCount === 0
          ? 0
          : Math.round((count / product.ratingCount) * 100),
    };
  });

  return (
    <ReviewsSection
      slug={slug}
      productId={product.id}
      ratingAvg={product.ratingAvg}
      ratingCount={product.ratingCount}
      breakdown={breakdown}
      initialReviews={reviews.map(serializeReview)}
      initialTotal={total}
      initialHasMore={hasMore}
    />
  );
}
