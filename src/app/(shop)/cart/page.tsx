import type { Metadata } from "next";
import PageContainer from "@/components/layout/PageContainer";
import { CartView } from "@/features/cart/components/CartView";
import { EmptyCart } from "@/features/cart/components/EmptyCart";
import { getAllCategories, getNewestProducts } from "@/lib/api/queries";

/**
 * Server shell. The cart itself lives in localStorage and can only be read on
 * the client, but the empty state's category chips and the recommendations
 * strip are catalogue data — fetching them here keeps them out of the client
 * bundle and lets them ride the same ISR cache as the rest of the site.
 */

export const metadata: Metadata = {
  title: "Shopping cart",
  description: "Review the items in your cart and check out securely.",
  // A personal, device-local page — nothing here belongs in an index.
  robots: { index: false, follow: true },
};

export default async function CartPage() {
  const [categories, recommendations] = await Promise.all([
    getAllCategories(),
    getNewestProducts(12),
  ]);

  return (
    <PageContainer>
      <CartView
        emptyState={<EmptyCart categories={categories} />}
        recommendations={recommendations}
      />
    </PageContainer>
  );
}
