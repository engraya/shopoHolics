export interface Product {
  _id: string;
  images: string[];
  price: number;
  slug: string;
  categoryName: string;
  name: string;
  description: string;
  price_id: string;
}

export interface ProductSummary {
  _id: string;
  imageUrl: string;
  price: number;
  slug: string;
  categoryName: string;
  name: string;
  price_id: string;
}

export interface Category {
  _id: string;
  name: string;
  imageUrl: string;
}

export interface CartItem {
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  price_id: string;
}

export interface Order {
  id: string;
  stripeSessionId: string;
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
  sanityProductId: string;
  priceId: string;
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
