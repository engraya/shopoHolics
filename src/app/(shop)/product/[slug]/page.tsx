import PageContainer from "@/components/layout/PageContainer";
import { getProductBySlug, getAllProductSlugs, PRODUCT_DETAIL_REVALIDATE } from "@/lib/api/queries";
import { formatPrice } from "@/lib/utils";
import ImageGallery from "@/features/products/components/ImageGallery";
import AddToCartButton from "@/features/products/components/AddToCartButton";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StarRating } from "@/components/ui/StarRating";
import { Truck } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = PRODUCT_DETAIL_REVALIDATE;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

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
              <div className="flex items-center gap-3">
                <StarRating rating={4} />
                <p className="text-sm font-medium text-primary hover:text-primary/80 cursor-pointer">
                  117 reviews
                </p>
              </div>
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
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
