import Link from "next/link"
import { client } from "../lib/sanity" 
import Image from "next/image"
import { urlFor } from "../lib/sanity";
import AddToCart from "../components/AddToCart/AddToCart";

interface Product {
  name : string
  id : string
  price : number
  images : string[]
  slug : string
  price_id : string
}


  export async function getProducts() {

    const query = `*[_type == "product"] {
      _id,
        price,
        price_id,
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
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 bg-gradient-to-r from-indigo-400 to-pink-600 bg-clip-text text-transparent sm:text-4xl md:text-4xl">Popular Products</h2>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16">
        {products.map((product : Product) => (
        <article className="relative flex flex-col overflow-hidden rounded-lg border">
          <Link key={product.id} href={`/product/${product.slug}`}>
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
          <div className="my-1 mx-auto flex w-10/12 flex-col items-start justify-around dark:text-slate-100">
            <div className="mb-2 flex justify-between  dark:text-slate-100">
              <p className="mr-3 text-md whitespace-nowrap font-bold  dark:text-slate-100">₦ {product.price}</p>
              <del className="text-xs text-red-600  dark:text-pink-500">₦{product.price * 0.65}</del> 
            </div>
            <h3 className="mb-2 text-md text-gray-800  dark:text-slate-100">{product.name}</h3>
          </div>
          </Link>
          <div className="mx-auto mb-2 flex h-10 items-stretch overflow-hidden rounded-md text-gray-600">
            <AddToCart
              currency="USD"
              description={""}
              image={product.images[0]}
              name={product.name}
              price={product.price}
              key={product.id}
              price_id={product.price_id}
            />
          </div> 
        </article>
        ))}
      </div>
    </div>
  </section>

    
    
  )
}

export default Products
