import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getAllProducts, PRODUCTS_REVALIDATE } from "@/lib/api/queries"
import ProductCard from "@/features/products/components/ProductCard"

export const revalidate = PRODUCTS_REVALIDATE;

export default async function Home() {
  const allProducts = await getAllProducts();
  const featured = allProducts.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2 pb-8 sm:pt-4 sm:pb-14 text-center">
        {/* Announcement pill */}
        <div className="mb-8 flex justify-center">
          <Link
            href="/newest"
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-muted-foreground ring-1 ring-border hover:ring-primary/40 transition-colors"
          >
            New arrivals just dropped
            <span className="text-primary font-medium flex items-center gap-0.5">
              Explore <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground text-balance max-w-4xl mx-auto">
          Shop smarter with{" "}
          <span className="text-primary">Shopoholics</span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
          Exclusive deals on top brands, fast checkout, and a shopping experience you&apos;ll actually enjoy.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/categories">Browse Categories</Link>
          </Button>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
            <p className="mt-1 text-sm text-muted-foreground">Trending bestsellers from our catalog</p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} badgeLabel="Sale" />
          ))}
        </div>
      </section>

      {/* Category CTA */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Shop by Category</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
            Find exactly what you&apos;re looking for across our curated collections.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
