import type { Product, ProductSummary, Category } from '@/types';

const BASE_URL = 'https://dummyjson.com';

export const PRODUCTS_REVALIDATE = 60;
export const CATEGORIES_REVALIDATE = 300;
export const PRODUCT_DETAIL_REVALIDATE = 60;
export const NEWEST_REVALIDATE = 120;

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: string;
  images: string[];
}

interface DummyProductsResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

function toDisplayName(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function adaptSummary(p: DummyProduct): ProductSummary {
  return {
    _id: String(p.id),
    imageUrl: p.thumbnail,
    price: p.price,
    slug: String(p.id),
    categoryName: toDisplayName(p.category),
    name: p.title,
    price_id: `price_mock_${p.id}`,
  };
}

function adaptProduct(p: DummyProduct): Product {
  return {
    _id: String(p.id),
    images: p.images.length > 0 ? p.images : [p.thumbnail],
    price: p.price,
    slug: String(p.id),
    categoryName: toDisplayName(p.category),
    name: p.title,
    description: p.description,
    price_id: `price_mock_${p.id}`,
  };
}

export async function getAllProducts(): Promise<ProductSummary[]> {
  const res = await fetch(`${BASE_URL}/products?limit=194`, {
    next: { revalidate: PRODUCTS_REVALIDATE },
  });
  const data: DummyProductsResponse = await res.json();
  return data.products.map(adaptSummary);
}

export async function getNewestProducts(limit = 4): Promise<ProductSummary[]> {
  const res = await fetch(
    `${BASE_URL}/products?limit=${limit}&skip=0&sortBy=id&order=desc`,
    { next: { revalidate: NEWEST_REVALIDATE } }
  );
  const data: DummyProductsResponse = await res.json();
  return data.products.map(adaptSummary);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const id = parseInt(slug, 10);
  if (isNaN(id)) return null;

  const res = await fetch(`${BASE_URL}/products/${id}`, {
    next: { revalidate: PRODUCT_DETAIL_REVALIDATE },
  });
  if (!res.ok) return null;

  const p: DummyProduct = await res.json();
  return adaptProduct(p);
}

export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  const res = await fetch(`${BASE_URL}/products?limit=194`, {
    next: { revalidate: PRODUCTS_REVALIDATE },
  });
  const data: DummyProductsResponse = await res.json();
  return data.products.map((p) => ({ slug: String(p.id) }));
}

export async function getAllCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/products?limit=194`, {
    next: { revalidate: CATEGORIES_REVALIDATE },
  });
  const data: DummyProductsResponse = await res.json();

  const seen = new Set<string>();
  const categories: Category[] = [];

  for (const p of data.products) {
    if (!seen.has(p.category)) {
      seen.add(p.category);
      categories.push({
        _id: p.category,
        name: toDisplayName(p.category),
        imageUrl: p.thumbnail,
      });
    }
  }

  return categories;
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<ProductSummary[]> {
  const res = await fetch(
    `${BASE_URL}/products/category/${encodeURIComponent(categorySlug)}`,
    { next: { revalidate: CATEGORIES_REVALIDATE } }
  );
  if (!res.ok) return [];

  const data: DummyProductsResponse = await res.json();
  return data.products.map(adaptSummary);
}
