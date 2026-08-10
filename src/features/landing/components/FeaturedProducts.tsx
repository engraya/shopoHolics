import ProductCard from "@/features/products/components/ProductCard";
import ProductTabs, { type ProductTab } from "./ProductTabs";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import type { ProductSummary } from "@/types";

interface FeaturedProductsProps {
  trending: ProductSummary[];
  newest: ProductSummary[];
  deals: ProductSummary[];
}

function Grid({
  products,
  badgeLabel,
}: {
  products: ProductSummary[];
  badgeLabel: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {products.map((product, index) => (
        <Reveal
          key={product._id}
          delay={index * 60}
          className="h-full [&>article]:h-full"
        >
          <ProductCard product={product} badgeLabel={badgeLabel} />
        </Reveal>
      ))}
    </div>
  );
}

export default function FeaturedProducts({
  trending,
  newest,
  deals,
}: FeaturedProductsProps) {
  const tabs: ProductTab[] = [
    {
      id: "trending",
      label: "Trending",
      content: <Grid products={trending} badgeLabel="Hot" />,
    },
    {
      id: "new",
      label: "New arrivals",
      content: <Grid products={newest} badgeLabel="New" />,
    },
    {
      id: "deals",
      label: "Best value",
      content: <Grid products={deals} badgeLabel="Deal" />,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Handpicked"
          title="What everyone is buying"
          description="Updated every hour from what is actually moving off the shelves."
          href="/products"
          linkLabel="Shop all products"
        />
      </Reveal>

      <Reveal delay={80} className="mt-8">
        <ProductTabs tabs={tabs} />
      </Reveal>
    </section>
  );
}
