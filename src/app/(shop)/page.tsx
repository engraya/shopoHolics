import {
  getAllCategories,
  getAllProducts,
  getNewestProducts,
  PRODUCTS_REVALIDATE,
} from "@/lib/api/queries";
import Hero from "@/features/landing/components/Hero";
import PerksMarquee from "@/features/landing/components/PerksMarquee";
import FeaturedProducts from "@/features/landing/components/FeaturedProducts";
import CategoryShowcase from "@/features/landing/components/CategoryShowcase";
import DealOfTheWeek from "@/features/landing/components/DealOfTheWeek";
import ValueProps from "@/features/landing/components/ValueProps";
import Testimonials from "@/features/landing/components/Testimonials";
import Newsletter from "@/features/landing/components/Newsletter";

export const revalidate = PRODUCTS_REVALIDATE;

export default async function Home() {
  const [allProducts, newestProducts, categories] = await Promise.all([
    getAllProducts(),
    getNewestProducts(8),
    getAllCategories(),
  ]);

  const trending = allProducts.slice(0, 8);
  const deals = [...allProducts].sort((a, b) => a.price - b.price).slice(0, 8);

  // The priciest item makes the most convincing "deal of the week".
  const headlineDeal = [...allProducts].sort((a, b) => b.price - a.price)[0];

  return (
    <>
      <Hero products={allProducts.slice(0, 3)} />
      <PerksMarquee />
      <FeaturedProducts
        trending={trending}
        newest={newestProducts}
        deals={deals}
      />
      <CategoryShowcase categories={categories} />
      <DealOfTheWeek product={headlineDeal} />
      <ValueProps />
      <Testimonials />
      <Newsletter />
    </>
  );
}
