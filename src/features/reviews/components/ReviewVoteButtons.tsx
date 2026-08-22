"use client";

import { useState, useTransition } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { voteOnReview } from "@/features/reviews/actions/review.actions";

interface ReviewVoteButtonsProps {
  reviewId: string;
  helpfulCount: number;
  notHelpfulCount: number;
  viewerVote: boolean | null | undefined;
  /** false for guests — clicking then only prompts to sign in. */
  canVote: boolean;
}

/**
 * Helpful / not-helpful toggle. Optimistic: state mirrors the server's
 * semantics (same vote again removes it, the other vote switches it), then
 * reconciles with the counts the action returns. The parent re-keys this
 * component when the list is refetched, so props are only read as initial
 * state.
 */
export function ReviewVoteButtons({
  reviewId,
  helpfulCount,
  notHelpfulCount,
  viewerVote,
  canVote,
}: ReviewVoteButtonsProps) {
  const [counts, setCounts] = useState({ up: helpfulCount, down: notHelpfulCount });
  const [vote, setVote] = useState<boolean | null>(viewerVote ?? null);
  const [isPending, startTransition] = useTransition();

  function handleVote(isHelpful: boolean) {
    if (!canVote) {
      toast.error("Sign in to vote on reviews");
      return;
    }
    if (isPending) return;

    const prev = { counts, vote };
    setCounts((c) => {
      let { up, down } = c;
      if (vote === isHelpful) {
        // Toggle off.
        if (isHelpful) up -= 1;
        else down -= 1;
      } else {
        if (vote === true) up -= 1;
        if (vote === false) down -= 1;
        if (isHelpful) up += 1;
        else down += 1;
      }
      return { up, down };
    });
    setVote(vote === isHelpful ? null : isHelpful);

    startTransition(async () => {
      const res = await voteOnReview({ reviewId, isHelpful });
      if (res.ok) {
        setCounts({ up: res.data.helpfulCount, down: res.data.notHelpfulCount });
      } else {
        setCounts(prev.counts);
        setVote(prev.vote);
        toast.error(res.error);
      }
    });
  }

  const buttonClass = (active: boolean) =>
    cn(
      "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      active
        ? "border-primary/40 bg-primary/10 text-primary"
        : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
    );

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Was this helpful?</span>
      <button
        type="button"
        aria-pressed={vote === true}
        onClick={() => handleVote(true)}
        className={buttonClass(vote === true)}
      >
        <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
        Helpful ({counts.up})
      </button>
      <button
        type="button"
        aria-pressed={vote === false}
        onClick={() => handleVote(false)}
        className={buttonClass(vote === false)}
      >
        <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />
        Not helpful ({counts.down})
      </button>
    </div>
  );
}
