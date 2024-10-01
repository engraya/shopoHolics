import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import cart from "@public/assets/cart.png";
import { useShoppingCart } from "use-shopping-cart";

export function CardSheet() {
  const {
    cartCount,
    cartDetails,
    removeItem,
    decrementItem,
    incrementItem,
    totalPrice,
    redirectToCheckout,
    clearCart,
  } = useShoppingCart();

  async function handleCheckoutClick(event: any) {
    event.preventDefault();
    try {
      const result = await redirectToCheckout();
      if (!result?.error) {
        clearCart();
      } else {
        console.error("Checkout error:", result.error);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
    clearCart();
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Image
            src={cart}
            height={40}
            width={40}
            alt="cart"
            className="mx-3"
          />
          <h3 className="text-xl mt-1 font-semibold leading-6 text-gray-900 dark:text-slate-100">
            {cartCount}
          </h3>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto max-h-screen">
        {/* Container for Cart Items */}
        <div className="py-4 flex flex-col justify-center items-center">
          <div className="container mx-auto flex flex-col items-center">
            {/* Cart Header */}
            <div className="flex justify-between items-center w-full mb-8">
              <h1 className="text-2xl font-bold">Shopping Cart</h1>
            </div>

            {/* Cart Items */}
            <div className="w-full space-y-8">
              {cartCount === 0 ? (
                <div className="flex items-center justify-center">
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
                    You Don&apos;t Have Items in Cart
                  </h1>
                </div>
              ) : (
                Object.values(cartDetails ?? {}).map((entry) => (
                  <div
                    key={entry.id} // Add a unique key for each item
                    className="flex flex-col md:flex-row border-b border-gray-400 items-center"
                  >
   
                    <Link href={`/product/${entry.id}`}>
                      <Image 
                          src={entry.image as string} 
                          className="h-24 w-24 max-w-full flex-shrink-0 rounded-lg object-cover"
                          alt="product-image"
                          height={100}
                          width={100}
                      />
                    </Link>

                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col justify-center items-start">
                      <h6 className="text-md font-bold">{entry.name}</h6>
                      <p className="mt-2 text-gray-600">{entry.description}</p>
                      <div className="mt-4 flex items-center w-full">
                        <span className="mr-2 text-gray-600">Quantity: {entry.quantity} </span>
                        <div className="flex items-center">
                        <button onClick={() => removeItem(entry.id)} className="flex rounded p-2 text-center text-gray-800 transition-all duration-200 ease-in-out focus:shadow hover:text-gray-900">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" className="" />
                          </svg>
                        </button>
                          <button
                            className="bg-gray-200 rounded-l-lg px-2 py-1"
                            onClick={() => decrementItem(entry.id)}
                          >
                            -
                          </button>
                          <span className="mx-2 text-gray-600">
                            {entry.quantity}
                          </span>
                          <button
                            className="bg-gray-200 rounded-r-lg px-2 py-1"
                            onClick={() => incrementItem(entry.id)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center w-full">
                        <span className="ml-auto font-bold">
                          ${entry.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Subtotal Section */}
            <div className="flex justify-end items-center w-full mt-8">
              <span className="text-gray-600 mr-4">Subtotal:</span>
              <span className="text-xl font-bold">${totalPrice}</span>
            </div>
            <div className="flex justify-center items-center border-t mt-4">
              <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleCheckoutClick}
              >
                Checkout
              </button>
            </div>
            <Link href="/products" className="mt-4">
              <button className="group inline-flex w-full items-center justify-center rounded-md bg-green-600 px-6 py-2 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-cyan-800">
                Continue Shopping
                <svg
                  className="w-6 h-6 text-gray-100 dark:text-white group-hover:ml-8 transition-all"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 7h-4v3a1 1 0 0 1-2 0V7H6a1 1 0 0 0-.997.923l-.917 11.924A2 2 0 0 0 6.08 22h11.84a2 2 0 0 0 1.994-2.153l-.917-11.924A1 1 0 0 0 18 7h-2v3a1 1 0 1 1-2 0V7Zm-2-3a2 2 0 0 0-2 2v1H8V6a4 4 0 0 1 8 0v1h-2V6a2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
