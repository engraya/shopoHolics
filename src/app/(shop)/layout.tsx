import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckoutGateDialog } from "@/features/cart/components/CheckoutGateDialog";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen">
        {children}
      </main>
      <Footer />
      {/* Mounted outside the cart sheet so it survives the sheet closing. */}
      <CheckoutGateDialog />
    </>
  );
}
