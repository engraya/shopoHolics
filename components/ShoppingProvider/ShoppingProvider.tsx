"use client";

import { ReactNode } from "react";
import { CartProvider } from "use-shopping-cart";

export default function ShoppingProvider({ children }: { children: ReactNode }) {
  return (
    <CartProvider
      mode="payment"
      cartMode="client-only"
      stripe={process.env.NEXT_PUBLIC_STRIPE_KEY as string}
      successUrl="https://shopoholics.vercel.app/stripe/success"
      cancelUrl="https://shopoholics.vercel.app/stripe/error"
      currency="USD"
      billingAddressCollection={false}
      shouldPersist={true}
      language="en-US"
    >
      {children}
    </CartProvider>
  );
}