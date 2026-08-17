"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/context/CartContext";
import { toast } from "sonner";
import type { CartItem } from "@/types";

interface AddToCartButtonProps extends CartItem {
  className?: string;
}

export default function AddToCartButton({
  id,
  description,
  image,
  name,
  price,
  className,
}: AddToCartButtonProps) {
  const { addItem, handleCartClick } = useCart();

  return (
    <Button
      className={className}
      onClick={() => {
        addItem({ id, name, description, price, image });
        toast.success(`${name} added to cart`);
        handleCartClick();
      }}
    >
      Add To Cart
    </Button>
  );
}
