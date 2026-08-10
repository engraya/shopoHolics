import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import type { Category } from "@/types";

interface CategoryShowcaseProps {
  categories: Category[];
}

/** Bento layout: the first tile is a 2x2 hero, the rest fill a 1x1 grid. */
const TILE_LAYOUT = [
  "col-span-2 row-span-2 min-h-[260px] sm:min-h-[320px] lg:min-h-0",
  "col-span-1 row-span-1 min-h-[150px]",
  "col-span-1 row-span-1 min-h-[150px]",
  "col-span-1 row-span-1 min-h-[150px]",
  "col-span-1 row-span-1 min-h-[150px]",
];

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  const tiles = categories.slice(0, 5);
  if (tiles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Collections"
          title="Shop by category"
          description="From everyday essentials to the pieces you have been saving for — every collection is curated by hand."
          href="/categories"
          linkLabel="All categories"
        />
      </Reveal>

      <div className="mt-10 grid auto-rows-[minmax(0,1fr)] grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2 lg:[&>*]:min-h-[190px]">
        {tiles.map((category, index) => (
          <Reveal
            key={category._id}
            delay={index * 80}
            className={cn(TILE_LAYOUT[index], "h-full")}
          >
            <Link
              href={`/categories/${category._id}`}
              className="group relative flex h-full w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                sizes={
                  index === 0
                    ? "(max-width: 1024px) 100vw, 50vw"
                    : "(max-width: 1024px) 50vw, 25vw"
                }
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-0 bg-gradient-brand opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-40" />

              <div className="relative mt-auto flex w-full items-end justify-between gap-2 p-4">
                <div>
                  <h3
                    className={cn(
                      "font-semibold text-white",
                      index === 0 ? "text-xl sm:text-2xl" : "text-sm sm:text-base"
                    )}
                  >
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs text-white/75 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Shop the collection
                  </p>
                </div>
                <span className="flex h-9 w-9 shrink-0 translate-y-1 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
