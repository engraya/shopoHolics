"use client"
import { urlFor } from "../lib/sanity";

export interface ProductCart {
  name: string;
  description: string;
  price: number;
  currency: string;
  image: any;
  price_id: string;
}

function AddToCart() {
  return (
    <div>
      <h1>Add To Cart</h1>
    </div>
  )
}

export default AddToCart
