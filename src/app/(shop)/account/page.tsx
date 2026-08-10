import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatMinor } from "@/lib/utils";
import Link from "next/link";
import { Package, MapPin, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Account — Shopoholics" };

export default async function AccountPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [orderCount, addressCount] = await Promise.all([
    db.order.count({ where: { userId } }),
    db.address.count({ where: { userId } }),
  ]);

  const recentOrders = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { items: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Account</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {session!.user.name ?? session!.user.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Orders", value: orderCount, icon: Package, href: "/account/orders" },
          { label: "Addresses", value: addressCount, icon: MapPin, href: "/account/addresses" },
          { label: "Profile", value: "Edit", icon: User, href: "/account/profile" },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
          >
            <Icon className="h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Orders</h2>
            <Link href="/account/orders" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {formatMinor(order.totalCents)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{order.status.toLowerCase()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
