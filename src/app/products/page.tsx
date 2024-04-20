import Link from "next/link"
import { client } from "../lib/sanity" 
import Image from "next/image"

interface Product {
  name : string
  id : string
  price : number
  image : string
}


  export async function getProducts() {
    const products = await client.fetch('*[_type == "product"]'); 
  
    return products
  }

async function Products() {

  const products = await getProducts();
  return (
<div>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-black text-center font-bold justify-center flex mb-6">Products</h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {products.map((product : Product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <Image
                 src={`/${product.images[0].asset._ref}`}
                 alt="product image"
                 width={70}
                 height={70}
                 className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products
