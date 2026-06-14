"use client"

import React, { useEffect } from 'react'
import PageContainer from '@/components/layout/PageContainer'
import Link from "next/link"
import { ShoppingBag } from 'lucide-react';
import { useShoppingCart } from "use-shopping-cart";
import { runFireworks } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function SuccessPage() {
  const { clearCart } = useShoppingCart();

  useEffect(() => {
    clearCart();
    runFireworks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageContainer>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex max-w-md w-full flex-col items-center gap-6 rounded-xl border border-border bg-card p-10 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Order Confirmed!</h2>
            <p className="text-muted-foreground">
              Thank you for your order. Check your email inbox for the receipt.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Questions? Email{" "}
            <a
              href="mailto:order@example.com"
              className="text-primary hover:underline font-medium"
            >
              order@example.com
            </a>
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

export default SuccessPage;
