import Link from "next/link"
import { client } from "../lib/sanity" 
import Image from "next/image"
import { urlFor } from "../lib/sanity";

interface Product {
  name : string
  id : string
  price : number
  images : string[]
  slug : string
}


  export async function getProducts() {

    const query = `*[_type == "product"] {
      _id,
        price,
        images,
      name,
        "slug": slug.current,
        "categoryName": category->name,
        "imageUrl": images[0].asset->url
    }`;

    const products = await client.fetch(query); 
  
    return products
  }

async function Products() {

  const products = await getProducts();
  return (
    <section className="py-12 text-gray-700 sm:py-16 lg:py-20">
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">Popular Products</h2>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16">
        {products.map((product : Product) => (
          <Link key={product.id} href={`/product/${product.slug}`} className="group">
        <article className="relative flex flex-col overflow-hidden rounded-lg border">
          <div className="aspect-square overflow-hidden">
            <Image
                src={urlFor(product.images[0]).url()}
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
              <del className="text-xs text-gray-400">  ₦ 79.00 </del> 
            </div>
            <h3 className="mb-2 text-sm text-gray-400">{product.name}</h3>
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
  </section>

    
    
  )
}

export default Products
