import { db } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/email/resend";
import type { PaystackTransaction } from "@/lib/paystack";

/**
 * Marks a PENDING order paid and sends the confirmation email.
 *
 * Both the webhook and the callback-verify route call this, so it has to be
 * safe to run twice concurrently. The atomic `updateMany` on `status: PENDING`
 * is the guard: exactly one caller can transition the row, and only that
 * caller sends the email.
 */

export type FulfillResult =
  | { outcome: "fulfilled"; orderId: string }
  | { outcome: "already_fulfilled"; orderId: string }
  | { outcome: "not_found" }
  | { outcome: "amount_mismatch"; orderId: string };

export async function fulfillOrder(txn: PaystackTransaction): Promise<FulfillResult> {
  const order = await db.order.findUnique({
    where: { paystackReference: txn.reference },
    include: { items: true },
  });

  if (!order) return { outcome: "not_found" };

  // Never fulfil an order for an amount the customer did not actually pay.
  // `totalCents` is a BigInt column; Paystack reports kobo as a number.
  const orderTotalKobo = Number(order.totalCents);

  if (txn.currency !== order.currency || txn.amount !== orderTotalKobo) {
    console.error(
      `[paystack] Amount mismatch for ${txn.reference}: charged ${txn.amount} ${txn.currency}, order expects ${order.totalCents} ${order.currency}`
    );
    return { outcome: "amount_mismatch", orderId: order.id };
  }

  const paystackName = [txn.customer?.first_name, txn.customer?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const customerName = order.customerName ?? (paystackName || null);

  const { count } = await db.order.updateMany({
    where: { paystackReference: txn.reference, status: "PENDING" },
    data: {
      status: "PROCESSING",
      paystackTransactionId: String(txn.id),
      customerName,
    },
  });

  // Someone else already transitioned it — do not send a second email.
  if (count === 0) return { outcome: "already_fulfilled", orderId: order.id };

  try {
    await sendOrderConfirmationEmail({
      to: order.customerEmail,
      customerName: customerName ?? undefined,
      orderId: order.id,
      totalCents: orderTotalKobo,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        priceCents: Number(item.priceCents),
      })),
    });
  } catch (emailErr) {
    // The payment succeeded; a failed receipt must not fail the order.
    console.error("Failed to send order confirmation email:", emailErr);
  }

  return { outcome: "fulfilled", orderId: order.id };
}
