import { describe, it, expect } from "vitest";
import { ok, fail } from "./actions";

describe("ok", () => {
  it("marks success with no payload", () => {
    expect(ok()).toEqual({ ok: true, data: undefined });
  });

  it("carries a success payload", () => {
    expect(ok({ reviewId: "r_1" })).toEqual({
      ok: true,
      data: { reviewId: "r_1" },
    });
  });
});

describe("fail", () => {
  it("marks failure with a message", () => {
    expect(fail("Nope")).toEqual({ ok: false, error: "Nope", fieldErrors: undefined });
  });

  it("carries per-field errors when given", () => {
    const res = fail("Invalid", { rating: "Required" });
    expect(res.ok).toBe(false);
    expect(res).toMatchObject({ error: "Invalid", fieldErrors: { rating: "Required" } });
  });
});
