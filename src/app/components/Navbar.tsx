"use client"

import { useState } from 'react'
import { RxDropdownMenu } from "react-icons/rx";
import Image from 'next/image'
import logo from "@public/assets/logo.png"
import Link from 'next/link'
import cart from "@public/assets/cart.png"


const navigation = [
  { name: 'Products', href: '/products' },
  { name: 'Categories', href: '/categories' },
  { name: 'Reviews', href: '#' },
  { name: 'Store', href: '#' },
]

function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
            <Image
              src={logo}
              height={50}
              width={50}
              alt="logo"
              />
            </Link>
            <span className="text-black font-extrabold mt-4 mx-2">Shopoholics</span>
          </div>
          
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              {/* <Bars3Icon className="h-6 w-6" aria-hidden="true" /> */}
              <RxDropdownMenu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/">
              <Image
              src={cart}
              height={40}
              width={40}
              alt="cart"
              className='mx-3'
              />
            </Link>
            <h1  className="text-xl mt-1 font-semibold leading-6 text-gray-900">
              0
            </h1>
          </div>
        </nav>
      </header>

  )
}

export default Navbar
