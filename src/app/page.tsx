import LandingPageCollections from "./components/LandingPageCollections";
import Link from "next/link"
import React from "react";

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'


export default function Home() {


  return (
    <>
        <div className="mx-auto max-w-2xl py-32 sm:py-32 lg:py-">
    <div className="sm:mb-8 sm:flex sm:justify-center">
      <div className="relative rounded-full px-5 py-1 text-sm leading-6 text-gray-800 dark:text-slate-300 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
        Announcing our next Newest Products.{' '}
        <div className="flex justify-center items-center font-semibold text-indigo-800 dark:text-pink-400">
          <Link href="/newest">
          <span className="flex justify-center items-center text-center absolute inset-0" aria-hidden="true" />
          Explore<span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
    <div className="text-center ">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-slate-200 sm:text-5xl md:text-6xl">
        <span className="block xl:inline"><span className="mb-1 block">Discover Your Next Obsession or</span>
          <span className="bg-gradient-to-r from-indigo-400 to-pink-600 bg-clip-text text-transparent">
          Shop Smart, Shop
          </span>
        </span>
        <div className="mt-2">Fast { ""}
          <span className="relative mt-3 whitespace-nowrap text-blue-600"><svg aria-hidden="true" viewBox="0 0 418 42" className="absolute top-3/4 left-0 right-0 m-auto h-[0.58em] w-fit fill-pink-300" preserveAspectRatio="none">
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z">
              </path>
            </svg>
            <span className="relative">with Shopoholics</span>
          </span>
        </div>
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-lg text-gray-500 dark:text-slate-300 sm:mt-5 md:mt-5">
      Exclusive deals on top brands, fast checkout, and personalized recommendations.Diverse Product Range, Showcases the variety of products available, from electronics to fashion. 
      </p>
      <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
        <Link href="/products">
        <div className="rounded-md shadow">
          <div className="flex w-full items-center justify-center rounded-full border border-transparent bg-blue-600 px-6 py-1 text-base bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg hover:bg-blue-700 md:py-4 md:px-10 md:text-lg">Get started 🚀
          </div>
        </div>
        </Link>
     
      </div>
    </div>

  </div>
  <div className="relative overflow-hidden">
  <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
    <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
      <div className="sm:max-w-lg">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-slate-300 sm:text-4xl">
        Featured Products, Summer styles are finally here
        </h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-slate-300">
        A dynamic section showing trending or bestselling products, Latest additions to the catalog.
        </p>
      </div>
      <div>
        <div className="mt-10">
          {/* Decorative image grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
          >
            <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
           <LandingPageCollections/>
            </div>
          </div>

          <Link
            href="/categories"
          >
          <div className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg hover:bg-blue-700 md:py-4 md:px-10 md:text-lg">Get started 🚀
          </div>
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>
    </>

  );
}
