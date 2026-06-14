"use client";

import { Button } from "@/components/ui/button";
import { useShoppingCart } from "use-shopping-cart";
import type { CartItem } from "@/types";

interface AddToCartButtonProps extends CartItem {
  className?: string;
}

export default function AddToCartButton({
  currency,
  description,
  image,
  name,
  price,
  price_id,
  className,
}: AddToCartButtonProps) {
  const { addItem, handleCartClick } = useShoppingCart();

  const product = { name, description, price, currency, image, price_id };

  return (
    <Button
      className={className}
      onClick={() => {
        addItem(product);
        handleCartClick();
      }}
    >
      Add To Cart
    </Button>
  );
}
