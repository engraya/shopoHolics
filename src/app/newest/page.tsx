import PageContainer from '../components/PageContainer'
import Link from "next/link";
import { simplifiedProduct } from "../interface";
import { client } from "../lib/sanity";
import { ArrowRight } from "lucide-react";
import Image from "next/image";



async function getNewestProductData() {
  const query = `*[_type == "product"][0...4] | order(_createdAt desc) {
        _id,
          price,
        name,
          "slug": slug.current,
          "categoryName": category->name,
          "imageUrl": images[0].asset->url
      }`;

  const data = await client.fetch(query);

  return data;
}


async function page() {

  const data: simplifiedProduct[] = await getNewestProductData();
  return (
    <PageContainer>
              <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex justify-center text-center">
            Our Newest products
          </h2>

          <Link className="text-primary flex items-center gap-x-1" href="/products">
            See All{" "}
            <span>
              <ArrowRight />
            </span>
          </Link>
        </div>

        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16">
      {data.map((product) => (
          <Link key={product.slug} href={`/product/${product.slug}`} className="group">
        <article className="relative flex flex-col overflow-hidden rounded-lg border">
          <div className="aspect-square overflow-hidden">
            <Image
                 src={product.imageUrl}
                 alt="product image"
                 width={70}
                 height={70}
                 className="h-full w-full object-cover transition-all duration-300 group-hover:scale-125"
                />
          </div>
          <div className="absolute top-0 m-2 rounded-full bg-green-600">
            <p className="rounded-full bg-emerald-500 p-1 text-[8px] font-bold uppercase tracking-wide text-white sm:py-1 sm:px-3">Sale</p>
          </div>
          <div className="my-4 mx-auto flex w-10/12 flex-col items-start justify-between">
            <div className="mb-2 flex">
              <p className="mr-3 text-sm font-semibold">₦ {product.price}</p>
            </div>
            <Link href={`/product/${product.slug}`}>
              {product.name}
            </Link>
            <h6 className="mb-2 text-sm text-gray-400">{product.categoryName}</h6>
          </div>
          <button className="group mx-auto mb-2 flex h-10 w-10/12 items-stretch overflow-hidden rounded-md text-gray-600">
            <div className="flex w-full items-center justify-center bg-green-600 text-white text-xs uppercase transition group-hover:bg-emerald-600 group-hover:text-white">Add</div>
            <div className="flex items-center justify-center bg-gray-200 px-5 transition group-hover:bg-emerald-500 group-hover:text-white">+</div>
          </button> 
        </article>
          </Link>
        ))}
     
      </div>
    </div>

    </PageContainer>
  )
}

export default page
