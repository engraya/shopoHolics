import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface ShippingData {
  name?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

function ShippingAddressBlock({ data }: { data: unknown }) {
  const d = data as ShippingData;
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="font-semibold text-foreground mb-2">Shipping Address</h2>
      <div className="text-sm text-muted-foreground space-y-0.5">
        {d.name && <p className="text-foreground font-medium">{d.name}</p>}
        {d.address?.line1 && <p>{d.address.line1}</p>}
        {d.address?.line2 && <p>{d.address.line2}</p>}
        {d.address && (
          <p>
            {[d.address.city, d.address.state, d.address.postal_code].filter(Boolean).join(", ")}
          </p>
        )}
        {d.address?.country && <p>{d.address.country}</p>}
      </div>
    </div>
  );
}
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { formatMinor } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Details — Shopoholics" };

export default async function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const session = await auth();

  const order = await db.order.findFirst({
    where: { id: params.orderId, userId: session!.user.id },
    include: { items: true },
  });

  if (!order) notFound();

  // Money columns are BigInt; the summary rows compare and render them as
  // numbers, so widen once here rather than at every row.
  const totals = {
    subtotal: Number(order.subtotalCents),
    shipping: Number(order.shippingCents),
    tax: Number(order.taxCents),
    discount: Number(order.discountCents),
    total: Number(order.totalCents),
  };

  const shortId = order.id.slice(-8).toUpperCase();
  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/account/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order #{shortId}</h1>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Items */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Package className="h-4 w-4" /> Items
        </h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {item.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-12 w-12 rounded-md object-cover bg-muted flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  {item.slug ? (
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-medium text-foreground hover:text-primary truncate block"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatMinor(item.priceCents)} × {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-foreground flex-shrink-0">
                {formatMinor(Number(item.priceCents) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <h2 className="font-semibold text-foreground">Order Summary</h2>
        <Separator />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatMinor(totals.subtotal)}</span>
        </div>
        {/* Without this row a promo order's figures visibly fail to add up. */}
        {totals.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Discount{order.promoCode ? ` (${order.promoCode})` : ""}
            </span>
            <span className="text-green-600 dark:text-green-400">
              −{formatMinor(totals.discount)}
            </span>
          </div>
        )}
        {totals.shipping > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>{formatMinor(totals.shipping)}</span>
          </div>
        )}
        {totals.tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>{formatMinor(totals.tax)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatMinor(totals.total)}</span>
        </div>
      </div>

      {/* Shipping address */}
      {order.shippingAddress && (
        <ShippingAddressBlock data={order.shippingAddress} />
      )}
    </div>
  );
}
