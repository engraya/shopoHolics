import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/email/resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const rawBody = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Idempotency: skip if already processed
  const existing = await db.order.findUnique({
    where: { stripeSessionId: session.id },
  });
  if (existing) {
    return NextResponse.json({ received: true });
  }

  // Retrieve full session with expanded line items
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items", "line_items.data.price.product"],
  });

  const lineItems = fullSession.line_items?.data ?? [];

  const totalCents = fullSession.amount_total ?? 0;
  const subtotalCents = fullSession.amount_subtotal ?? totalCents;
  const userId = session.metadata?.userId;

  const order = await db.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string | null,
        userId: userId && userId !== "guest" ? userId : null,
        customerEmail: session.customer_details?.email ?? session.customer_email ?? "",
        customerName: session.customer_details?.name ?? null,
        subtotalCents,
        totalCents,
        shippingAddress: session.shipping_details
          ? JSON.parse(JSON.stringify(session.shipping_details))
          : null,
        status: "PROCESSING",
      },
    });

    const items = lineItems.map((li) => {
      const product = li.price?.product as Stripe.Product | null;
      return {
        orderId: newOrder.id,
        sanityProductId: product?.metadata?.sanityId ?? "",
        priceId: li.price?.id ?? "",
        name: product?.name ?? li.description ?? "Product",
        imageUrl: product?.images?.[0] ?? "",
        slug: product?.metadata?.slug ?? "",
        priceCents: li.price?.unit_amount ?? 0,
        quantity: li.quantity ?? 1,
      };
    });

    if (items.length > 0) {
      await tx.orderItem.createMany({ data: items });
    }

    return newOrder;
  });

  // Send confirmation email (non-blocking)
  try {
    await sendOrderConfirmationEmail({
      to: order.customerEmail,
      customerName: order.customerName ?? undefined,
      orderId: order.id,
      totalCents: order.totalCents,
      items: lineItems.map((li) => {
        const product = li.price?.product as Stripe.Product | null;
        return {
          name: product?.name ?? li.description ?? "Product",
          quantity: li.quantity ?? 1,
          priceCents: li.price?.unit_amount ?? 0,
        };
      }),
    });
  } catch (emailErr) {
    console.error("Failed to send order confirmation email:", emailErr);
  }

  return NextResponse.json({ received: true });
}
