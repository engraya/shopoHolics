import { sanityClient } from './client';
import type { Product, ProductSummary, Category } from '@/types';

export const PRODUCTS_REVALIDATE = 60;
export const CATEGORIES_REVALIDATE = 300;
export const PRODUCT_DETAIL_REVALIDATE = 60;
export const NEWEST_REVALIDATE = 120;

// Shared projection strings — single source of truth for field selection
const PRODUCT_SUMMARY_PROJECTION = `
  _id,
  price,
  price_id,
  name,
  "slug": slug.current,
  "categoryName": category->name,
  "imageUrl": images[0].asset->url
`;

const PRODUCT_DETAIL_PROJECTION = `
  _id,
  images,
  price,
  name,
  description,
  "slug": slug.current,
  "categoryName": category->name,
  price_id
`;

// --- Product queries ---

export async function getAllProducts(): Promise<ProductSummary[]> {
  return sanityClient.fetch(
    `*[_type == "product"] { ${PRODUCT_SUMMARY_PROJECTION} }`,
    {},
    { next: { revalidate: PRODUCTS_REVALIDATE } }
  );
}

export async function getNewestProducts(limit = 4): Promise<ProductSummary[]> {
  return sanityClient.fetch(
    `*[_type == "product"][0...$limit] | order(_createdAt desc) { ${PRODUCT_SUMMARY_PROJECTION} }`,
    { limit: limit - 1 },
    { next: { revalidate: NEWEST_REVALIDATE } }
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0] { ${PRODUCT_DETAIL_PROJECTION} }`,
    { slug },
    { next: { revalidate: PRODUCT_DETAIL_REVALIDATE } }
  );
}

export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  return sanityClient.fetch(
    `*[_type == "product"] { "slug": slug.current }`,
    {},
    { next: { revalidate: PRODUCTS_REVALIDATE } }
  );
}

// --- Category queries ---

export async function getAllCategories(): Promise<Category[]> {
  return sanityClient.fetch(
    `*[_type == "category"] { _id, name, "imageUrl": images[0].asset->url }`,
    {},
    { next: { revalidate: CATEGORIES_REVALIDATE } }
  );
}

export async function getProductsByCategory(
  categoryName: string
): Promise<ProductSummary[]> {
  return sanityClient.fetch(
    `*[_type == "product" && category->name == $categoryName] { ${PRODUCT_SUMMARY_PROJECTION} }`,
    { categoryName },
    { next: { revalidate: CATEGORIES_REVALIDATE } }
  );
}
