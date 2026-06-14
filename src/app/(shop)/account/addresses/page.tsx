import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/EmptyState";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Addresses — Shopoholics" };

export default async function AddressesPage() {
  const session = await auth();
  const addresses = await db.address.findMany({
    where: { userId: session!.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Addresses</h1>

      {addresses.length === 0 ? (
        <EmptyState
          title="No saved addresses"
          description="Addresses from your orders will appear here."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-lg border border-border bg-card p-4 space-y-1"
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{addr.label}</span>
                {addr.isDefault && (
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">Default</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{addr.line1}</p>
              {addr.line2 && <p className="text-sm text-muted-foreground">{addr.line2}</p>}
              <p className="text-sm text-muted-foreground">
                {[addr.city, addr.state, addr.postalCode].filter(Boolean).join(", ")}
              </p>
              <p className="text-sm text-muted-foreground">{addr.country}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
