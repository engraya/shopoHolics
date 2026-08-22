"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/StarRating";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  upsertReview,
  deleteReview,
} from "@/features/reviews/actions/review.actions";
import type { MyReview } from "@/features/reviews/serialize";

const TITLE_MAX = 120;
const BODY_MIN = 10;
const BODY_MAX = 5000;

interface ReviewFormProps {
  productId: string;
  /** Prefills edit mode; parent keys the form on `existing?.id`. */
  existing: MyReview | null;
  onSuccess: () => void;
  onDeleted: () => void;
  onCancel: () => void;
}

export function ReviewForm({
  productId,
  existing,
  onSuccess,
  onDeleted,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;
    setFormError(null);
    setFieldErrors({});

    startTransition(async () => {
      const res = await upsertReview({
        productId,
        rating,
        title: title.trim() || undefined,
        body,
      });
      if (!res.ok) {
        setFormError(res.error);
        setFieldErrors(res.fieldErrors ?? {});
        return;
      }
      toast.success(existing ? "Review updated" : "Review submitted");
      onSuccess();
    });
  }

  function handleDelete() {
    if (!existing || isPending) return;
    startTransition(async () => {
      const res = await deleteReview({ reviewId: existing.id });
      setConfirmDelete(false);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Review deleted");
      onDeleted();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-5"
      aria-label={existing ? "Edit your review" : "Write a review"}
    >
      <h3 className="text-base font-semibold text-foreground">
        {existing ? "Edit your review" : "Write a review"}
      </h3>

      <div className="space-y-1.5">
        <Label id="review-rating-label">Your rating</Label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onChange={setRating}
          label="Your rating"
        />
        {fieldErrors.rating && (
          <p role="alert" className="text-sm text-destructive">
            {fieldErrors.rating}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="review-title">Title (optional)</Label>
          <span className="text-xs text-muted-foreground">
            {title.length}/{TITLE_MAX}
          </span>
        </div>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={TITLE_MAX}
          placeholder="Sum it up in a few words"
          aria-invalid={fieldErrors.title ? true : undefined}
          aria-describedby={fieldErrors.title ? "review-title-error" : undefined}
        />
        {fieldErrors.title && (
          <p id="review-title-error" role="alert" className="text-sm text-destructive">
            {fieldErrors.title}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="review-body">Your review</Label>
          <span className="text-xs text-muted-foreground">
            {body.length}/{BODY_MAX}
          </span>
        </div>
        <Textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={BODY_MAX}
          rows={5}
          placeholder={`What did you like or dislike? At least ${BODY_MIN} characters.`}
          aria-invalid={fieldErrors.body ? true : undefined}
          aria-describedby={fieldErrors.body ? "review-body-error" : undefined}
        />
        {fieldErrors.body && (
          <p id="review-body-error" role="alert" className="text-sm text-destructive">
            {fieldErrors.body}
          </p>
        )}
      </div>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving…"
            : existing
              ? "Update review"
              : "Submit review"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        {existing && (
          <Button
            type="button"
            variant="ghost"
            className="ml-auto text-destructive hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
            disabled={isPending}
          >
            Delete review
          </Button>
        )}
      </div>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your review?</DialogTitle>
            <DialogDescription>
              This removes your review and rating from this product. This
              can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(false)}
              disabled={isPending}
            >
              Keep review
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
