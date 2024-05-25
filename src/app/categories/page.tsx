import Link from "next/link"
import { client } from "../lib/sanity" 
import Image from "next/image"


interface Category {
  name : string
  images: string[];
  imageUrl :string
}


  export async function getCategories() {

    const query = `*[_type == "category"]{
      _id,
      name,
        "imageUrl": images[0].asset->url
    }`;

    const categories = await client.fetch(query);
    return categories;
  }
  
async function Categories() {

  const categories = await getCategories();


  return (
    <div>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-28">
      <h2 className="text-3xl text-center font-extrabold text-gray-900 bg-gradient-to-r from-indigo-400 to-pink-600 bg-clip-text text-transparent sm:text-4xl md:text-4xl">Popular Categories</h2>
        <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
          {categories.map((category : Category) => (
            <Link href={`/categories/${category.name}`}>
                   <div key={category.name} className="group relative mb-4">
              <div className="relative h-80 overflow-hidden border rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75">
              <Image
               src={category.imageUrl}
                 alt="product image"
                 className="w-full h-full object-cover object-center lg:h-full lg:w-full"
                  width={300}
                  height={300}
                />
              </div>
              <h3 className="mt-3 text-xl text-gray-900 dark:text-slate-100 font-bold flex justify-center items-center">
                  <span className="absolute inset-0" />
                  {category.name}
              </h3>
            </div>
            </Link>
     
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Categories
