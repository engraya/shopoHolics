import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "./AddToCartButton";
import { formatPrice } from "@/lib/utils";
import type { ProductSummary } from "@/types";

interface ProductCardProps {
  product: ProductSummary;
  badgeLabel?: string;
}

export default function ProductCard({ product, badgeLabel = "Sale" }: ProductCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card hover:shadow-md hover:ring-1 hover:ring-primary/30 transition-all duration-200">
      <Link href={`/product/${product.slug}`} className="flex-1 flex flex-col">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          />
        </div>

        {/* Badge */}
        {badgeLabel && (
          <div className="absolute top-2 left-2">
            <Badge>{badgeLabel}</Badge>
          </div>
        )}

        {/* Info */}
        <div className="p-3 flex flex-col gap-1 flex-1">
          {product.categoryName && (
            <Badge variant="secondary" className="text-xs w-fit">
              {product.categoryName}
            </Badge>
          )}
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug mt-1">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 pt-1 mt-auto">
            <span className="text-sm font-semibold text-foreground">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.price * 1.3)}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to cart — always visible on mobile, hover-reveal on desktop */}
      <div className="px-3 pb-3 pt-0 sm:opacity-0 sm:translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-200">
        <AddToCartButton
          id={product.slug}
          description=""
          image={product.imageUrl}
          name={product.name}
          price={product.price}
          className="w-full"
        />
      </div>
    </article>
  );
}
