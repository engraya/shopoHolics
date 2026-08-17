import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Orders — Shopoholics" };

export default async function OrdersPage() {
  const session = await auth();
  const orders = await db.order.findMany({
    where: { userId: session!.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Your Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Once you place an order it will appear here."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              totalCents={Number(order.totalCents)}
              status={order.status}
              createdAt={order.createdAt.toISOString()}
              items={order.items.map((i) => ({
                id: i.id,
                name: i.name,
                quantity: i.quantity,
                priceCents: Number(i.priceCents),
              }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
