import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { getProductsByCategory, CATEGORIES_REVALIDATE } from "@/lib/api/queries";
import ProductCard from "@/features/products/components/ProductCard";

export const revalidate = CATEGORIES_REVALIDATE;

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const categorySlug = decodeURIComponent(params.category);
  const displayName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const products = await getProductsByCategory(categorySlug);

  return (
    <section className="py-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Categories", href: "/categories" },
            { label: displayName },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{displayName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="No products found"
            description="There are no products in this category yet."
            actionLabel="Browse all products"
            actionHref="/products"
          />
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} badgeLabel="Sale" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
