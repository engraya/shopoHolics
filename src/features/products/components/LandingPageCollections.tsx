import Image from "next/image"

const heroImages = [
  "https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-01.jpg",
  "https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-02.jpg",
  "https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-03.jpg",
  "https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-04.jpg",
  "https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-05.jpg",
  "https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-06.jpg",
  "https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-07.jpg",
];

export default function LandingPageCollections() {
  const [col1a, col1b, col2a, col2b, col2c, col3a, col3b] = heroImages;

  return (
    <div className="flex items-center space-x-6 lg:space-x-8">
      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
        <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
          <Image src={col1a} alt="" className="h-full w-full object-cover object-center" width={500} height={500} sizes="176px" />
        </div>
        <div className="h-64 w-44 overflow-hidden rounded-lg">
          <Image src={col1b} alt="" className="h-full w-full object-cover object-center" width={500} height={500} sizes="176px" />
        </div>
      </div>
      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
        <div className="h-64 w-44 overflow-hidden rounded-lg">
          <Image src={col2a} alt="" className="h-full w-full object-cover object-center" width={500} height={500} sizes="176px" />
        </div>
        <div className="h-64 w-44 overflow-hidden rounded-lg">
          <Image src={col2b} alt="" className="h-full w-full object-cover object-center" width={500} height={500} sizes="176px" />
        </div>
        <div className="h-64 w-44 overflow-hidden rounded-lg">
          <Image src={col2c} alt="" className="h-full w-full object-cover object-center" width={500} height={500} sizes="176px" />
        </div>
      </div>
      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
        <div className="h-64 w-44 overflow-hidden rounded-lg">
          <Image src={col3a} alt="" className="h-full w-full object-cover object-center" width={500} height={500} sizes="176px" />
        </div>
        <div className="h-64 w-44 overflow-hidden rounded-lg">
          <Image src={col3b} alt="" className="h-full w-full object-cover object-center" width={500} height={500} sizes="176px" />
        </div>
      </div>
    </div>
  )
}
