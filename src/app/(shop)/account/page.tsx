import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatMinor } from "@/lib/utils";
import Link from "next/link";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Package, MapPin, UserRound, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Account — Shopoholics" };

export default async function AccountPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [orderCount, addressCount, recentOrders] = await Promise.all([
    db.order.count({ where: { userId } }),
    db.address.count({ where: { userId } }),
    db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { items: true },
    }),
  ]);

  const firstName = (session!.user.name ?? session!.user.email ?? "there").split(" ")[0];

  const stats = [
    { label: "Total Orders", value: String(orderCount), icon: Package, href: "/account/orders" },
    { label: "Saved Addresses", value: String(addressCount), icon: MapPin, href: "/account/addresses" },
    { label: "Profile", value: "Edit", icon: UserRound, href: "/account/profile" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div aria-hidden className="absolute inset-0 bg-gradient-brand opacity-[0.06]" />
        <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium text-muted-foreground">My Account</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, <span className="text-gradient-brand">{firstName}</span>
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Track your orders, manage delivery addresses and keep your profile up to date.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-foreground">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
          {recentOrders.length > 0 && (
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card">
            <EmptyState
              title="No orders yet"
              description="Once you place an order it will appear here."
              actionLabel="Browse Products"
              actionHref="/products"
            />
          </div>
        ) : (
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50 sm:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {" · "}
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <p className="text-sm font-semibold text-foreground">
                    {formatMinor(order.totalCents)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
