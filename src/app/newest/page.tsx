import PageContainer from "@/components/layout/PageContainer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getNewestProducts, NEWEST_REVALIDATE } from "@/lib/api/queries"
import ProductCard from "@/features/products/components/ProductCard"

export const revalidate = NEWEST_REVALIDATE;

export default async function NewestPage() {
  const products = await getNewestProducts(4);

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Newest Products
        </h1>
        <Link
          className="text-sm font-medium text-primary hover:underline flex items-center gap-x-1"
          href="/products"
        >
          See All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} badgeLabel="New" />
        ))}
      </div>
    </PageContainer>
  );
}
