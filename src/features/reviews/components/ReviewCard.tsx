"use client";

import Image from "next/image";
import { BadgeCheck, UserRound } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/badge";
import type { SerializedReview } from "@/features/reviews/serialize";
import { ReviewVoteButtons } from "./ReviewVoteButtons";

interface ReviewCardProps {
  review: SerializedReview;
  /** Signed-in viewer's user id, or null for guests. */
  viewerId: string | null;
  /** Opens the review form in edit mode; only used on the viewer's own review. */
  onEditOwn?: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Avatar({ name, image }: { name: string | null; image: string | null }) {
  if (image) {
    return (
      <Image
        src={image}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }
  const initials = (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground"
    >
      {initials || <UserRound className="h-5 w-5" />}
    </div>
  );
}

export function ReviewCard({ review, viewerId, onEditOwn }: ReviewCardProps) {
  const isOwn = viewerId !== null && viewerId === review.author.id;

  return (
    <div className="gap-6 py-6 sm:flex sm:items-start">
      <div className="flex-shrink-0 space-y-2 sm:w-48 md:w-64">
        <div className="flex items-center gap-3">
          <Avatar name={review.author.name} image={review.author.image} />
          <div className="space-y-0.5 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {review.author.name ?? "Anonymous"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} />
        {review.isVerifiedPurchase && (
          <div className="inline-flex items-center gap-1.5">
            <BadgeCheck className="h-4 w-4 text-primary" />
            <p className="text-xs font-medium text-foreground">Verified purchase</p>
          </div>
        )}
        {isOwn && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Your review</Badge>
            {onEditOwn && (
              <button
                type="button"
                onClick={onEditOwn}
                className="text-xs font-medium text-primary hover:text-primary/80 underline-offset-2 hover:underline"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-0 min-w-0 flex-1 space-y-3">
        {review.title && (
          <p className="text-sm font-semibold text-foreground">{review.title}</p>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {review.body}
        </p>
        {!isOwn && (
          <ReviewVoteButtons
            key={`${review.id}-${String(review.viewerVote)}-${review.helpfulCount}-${review.notHelpfulCount}`}
            reviewId={review.id}
            helpfulCount={review.helpfulCount}
            notHelpfulCount={review.notHelpfulCount}
            viewerVote={review.viewerVote}
            canVote={viewerId !== null}
          />
        )}
      </div>
    </div>
  );
}
