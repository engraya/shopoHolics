import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getProductReviews,
  getUserReview,
  type ReviewSort,
} from "@/features/reviews/queries";
import { serializeReview } from "@/features/reviews/serialize";

const SORTS: ReviewSort[] = ["recent", "helpful", "rating-high", "rating-low"];

/**
 * Dynamic complement to the ISR product page: same review list, but resolved
 * against the viewer's session so it can carry viewerVote and their own
 * review. Guests never call this — the static payload already serves them.
 */
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(req.url);
  const sortParam = searchParams.get("sort") as ReviewSort | null;
  const sort: ReviewSort = sortParam && SORTS.includes(sortParam) ? sortParam : "recent";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const product = await db.product.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const session = await auth();
  const viewerId = session?.user?.id ?? null;

  try {
    const [{ reviews, total, hasMore }, myReview] = await Promise.all([
      getProductReviews(product.id, { sort, page, viewerId }),
      viewerId ? getUserReview(product.id, viewerId) : null,
    ]);

    return NextResponse.json({
      reviews: reviews.map(serializeReview),
      total,
      hasMore,
      // Whitelisted — never the raw Prisma row.
      myReview: myReview
        ? {
            id: myReview.id,
            rating: myReview.rating,
            title: myReview.title,
            body: myReview.body,
          }
        : null,
    });
  } catch (err) {
    console.error("GET /api/products/[slug]/reviews failed:", err);
    return NextResponse.json(
      { error: "Could not load reviews" },
      { status: 500 }
    );
  }
}
