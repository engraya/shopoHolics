import image1 from "@public/assets/heroImages/1.jpg"
import image2 from "@public/assets/heroImages/2.jpg"
import image3 from "@public/assets/heroImages/3.jpg"
import image4 from "@public/assets/heroImages/4.jpg"
import image5 from "@public/assets/heroImages/5.jpg"
import image6 from "@public/assets/heroImages/6.jpg"
import image7 from "@public/assets/heroImages/7.jpg"
import Image from "next/image"
import Link from "next/link"

export default function Home() {

  return (
    <>
        <div className="mx-auto max-w-2xl py-32 sm:py-32 lg:py-48">
    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
      <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
        Announcing our next round of funding.{' '}
        <a href="#" className="font-semibold text-indigo-600">
          <span className="absolute inset-0" aria-hidden="true" />
          Read more <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Data to enrich your online business
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
        fugiat veniam occaecat fugiat aliqua.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          href="/products"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Get started
        </Link>
        <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
          Learn more <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </div>
  <div className="relative overflow-hidden">
  <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
    <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
      <div className="sm:max-w-lg">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Summer styles are finally here
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          This year, our new summer collection will shelter you from the harsh elements of a world that doesn't care
          if you live or die.
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
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                  <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                    <Image
                    src={image1}
                    height={39}
                    width={39}
                    alt="Image1"
                    className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="h-64 w-44 overflow-hidden rounded-lg">
                  <Image
                    src={image2}
                    height={39}
                    width={39}
                    alt="Image2"
                    className="h-full w-full object-cover object-center"
                    />
       
                  </div>
                </div>
                <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                  <div className="h-64 w-44 overflow-hidden rounded-lg">
                  <Image
                    src={image3}
                    height={39}
                    width={39}
                    alt="Image3"
                    className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="h-64 w-44 overflow-hidden rounded-lg">
                  <Image
                    src={image4}
                    height={39}
                    width={39}
                    alt="Image4"
                    className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="h-64 w-44 overflow-hidden rounded-lg">
                  <Image
                    src={image5}
                    height={39}
                    width={39}
                    alt="Image5"
                    className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
                <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                  <div className="h-64 w-44 overflow-hidden rounded-lg">
                  <Image
                    src={image6}
                    height={39}
                    width={39}
                    alt="Image6"
                    className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="h-64 w-44 overflow-hidden rounded-lg">
                  <Image
                    src={image7}
                    height={39}
                    width={39}
                    alt="Image7"
                    className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/categories"
            className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700"
          >
            Shop Collection
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>
    </>

  );
}
