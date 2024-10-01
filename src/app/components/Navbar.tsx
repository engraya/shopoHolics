"use client"

import { useState } from 'react';
import { RxDropdownMenu } from "react-icons/rx";
import Image from 'next/image';
import logo from "@public/assets/logo.png";
import Link from 'next/link';
import cart from "@public/assets/cart.png";
import { ThemeToggler } from '@components/ThemeToggler/ThemeToggler';
import { useShoppingCart } from "use-shopping-cart";
import { CardSheet } from './CardSheet';


const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Categories', href: '/categories' },
  { name: 'Newest', href: '/newest' },
  { name: 'Reviews', href: '/reviews' },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { cartCount } = useShoppingCart();

  return (
    <header className="absolute inset-x-0 top-0 z-50 lg:px-20">
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
          <Link href="/" className='mt-3'>
            <div className="text-gray-900 font-extrabold text-xl mx-2 dark:text-gray-100">Shopoholics</div>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-900 dark:text-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <RxDropdownMenu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12 p-3 bg-gradient-to-r from-blue-100 to-purple-500 rounded-full">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="text-md font-bold leading-6 text-gray-900 dark:text-slate-100">
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        </div>
        <CardSheet/>
        <div className='ml-4'>
          <ThemeToggler />
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-100 text-gray-800 border-t border-gray-200">
          <div className="p-6">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="block text-md font-bold leading-6 text-gray-900 dark:text-gray-900 py-2" onClick={() => setMobileMenuOpen(false)}>
                {item.name}
              </Link>
            ))}
            <div className="flex justify-center items-center mt-4">
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src={cart}
                  height={40}
                  width={40}
                  alt="cart"
                  className='mx-3'
                />
              </Link>
              <h3 className="text-xl mt-1 font-semibold leading-6 text-gray-900 dark:text-gray-800">
                {cartCount}
              </h3>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
