import "server-only";

import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

/**
 * Read side for reviews. Kept separate from review.actions.ts so server
 * components can import these without pulling a "use server" module into the
 * render path.
 */

export const REVIEWS_PAGE_SIZE = 10;

export type ReviewSort = "recent" | "helpful" | "rating-high" | "rating-low";

const ORDER_BY: Record<ReviewSort, Prisma.ReviewOrderByWithRelationInput[]> = {
  recent: [{ createdAt: "desc" }],
  // Ties on helpfulCount fall back to recency so paging stays deterministic.
  helpful: [{ helpfulCount: "desc" }, { createdAt: "desc" }],
  "rating-high": [{ rating: "desc" }, { createdAt: "desc" }],
  "rating-low": [{ rating: "asc" }, { createdAt: "desc" }],
};

/** Author fields safe to expose publicly — never the email. */
const PUBLIC_AUTHOR = { id: true, name: true, image: true } as const;

export interface ReviewListItem {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: Date;
  author: { id: string; name: string | null; image: string | null };
  /** How the signed-in viewer voted, when known. */
  viewerVote?: boolean | null;
}

export async function getProductReviews(
  productId: string,
  opts: { sort?: ReviewSort; page?: number; viewerId?: string | null } = {}
): Promise<{ reviews: ReviewListItem[]; total: number; hasMore: boolean }> {
  const sort = opts.sort ?? "recent";
  const page = Math.max(1, Math.trunc(opts.page ?? 1));
  const skip = (page - 1) * REVIEWS_PAGE_SIZE;

  const [rows, total] = await Promise.all([
    db.review.findMany({
      where: { productId },
      orderBy: ORDER_BY[sort],
      skip,
      take: REVIEWS_PAGE_SIZE,
      include: {
        user: { select: PUBLIC_AUTHOR },
        // Only the viewer's own vote is fetched, so the payload does not grow
        // with the number of voters.
        votes: opts.viewerId
          ? { where: { userId: opts.viewerId }, select: { isHelpful: true } }
          : false,
      },
    }),
    db.review.count({ where: { productId } }),
  ]);

  const reviews: ReviewListItem[] = rows.map((row) => ({
    id: row.id,
    rating: row.rating,
    title: row.title,
    body: row.body,
    isVerifiedPurchase: row.isVerifiedPurchase,
    helpfulCount: row.helpfulCount,
    notHelpfulCount: row.notHelpfulCount,
    createdAt: row.createdAt,
    author: row.user,
    viewerVote:
      "votes" in row && Array.isArray(row.votes)
        ? row.votes[0]?.isHelpful ?? null
        : null,
  }));

  return { reviews, total, hasMore: skip + rows.length < total };
}

/** The viewer's existing review, so the form can open in edit mode. */
export async function getUserReview(productId: string, userId: string) {
  return db.review.findUnique({
    where: { productId_userId: { productId, userId } },
  });
}

/** Everything the signed-in user has written, for /account/reviews. */
export async function getUserReviews(userId: string) {
  return db.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: { id: true, slug: true, name: true, thumbnail: true },
      },
    },
  });
}

/**
 * Products the user bought but has not reviewed yet — drives the "review your
 * purchases" prompt. Done as one grouped query rather than per-order lookups.
 */
export async function getReviewableProducts(userId: string, email: string) {
  const purchased = await db.orderItem.findMany({
    where: {
      productId: { not: null },
      order: {
        status: { in: ["PROCESSING", "SHIPPED", "DELIVERED"] },
        OR: [{ userId }, { customerEmail: email }],
      },
      product: { reviews: { none: { userId } } },
    },
    distinct: ["productId"],
    orderBy: { order: { createdAt: "desc" } },
    select: {
      product: {
        select: { id: true, slug: true, name: true, thumbnail: true },
      },
    },
  });

  return purchased
    .map((item) => item.product)
    .filter((p): p is NonNullable<typeof p> => p !== null);
}

/** Site-wide aggregate for /reviews, replacing the hardcoded breakdown. */
export async function getGlobalRatingSummary() {
  const groups = await db.review.groupBy({
    by: ["rating"],
    _count: { _all: true },
  });

  const buckets: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  let weighted = 0;

  for (const group of groups) {
    const count = group._count._all;
    buckets[group.rating] = count;
    total += count;
    weighted += group.rating * count;
  }

  return {
    total,
    average: total === 0 ? 0 : Number((weighted / total).toFixed(2)),
    breakdown: [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: buckets[stars],
      pct: total === 0 ? 0 : Math.round((buckets[stars] / total) * 100),
    })),
  };
}

/** Latest reviews across all products, for the /reviews landing page. */
export async function getLatestReviews(limit = 10) {
  return db.review.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: PUBLIC_AUTHOR },
      product: { select: { slug: true, name: true, thumbnail: true } },
    },
  });
}
