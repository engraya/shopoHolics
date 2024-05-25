import Link from "next/link";
import { simplifiedProduct } from "../../interface";
import { client } from "../../lib/sanity";
import Image from "next/image";
import AddToCart from "@src/app/components/AddToCart/AddToCart";
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

  
async function Categories({
    params,
  }: {
    params: { category: string };
  }) {

    const data: simplifiedProduct[] = await getData(params.category);


  return (
    <section className="py-12 text-gray-700 sm:py-16 lg:py-20">
 
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
    <nav aria-label="Breadcrumb">
      <Link href="/categories">
        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
        <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        Back
        </span>
        </button>
      </Link>
    </nav>
      <div className="mx-auto max-w-md text-center">
      <h2 className="text-3xl text-center font-ebold text-gray-900 bg-gradient-to-r from-indigo-400 to-pink-600 bg-clip-text text-transparent sm:text-4xl md:text-4xl">Products for {params.category}</h2>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16">
   
      {data.map((product) => (
        <article key={product.slug} className="relative flex flex-col overflow-hidden rounded-lg border">
         <Link key={product.slug} href={`/product/${product.slug}`} className="group">
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
              <del className="text-xs text-gray-400">  ₦ 79.00 </del> 
            </div>
       
            <Link href={`/product/${product.slug}`}>
            <h3 className="mb-2 text-sm text-gray-400">{product.name}</h3>
            </Link>
          </div>
          </Link>
          <div className="group mx-auto mb-2 flex h-10 items-stretch overflow-hidden rounded-md text-gray-600">
            <AddToCart
            currency="USD"
            description={""}
            image={product.imageUrl}
            name={product.name}
            price={product.price}
            key={product.slug}
            price_id={""}
            
            />
          </div> 
        </article>

        ))}
     
      </div>
    </div>
  </section>
  )
}

export default Categories
