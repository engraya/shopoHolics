/**
 * Shared result type for server actions.
 *
 * The pre-existing convention (`{ error: string }` in auth.actions.ts) cannot
 * express a success payload, so actions that need to return data — a new review
 * id, updated vote counts — had nowhere to put it. This discriminated union
 * covers both and narrows cleanly at the call site:
 *
 *   const res = await upsertReview(input);
 *   if (!res.ok) { setError(res.error); return; }
 *   res.data.reviewId // narrowed
 */
export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export function ok(): ActionResult<undefined>;
export function ok<T>(data: T): ActionResult<T>;
export function ok<T>(data?: T): ActionResult<T | undefined> {
  return { ok: true, data };
}

export function fail<T = undefined>(
  error: string,
  fieldErrors?: Record<string, string>
): ActionResult<T> {
  return { ok: false, error, fieldErrors };
}
