import type { ReviewListItem } from "./queries";

/**
 * Wire/prop shape for reviews crossing the server → client boundary. Dates go
 * over as ISO strings; plain module (no "server-only") so client components
 * can import the type.
 */

export interface SerializedReview {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  author: { id: string; name: string | null; image: string | null };
  /** How the signed-in viewer voted, when known. */
  viewerVote?: boolean | null;
}

/** The viewer's own review, only what the form needs to prefill. */
export interface MyReview {
  id: string;
  rating: number;
  title: string | null;
  body: string;
}

export function serializeReview(item: ReviewListItem): SerializedReview {
  return {
    id: item.id,
    rating: item.rating,
    title: item.title,
    body: item.body,
    isVerifiedPurchase: item.isVerifiedPurchase,
    helpfulCount: item.helpfulCount,
    notHelpfulCount: item.notHelpfulCount,
    createdAt: item.createdAt.toISOString(),
    author: item.author,
    viewerVote: item.viewerVote ?? null,
  };
}
