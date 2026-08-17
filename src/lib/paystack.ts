import crypto from "node:crypto";

/**
 * Minimal server-side Paystack client. Two fetch calls and an HMAC cover the
 * whole redirect integration, so there is no SDK dependency.
 *
 * All amounts crossing this boundary are in KOBO (integer minor units).
 */

const BASE = "https://api.paystack.co";

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

export const nairaToKobo = (naira: number) => Math.round(naira * 100);

export interface PaystackTransaction {
  id: number;
  status: "success" | "failed" | "abandoned" | "ongoing" | "pending" | string;
  reference: string;
  /** Kobo. */
  amount: number;
  currency: string;
  channel?: string;
  paid_at?: string | null;
  customer?: { email?: string; first_name?: string | null; last_name?: string | null };
  metadata?: Record<string, unknown> | null;
}

interface PaystackEnvelope<T> {
  status: boolean;
  message: string;
  data: T;
}

async function paystackFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const body = (await res.json().catch(() => null)) as PaystackEnvelope<T> | null;

  // Paystack signals failure with both HTTP status and a `status: false` body.
  if (!res.ok || !body?.status) {
    throw new Error(body?.message ?? `Paystack request failed (${res.status})`);
  }

  return body.data;
}

export function buildReference(): string {
  return `shp_${crypto.randomUUID().replace(/-/g, "")}`;
}

export async function initializeTransaction(input: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}): Promise<{ authorization_url: string; access_code: string; reference: string }> {
  return paystackFetch("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      currency: "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
      channels: ["card", "bank", "ussd", "bank_transfer"],
    }),
  });
}

export async function verifyTransaction(reference: string): Promise<PaystackTransaction> {
  return paystackFetch<PaystackTransaction>(
    `/transaction/verify/${encodeURIComponent(reference)}`
  );
}

/**
 * Paystack signs webhooks with HMAC-SHA512 over the exact raw request bytes,
 * using the secret key itself — there is no separate webhook secret. Callers
 * must pass the unparsed body string; re-serialising parsed JSON reorders keys
 * and breaks the digest.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;

  const expected = crypto
    .createHmac("sha512", secretKey())
    .update(rawBody, "utf8")
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  // timingSafeEqual throws on length mismatch, so check that first.
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
