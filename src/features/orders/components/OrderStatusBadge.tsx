import { cn } from "@/lib/utils";

/**
 * Status chips follow the shared three-alpha recipe: solid hue for the text,
 * /12 for the fill, /30 for the hairline. One token per state, so the set
 * stays visually consistent when a new status is added.
 */
const statusMap: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-warning/12 text-warning ring-warning/30" },
  PROCESSING: { label: "Processing", className: "bg-info/12 text-info ring-info/30" },
  SHIPPED: { label: "Shipped", className: "bg-primary/12 text-primary ring-primary/30" },
  DELIVERED: { label: "Delivered", className: "bg-success/12 text-success ring-success/30" },
  REFUNDED: {
    label: "Refunded",
    className: "bg-muted-foreground/12 text-muted-foreground ring-muted-foreground/30",
  },
  CANCELLED: { label: "Cancelled", className: "bg-danger/12 text-danger ring-danger/30" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config =
    statusMap[status] ?? { label: status, className: "bg-muted text-muted-foreground ring-border" };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[11px] font-medium ring-1 ring-inset",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
