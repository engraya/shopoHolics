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
<div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-black text-3xl text-center font-bold justify-center flex mb-6">Products</h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {products.map((product : Product) => (
            <Link key={product.id} href={`/product/${product.slug}`} className="group">
              <div className="w-full overflow-hidden object-cover object-center rounded-lg bg-gray-200">
                <Image
                src={urlFor(product.images[0]).url()}
                 alt="product image"
                 width={70}
                 height={70}
                 className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">  ₦ {product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products
