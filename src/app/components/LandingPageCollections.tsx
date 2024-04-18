import image1 from "@public/assets/heroImages/1.jpg"
import image2 from "@public/assets/heroImages/2.jpg"
import image3 from "@public/assets/heroImages/3.jpg"
import image4 from "@public/assets/heroImages/4.jpg"
import image5 from "@public/assets/heroImages/5.jpg"
import image6 from "@public/assets/heroImages/6.jpg"
import image7 from "@public/assets/heroImages/7.jpg"
import Image from "next/image"

function LandingPageCollections() {
  return (
//     <div className="flex items-center space-x-6 lg:space-x-8">
//     <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
//       <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
//         <Image
//         src={image1}
//         height={39}
//         width={39}
//         alt="Image1"
//         className="h-full w-full object-cover object-center"
//         />
//       </div>
//       <div className="h-64 w-44 overflow-hidden rounded-lg">
//       <Image
//         src={image2}
//         height={39}
//         width={39}
//         alt="Image2"
//         className="h-full w-full object-cover object-center"
//         />

//       </div>
//     </div>
//     <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
//       <div className="h-64 w-44 overflow-hidden rounded-lg">
//       <Image
//         src={image3}
//         height={39}
//         width={39}
//         alt="Image3"
//         className="h-full w-full object-cover object-center"
//         />
//       </div>
//       <div className="h-64 w-44 overflow-hidden rounded-lg">
//       <Image
//         src={image4}
//         height={39}
//         width={39}
//         alt="Image4"
//         className="h-full w-full object-cover object-center"
//         />
//       </div>
//       <div className="h-64 w-44 overflow-hidden rounded-lg">
//       <Image
//         src={image5}
//         height={39}
//         width={39}
//         alt="Image5"
//         className="h-full w-full object-cover object-center"
//         />
//       </div>
//     </div>
//     <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
//       <div className="h-64 w-44 overflow-hidden rounded-lg">
//       <Image
//         src={image6}
//         height={39}
//         width={39}
//         alt="Image6"
//         className="h-full w-full object-cover object-center"
//         />
//       </div>
//       <div className="h-64 w-44 overflow-hidden rounded-lg">
//       <Image
//         src={image7}
//         height={39}
//         width={39}
//         alt="Image7"
//         className="h-full w-full object-cover object-center"
//         />
//       </div>
//     </div>
//   </div>

<div className="flex items-center space-x-6 lg:space-x-8">
<div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
  <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
    <img
      src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-01.jpg"
      alt=""
      className="h-full w-full object-cover object-center"
    />
  </div>
  <div className="h-64 w-44 overflow-hidden rounded-lg">
    <img
      src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-02.jpg"
      alt=""
      className="h-full w-full object-cover object-center"
    />
  </div>
</div>
<div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
  <div className="h-64 w-44 overflow-hidden rounded-lg">
    <img
      src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-03.jpg"
      alt=""
      className="h-full w-full object-cover object-center"
    />
  </div>
  <div className="h-64 w-44 overflow-hidden rounded-lg">
    <img
      src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-04.jpg"
      alt=""
      className="h-full w-full object-cover object-center"
    />
  </div>
  <div className="h-64 w-44 overflow-hidden rounded-lg">
    <img
      src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-05.jpg"
      alt=""
      className="h-full w-full object-cover object-center"
    />
  </div>
</div>
<div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
  <div className="h-64 w-44 overflow-hidden rounded-lg">
    <img
      src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-06.jpg"
      alt=""
      className="h-full w-full object-cover object-center"
    />
  </div>
  <div className="h-64 w-44 overflow-hidden rounded-lg">
    <img
      src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-07.jpg"
      alt=""
      className="h-full w-full object-cover object-center"
    />
  </div>
</div>
</div>
  )
}

export default LandingPageCollections
