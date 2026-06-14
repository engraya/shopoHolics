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
