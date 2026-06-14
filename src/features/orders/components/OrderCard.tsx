import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Package } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  priceCents: number;
}

interface OrderCardProps {
  id: string;
  totalCents: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export function OrderCard({ id, totalCents, status, createdAt, items }: OrderCardProps) {
  const shortId = id.slice(-8).toUpperCase();
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/account/orders/${id}`}
      className="block rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Order #{shortId}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{date}</p>
          </div>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      <div className="mt-4 space-y-1">
        {items.slice(0, 3).map((item) => (
          <p key={item.id} className="text-sm text-muted-foreground truncate">
            {item.name} × {item.quantity}
          </p>
        ))}
        {items.length > 3 && (
          <p className="text-xs text-muted-foreground">+{items.length - 3} more item{items.length - 3 !== 1 ? "s" : ""}</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</span>
        <span className="font-semibold text-foreground">{formatPrice(totalCents)}</span>
      </div>
    </Link>
  );
}
