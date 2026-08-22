import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import crypto from "node:crypto";
import { nairaToKobo, buildReference, verifyWebhookSignature } from "./paystack";

const SECRET = "sk_test_deadbeefdeadbeefdeadbeef";

function sign(body: string, secret = SECRET): string {
  return crypto.createHmac("sha512", secret).update(body, "utf8").digest("hex");
}

beforeEach(() => {
  vi.stubEnv("PAYSTACK_SECRET_KEY", SECRET);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("nairaToKobo", () => {
  it("scales whole Naira to kobo", () => {
    expect(nairaToKobo(1500)).toBe(150_000);
  });

  it("rounds fractional Naira", () => {
    expect(nairaToKobo(9.99)).toBe(999);
  });
});

describe("buildReference", () => {
  it("produces a prefixed, dashless reference", () => {
    expect(buildReference()).toMatch(/^shp_[0-9a-f]{32}$/);
  });

  it("is unique across calls", () => {
    expect(buildReference()).not.toBe(buildReference());
  });
});

describe("verifyWebhookSignature", () => {
  const body = JSON.stringify({ event: "charge.success", data: { id: 1 } });

  it("accepts a signature computed over the exact raw body", () => {
    expect(verifyWebhookSignature(body, sign(body))).toBe(true);
  });

  it("rejects a signature for a tampered body", () => {
    const tampered = body.replace("charge.success", "charge.failed");
    expect(verifyWebhookSignature(tampered, sign(body))).toBe(false);
  });

  it("rejects a signature made with the wrong secret", () => {
    expect(verifyWebhookSignature(body, sign(body, "sk_wrong"))).toBe(false);
  });

  it("rejects a null signature", () => {
    expect(verifyWebhookSignature(body, null)).toBe(false);
  });

  it("rejects a signature of the wrong length without throwing", () => {
    expect(verifyWebhookSignature(body, "abc123")).toBe(false);
  });
});
