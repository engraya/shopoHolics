"use client";

import React, { useEffect, useState, Suspense } from "react";
import PageContainer from "@/components/layout/PageContainer";
import Link from "next/link";
import { CheckCircle, ShoppingBag, Package } from "lucide-react";
import { useShoppingCart } from "use-shopping-cart";
import { runFireworks } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  priceCents: number;
}

interface Order {
  id: string;
  totalCents: number;
  customerEmail: string;
  status: string;
  items: OrderItem[];
}

function SuccessContent() {
  const { clearCart } = useShoppingCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(!!sessionId);

  useEffect(() => {
    clearCart();
    runFireworks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!sessionId) return;

    let attempts = 0;
    const maxAttempts = 6;

    async function poll() {
      try {
        const res = await fetch(`/api/orders/by-session/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          setLoading(false);
          return;
        }
      } catch {
        // ignore
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, 1500);
      } else {
        setLoading(false);
      }
    }

    poll();
  }, [sessionId]);

  const shortId = order?.id.slice(-8).toUpperCase();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex max-w-lg w-full flex-col items-center gap-6 rounded-xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Order Confirmed!</h2>
          {order ? (
            <p className="text-muted-foreground">
              Order <span className="font-semibold text-foreground">#{shortId}</span> placed.
              A receipt has been sent to{" "}
              <span className="font-medium">{order.customerEmail}</span>.
            </p>
          ) : (
            <p className="text-muted-foreground">
              Thank you for your purchase. Check your email for a receipt.
            </p>
          )}
        </div>

        {order && order.items.length > 0 && (
          <div className="w-full rounded-lg border border-border bg-muted/30 p-4 text-left space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Package className="h-4 w-4" /> Order Summary
            </h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-foreground">
                  {formatPrice(item.priceCents * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.totalCents)}</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading order details…
          </div>
        )}

        <div className="flex w-full flex-col gap-3">
          {order && (
            <Button asChild variant="outline" className="w-full">
              <Link href={`/account/orders/${order.id}`}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                View Order Details
              </Link>
            </Button>
          )}
          <Button asChild size="lg" className="w-full">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <PageContainer>
      <Suspense fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </PageContainer>
  );
}
