import { NextResponse } from "next/server";
import { verifyWebhookSignature, type PaystackTransaction } from "@/lib/paystack";
import { fulfillOrder } from "@/lib/orders/fulfillOrder";

// node:crypto HMAC is unavailable on the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PaystackWebhookEvent {
  event: string;
  data: PaystackTransaction;
}

export async function POST(req: Request) {
  // Must be the exact raw bytes — re-serialising parsed JSON breaks the HMAC.
  const rawBody = await req.text();

  let signatureValid: boolean;
  try {
    signatureValid = verifyWebhookSignature(rawBody, req.headers.get("x-paystack-signature"));
  } catch (err) {
    // Missing PAYSTACK_SECRET_KEY — a deployment problem, not a bad request.
    console.error("Cannot verify Paystack webhook:", err);
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  if (!signatureValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PaystackWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  try {
    await fulfillOrder(event.data);
  } catch (err) {
    // Log and still return 200: a mismatch or DB hiccup shouldn't trigger an
    // endless Paystack retry loop. Reconciliation happens via the verify route.
    console.error("Paystack webhook handling failed:", err);
  }

  return NextResponse.json({ received: true });
}
