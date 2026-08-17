export interface Product {
  _id: string;
  images: string[];
  /** Whole Naira. */
  price: number;
  slug: string;
  categoryName: string;
  name: string;
  description: string;
}

export interface ProductSummary {
  _id: string;
  imageUrl: string;
  /** Whole Naira. */
  price: number;
  slug: string;
  categoryName: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
  imageUrl: string;
}

/** A product as it sits in the cart. `id` is the product slug, so cart links resolve. */
export interface CartItem {
  id: string;
  name: string;
  description: string;
  /** Whole Naira. */
  price: number;
  image: string;
}

export interface CartEntry extends CartItem {
  quantity: number;
}

export interface Order {
  id: string;
  paystackReference: string;
  paystackTransactionId: string | null;
  status: string;
  totalCents: number;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  currency: string;
  customerEmail: string;
  customerName: string | null;
  shippingAddress: unknown;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  imageUrl: string;
  slug: string;
  priceCents: number;
  quantity: number;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}
