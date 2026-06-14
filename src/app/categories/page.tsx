import Link from "next/link"
import Image from "next/image"
import { getAllCategories, CATEGORIES_REVALIDATE } from "@/lib/api/queries"

export const revalidate = CATEGORIES_REVALIDATE;

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Categories</h1>
        <p className="mt-2 text-muted-foreground">Browse our curated collections</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link href={`/categories/${category._id}`} key={category._id}>
            <div className="group relative h-64 overflow-hidden rounded-xl border border-border bg-card hover:shadow-md hover:ring-1 hover:ring-primary/30 transition-all duration-200">
              <Image
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                width={400}
                height={256}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 px-4 py-3">
                <h3 className="text-base font-semibold text-white">
                  {category.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
