import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getProductBySlug } from "@/lib/api/queries";
import { buildReference, initializeTransaction, nairaToKobo } from "@/lib/paystack";
import { computeCartTotals } from "@/lib/cart/pricing";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_QUANTITY = 99;
const MAX_LINES = 50;
/** Paystack rejects anything under 100 kobo (₦1). */
const MIN_TOTAL_KOBO = 100;

interface RequestItem {
  id: string;
  quantity: number;
}

export async function POST(req: Request) {
  let order: { id: string } | null = null;

  try {
    const session = await auth().catch(() => null);
    const body = (await req.json()) as {
      email?: string;
      items?: RequestItem[];
      promoCode?: string;
    };

    // The client never sends prices — every amount below is derived server-side.
    const email = (session?.user?.email ?? body.email ?? "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    // Collapse duplicate ids and clamp quantities before touching the catalogue.
    const quantityById = new Map<string, number>();
    for (const item of body.items ?? []) {
      if (!item?.id || typeof item.id !== "string") continue;
      const qty = Math.trunc(Number(item.quantity));
      if (!Number.isFinite(qty) || qty < 1) continue;
      const next = (quantityById.get(item.id) ?? 0) + qty;
      quantityById.set(item.id, Math.min(next, MAX_QUANTITY));
    }

    if (quantityById.size === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (quantityById.size > MAX_LINES) {
      return NextResponse.json({ error: "Too many items in cart" }, { status: 400 });
    }

    const ids = Array.from(quantityById.keys());
    const products = await Promise.all(ids.map((id) => getProductBySlug(id)));

    if (products.some((p) => p === null)) {
      return NextResponse.json(
        { error: "One or more products are no longer available" },
        { status: 400 }
      );
    }

    const lines = products.map((product) => {
      const p = product!;
      return {
        productId: p._id,
        slug: p.slug,
        name: p.name,
        imageUrl: p.images[0] ?? "",
        priceCents: nairaToKobo(p.price),
        quantity: quantityById.get(p.slug)!,
      };
    });

    const subtotalCents = lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);

    // Same function the cart summary renders from, so the figure the customer
    // agreed to is the figure Paystack is asked for. The client's promo code is
    // only a suggestion — an invalid or ineligible one degrades to no discount
    // here rather than being taken at face value.
    const totals = computeCartTotals(subtotalCents, body.promoCode);
    const totalCents = totals.totalKobo;

    if (totalCents < MIN_TOTAL_KOBO) {
      return NextResponse.json({ error: "Order total is too low" }, { status: 400 });
    }

    const reference = buildReference();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    // Persist the basket before redirecting: Paystack's webhook carries no line
    // items, so this row is the record of what was actually ordered.
    order = await db.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          paystackReference: reference,
          userId: session?.user?.id ?? null,
          customerEmail: email,
          customerName: session?.user?.name ?? null,
          subtotalCents,
          shippingCents: totals.shippingKobo,
          discountCents: totals.discountKobo,
          promoCode: totals.promo?.code ?? null,
          totalCents,
          currency: "NGN",
          status: "PENDING",
        },
      });

      await tx.orderItem.createMany({
        data: lines.map((line) => ({ ...line, orderId: created.id })),
      });

      return created;
    });

    const paystack = await initializeTransaction({
      email,
      amountKobo: totalCents,
      reference,
      callbackUrl: `${baseUrl}/payment/success`,
      metadata: { orderId: order.id, userId: session?.user?.id ?? "guest" },
    });

    return NextResponse.json({
      authorization_url: paystack.authorization_url,
      reference,
      totalCents,
    });
  } catch (err) {
    console.error("Checkout error:", err);

    // Paystack never saw this order — don't leave a phantom PENDING row behind.
    if (order) {
      await db.order.delete({ where: { id: order.id } }).catch(() => {});
    }

    return NextResponse.json({ error: "Failed to start checkout" }, { status: 502 });
  }
}
