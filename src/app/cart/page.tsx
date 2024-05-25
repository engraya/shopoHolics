"use client";

import PageContainer from "../components/PageContainer"
import Link from "next/link"
import Image from "next/image";
import { useShoppingCart } from "use-shopping-cart";

function CartPage() {
  const {
    cartCount,
    cartDetails,
    removeItem,
    decrementItem,
    incrementItem,
    totalPrice,
    redirectToCheckout,
  } = useShoppingCart();


  async function handleCheckoutClick(event: any) {
    event.preventDefault();
    try {
      const result = await redirectToCheckout();
      if (result?.error) {
        console.log("result");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <PageContainer>
      <section className="h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
          <h2 className="text-3xl text-center font-bold text-gray-900 bg-gradient-to-r from-indigo-400 to-pink-600 bg-clip-text text-transparent sm:text-4xl md:text-4xl">Your Cart</h2>
          </div>
          { cartCount === 0 ? (
                     <div className="flex items-center justify-center">
                     <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">You Dont Have Items in Cart</h1>
                   </div>
          ) : (
            <div className="mx-auto mt-8 max-w-2xl md:mt-12">
            <div className="shadow">
              <div className="px-4 py-6 sm:px-8 sm:py-10">
                <div className="flow-root">
                  <ul className="-my-8">
                    {Object.values(cartDetails ?? {}).map((entry) => (
                    <li key={entry.id} className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0">
                    <div className="shrink-0">
                      <Link href={`/product/${entry.id}`}>
                      <Image src={entry.image as string} className="h-24 w-24 max-w-full rounded-lg object-cover" alt="product-image" height={100} width={100}/>
                      </Link>

                    </div>
                    <div className="relative flex flex-1 flex-col justify-between">
                      <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                        <div className="pr-8 sm:pr-5">
                          <p className="text-base font-semibold text-gray-900 dark:text-slate-100">{entry.name}</p>
                          <p className="mx-0 mt-1 mb-0 text-sm text-gray-400 dark:text-slate-100">${entry.price}</p>
                        </div>
                        <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                          <p className="shrink-0 w-20 text-base font-semibold text-gray-900 dark:text-slate-100 sm:order-2 sm:ml-8 sm:text-right">${entry.quantity * entry.price}</p>
                          <div className="sm:order-1">
                            <div className="mx-auto flex h-8 items-stretch text-gray-600">
                            <button
                              onClick={() => decrementItem(entry.id)}
                               className="flex items-center justify-center rounded-r-md bg-gray-200 px-4 transition hover:bg-cyan-100 hover:text-white">-</button>
                              <div className="flex w-full items-center justify-center bg-gray-100 px-4 text-xs uppercase transition">{entry.quantity}</div>
                              <button
                              onClick={() => incrementItem(entry.id)}
                               className="flex items-center justify-center rounded-r-md bg-gray-200 px-4 transition hover:bg-cyan-100 hover:text-white">+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto">
                        <button onClick={() => removeItem(entry.id)} className="flex rounded p-2 text-center text-gray-100 transition-all duration-200 ease-in-out focus:shadow hover:text-gray-900">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" className="" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                    ))}
                
                  </ul>
                </div>
                <div className="mt-6 border-t border-b py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 dark:text-cyan-100">Subtotal</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-cyan-100">${totalPrice}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xl font-bold text-gray-900 dark:text-cyan-100">Total</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-cyan-100"><span className="text-xs font-normal text-gray-400"></span>${totalPrice}</p>
                </div>
                <div className="mt-6 my-3 text-center">
                  <button type="button" onClick={handleCheckoutClick} className="group mb-2 inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">
                    Checkout
                    <svg xmlns="http://www.w3.org/2000/svg" className="group-hover:ml-8 ml-4 h-6 w-6 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  <Link href="/products">
                  <button className="group inline-flex w-full items-center justify-center rounded-md bg-green-600 px-6 py-2 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-cyan-800">
                    Continue Shopping
                  <svg className="w-6 h-6 text-gray-100 dark:text-white group-hover:ml-8 transition-all" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M14 7h-4v3a1 1 0 0 1-2 0V7H6a1 1 0 0 0-.997.923l-.917 11.924A2 2 0 0 0 6.08 22h11.84a2 2 0 0 0 1.994-2.153l-.917-11.924A1 1 0 0 0 18 7h-2v3a1 1 0 1 1-2 0V7Zm-2-3a2 2 0 0 0-2 2v1H8V6a4 4 0 0 1 8 0v1h-2V6a2 2 0 0 0-2-2Z" clipRule="evenodd" />
                  </svg>
                  </button>
                  </Link>
  
                </div>
              </div>
            </div>
          </div>
          )}

        </div>
      </section>
    </PageContainer>
  )
}

export default CartPage
