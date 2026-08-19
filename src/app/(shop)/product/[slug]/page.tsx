import PageContainer from "@/components/layout/PageContainer";
import { getProductBySlug, getAllProductSlugs, PRODUCT_DETAIL_REVALIDATE } from "@/lib/api/queries";
import { formatPrice } from "@/lib/utils";
import { db } from "@/lib/db";
import ImageGallery from "@/features/products/components/ImageGallery";
import AddToCartButton from "@/features/products/components/AddToCartButton";
import { ProductReviews, type ProductRatingData } from "@/features/reviews/components/ProductReviews";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StarRating } from "@/components/ui/StarRating";
import { Truck } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = PRODUCT_DETAIL_REVALIDATE;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

/**
 * The catalogue renders from dummyjson, but reviews hang off the mirrored
 * Prisma row (Review.productId is its cuid). Degrades to null so a build
 * without DB access — or an unseeded product — still renders the page.
 */
async function getDbProduct(slug: string): Promise<ProductRatingData | null> {
  try {
    return await db.product.findUnique({
      where: { slug },
      select: {
        id: true,
        ratingAvg: true,
        ratingCount: true,
        rating1: true,
        rating2: true,
        rating3: true,
        rating4: true,
        rating5: true,
      },
    });
  } catch (err) {
    console.error("Product rating lookup failed:", err);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const [product, dbProduct] = await Promise.all([
    getProductBySlug(params.slug),
    getDbProduct(params.slug),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="pt-6">
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            ...(product.categoryName
              ? [{ label: product.categoryName, href: `/categories/${product.categoryName}` }]
              : []),
            { label: product.name },
          ]}
        />

        <ImageGallery images={product.images} />

        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-border lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {product.name}
            </h1>
          </div>

          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-foreground font-semibold">
              {formatPrice(product.price)}
            </p>
            <del className="mb-0.5 text-sm text-muted-foreground">
              {formatPrice(product.price * 1.3)}
            </del>

            <div className="text-sm text-muted-foreground mt-1">Incl. VAT plus shipping</div>

            <div className="mb-6 flex items-center gap-2 text-muted-foreground mt-3">
              <Truck className="w-5 h-5" />
              <span className="text-sm">2–4 Day Shipping</span>
            </div>

            <div className="mt-4">
              <h3 className="sr-only">Reviews</h3>
              {dbProduct ? (
                <div className="flex items-center gap-3">
                  <StarRating rating={Math.round(dbProduct.ratingAvg)} />
                  <a
                    href="#reviews"
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    {dbProduct.ratingCount > 0
                      ? `${dbProduct.ratingCount} review${dbProduct.ratingCount === 1 ? "" : "s"}`
                      : "No reviews yet"}
                  </a>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No reviews yet</p>
              )}
            </div>

            <div className="mt-8">
              <AddToCartButton
                id={product.slug}
                description={product.description}
                image={product.images[0]}
                name={product.name}
                price={product.price}
                className="w-full"
              />
            </div>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-border lg:pb-16 lg:pr-8 lg:pt-6">
            <div>
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6">
                <p className="text-base text-foreground leading-relaxed">{product.description}</p>
              </div>
            </div>
            <div className="mt-10">
              <h2 className="text-sm font-semibold text-foreground">Product Category</h2>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">{product.categoryName}</p>
              </div>
            </div>
            <div className="mt-16 border-t border-border pt-10">
              <ProductReviews slug={params.slug} product={dbProduct} />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
