import Link from "next/link";
import { simplifiedProduct } from "../../interface";
import { client } from "../../lib/sanity";
import Image from "next/image";

async function getData(cateogry: string) {
  const query = `*[_type == "product" && category->name == "${cateogry}"] {
        _id,
          "imageUrl": images[0].asset->url,
          price,
          name,
          "slug": slug.current,
          "categoryName": category->name
      }`;

  const data = await client.fetch(query);

  return data;
}

export const dynamic = "force-dynamic";


  
async function Categories({
    params,
  }: {
    params: { category: string };
  }) {

    const data: simplifiedProduct[] = await getData(params.category);


  return (
    <div>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
        <h2 className="text-2xl font-bold text-gray-900 text-center justify-center flex">Awesome Products for {params.category}</h2>

        <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
          {data.map((product) => (
            <div key={product.name} className="group relative">
              <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                <Image
                  src={product.imageUrl}
                  alt="image"
                  className="h-full w-full object-cover object-center"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="mt-6 text-sm text-gray-500">
                <Link href={`/product/${product.slug}`}>
                  <span className="absolute inset-0" />
                  {product.name}
                </Link>
              </h3>
              <p className="text-sm font-medium text-gray-900">
                  ${product.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Categories
