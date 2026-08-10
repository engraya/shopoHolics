"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { ok, fail, type ActionResult } from "@/lib/actions";

const RATING_MIN = 1;
const RATING_MAX = 5;
const TITLE_MAX = 120;
const BODY_MIN = 10;
const BODY_MAX = 5000;

/** Orders that count as "actually bought it" for the verified badge. */
const PURCHASED_STATUSES = ["PROCESSING", "SHIPPED", "DELIVERED"] as const;

/**
 * Recomputes a product's denormalized rating columns from its reviews.
 *
 * MUST be called with the same transaction client as the review write. Doing it
 * outside would let two concurrent reviews interleave read-modify-write and
 * leave ratingAvg permanently disagreeing with the rows it summarises.
 */
async function recomputeProductRating(
  tx: Prisma.TransactionClient,
  productId: string
): Promise<void> {
  const groups = await tx.review.groupBy({
    by: ["rating"],
    where: { productId },
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

  await tx.product.update({
    where: { id: productId },
    data: {
      ratingCount: total,
      // Guard the divide: deleting the last review must reset to 0, not NaN.
      ratingAvg: total === 0 ? 0 : Number((weighted / total).toFixed(2)),
      rating1: buckets[1],
      rating2: buckets[2],
      rating3: buckets[3],
      rating4: buckets[4],
      rating5: buckets[5],
    },
  });
}

/** Revalidates every surface that renders this product's reviews. */
function revalidateReviewSurfaces(slug: string | undefined) {
  if (slug) revalidatePath(`/product/${slug}`);
  revalidatePath("/reviews");
  revalidatePath("/account/reviews");
}

export interface UpsertReviewInput {
  productId: string;
  rating: number;
  title?: string;
  body: string;
}

/**
 * Creates or edits the caller's review. One action covers both because of the
 * @@unique([productId, userId]) compound — there is no separate "edit" path to
 * keep in sync, and a double submit cannot produce two rows.
 */
export async function upsertReview(
  input: UpsertReviewInput
): Promise<ActionResult<{ reviewId: string; isVerifiedPurchase: boolean }>> {
  const user = await requireUser();

  const rating = Math.trunc(Number(input.rating));
  const title = input.title?.trim() || null;
  const body = input.body?.trim() ?? "";

  const fieldErrors: Record<string, string> = {};
  if (!Number.isFinite(rating) || rating < RATING_MIN || rating > RATING_MAX) {
    fieldErrors.rating = "Choose a rating from 1 to 5 stars.";
  }
  if (body.length < BODY_MIN) {
    fieldErrors.body = `Tell us a little more — at least ${BODY_MIN} characters.`;
  } else if (body.length > BODY_MAX) {
    fieldErrors.body = `Please keep your review under ${BODY_MAX} characters.`;
  }
  if (title && title.length > TITLE_MAX) {
    fieldErrors.title = `Please keep the title under ${TITLE_MAX} characters.`;
  }
  if (Object.keys(fieldErrors).length > 0) {
    return fail("Please fix the highlighted fields.", fieldErrors);
  }

  const product = await db.product.findUnique({
    where: { id: input.productId },
    select: { id: true, slug: true },
  });
  if (!product) return fail("That product no longer exists.");

  try {
    const result = await db.$transaction(async (tx) => {
      // Verified purchase is resolved at write time and snapshotted onto the
      // row. customerEmail is matched too so orders placed as a guest and later
      // signed up for still count.
      const purchased = await tx.orderItem.count({
        where: {
          productId: product.id,
          order: {
            status: { in: [...PURCHASED_STATUSES] },
            OR: [{ userId: user.id }, { customerEmail: user.email }],
          },
        },
      });
      const isVerifiedPurchase = purchased > 0;

      const review = await tx.review.upsert({
        where: { productId_userId: { productId: product.id, userId: user.id } },
        create: {
          productId: product.id,
          userId: user.id,
          rating,
          title,
          body,
          isVerifiedPurchase,
        },
        update: { rating, title, body, isVerifiedPurchase },
      });

      await recomputeProductRating(tx, product.id);

      return { reviewId: review.id, isVerifiedPurchase };
    });

    revalidateReviewSurfaces(product.slug);
    return ok(result);
  } catch (err) {
    console.error("upsertReview failed:", err);
    return fail("Could not save your review. Please try again.");
  }
}

export async function deleteReview(input: {
  reviewId: string;
}): Promise<ActionResult> {
  const user = await requireUser();

  const review = await db.review.findUnique({
    where: { id: input.reviewId },
    select: { id: true, userId: true, product: { select: { id: true, slug: true } } },
  });

  if (!review) return fail("That review no longer exists.");
  // Ownership is checked server-side; never trust the client to send only its
  // own ids.
  if (review.userId !== user.id) return fail("You can only delete your own review.");

  try {
    await db.$transaction(async (tx) => {
      await tx.review.delete({ where: { id: review.id } });
      await recomputeProductRating(tx, review.product.id);
    });

    revalidateReviewSurfaces(review.product.slug);
    return ok();
  } catch (err) {
    console.error("deleteReview failed:", err);
    return fail("Could not delete your review. Please try again.");
  }
}

/**
 * Records a helpful / not-helpful vote. Voting the same way twice removes the
 * vote, so the button acts as a toggle.
 */
export async function voteOnReview(input: {
  reviewId: string;
  isHelpful: boolean;
}): Promise<ActionResult<{ helpfulCount: number; notHelpfulCount: number }>> {
  const user = await requireUser();

  const review = await db.review.findUnique({
    where: { id: input.reviewId },
    select: { id: true, userId: true, product: { select: { slug: true } } },
  });
  if (!review) return fail("That review no longer exists.");
  if (review.userId === user.id) {
    return fail("You can't vote on your own review.");
  }

  try {
    const counts = await db.$transaction(async (tx) => {
      const existing = await tx.reviewVote.findUnique({
        where: { reviewId_userId: { reviewId: review.id, userId: user.id } },
      });

      if (existing && existing.isHelpful === input.isHelpful) {
        await tx.reviewVote.delete({ where: { id: existing.id } });
      } else {
        await tx.reviewVote.upsert({
          where: { reviewId_userId: { reviewId: review.id, userId: user.id } },
          create: {
            reviewId: review.id,
            userId: user.id,
            isHelpful: input.isHelpful,
          },
          update: { isHelpful: input.isHelpful },
        });
      }

      // Recount rather than increment, so the cached columns cannot drift.
      const [helpfulCount, notHelpfulCount] = await Promise.all([
        tx.reviewVote.count({ where: { reviewId: review.id, isHelpful: true } }),
        tx.reviewVote.count({ where: { reviewId: review.id, isHelpful: false } }),
      ]);

      await tx.review.update({
        where: { id: review.id },
        data: { helpfulCount, notHelpfulCount },
      });

      return { helpfulCount, notHelpfulCount };
    });

    revalidateReviewSurfaces(review.product.slug);
    return ok(counts);
  } catch (err) {
    console.error("voteOnReview failed:", err);
    return fail("Could not record your vote. Please try again.");
  }
}
