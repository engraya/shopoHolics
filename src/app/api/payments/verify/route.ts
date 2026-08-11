import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyTransaction } from "@/lib/paystack";
import { fulfillOrder } from "@/lib/orders/fulfillOrder";

export const runtime = "nodejs";

/**
 * Called by the payment callback page.
 *
 * Paystack has no `cancel_url` — abandoned and successful payments both return
 * to the same callback — so this endpoint is what tells the two apart. It also
 * fulfils the order inline, which means checkout completes end-to-end even with
 * no webhook configured (essential for local development, and a safety net if
 * the webhook is ever delayed).
 */
export async function POST(req: Request) {
  try {
    const { reference } = (await req.json()) as { reference?: string };

    if (!reference || typeof reference !== "string") {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    const txn = await verifyTransaction(reference);

    if (txn.status !== "success") {
      return NextResponse.json({ status: txn.status });
    }

    const result = await fulfillOrder(txn);

    if (result.outcome === "not_found") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (result.outcome === "amount_mismatch") {
      return NextResponse.json({ status: "failed" });
    }

    const order = await db.order.findUnique({
      where: { id: result.orderId },
      select: {
        id: true,
        status: true,
        totalCents: true,
        customerEmail: true,
        items: {
          select: { id: true, name: true, quantity: true, priceCents: true, slug: true },
        },
      },
    });

    // BigInt money columns are not JSON-serializable — widen before replying.
    return NextResponse.json({
      status: "success",
      order: order && {
        ...order,
        totalCents: Number(order.totalCents),
        items: order.items.map((item) => ({
          ...item,
          priceCents: Number(item.priceCents),
        })),
      },
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.json({ error: "Could not verify payment" }, { status: 502 });
  }
}
