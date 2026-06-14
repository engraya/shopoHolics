import { getAllProducts, PRODUCTS_REVALIDATE } from "@/lib/api/queries"
import ProductCard from "@/features/products/components/ProductCard"

export const revalidate = PRODUCTS_REVALIDATE;

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <section className="py-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">All Products</h1>
            <p className="mt-1 text-sm text-muted-foreground">{products.length} products</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:ring-2 focus:ring-ring focus:outline-none">
              <option>Sort: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} badgeLabel="Sale" />
          ))}
        </div>
      </div>
    </section>
  );
}
