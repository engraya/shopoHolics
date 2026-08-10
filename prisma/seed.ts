import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Seeds the catalogue from dummyjson into Neon.
 *
 * Deliberately standalone: it does NOT import from `src/`, because those
 * modules pull in `next` and this runs as a plain node/tsx script.
 *
 * Idempotent — products upsert on `sourceId` and categories on `slug`, so
 * re-running updates prices rather than duplicating rows.
 *
 *   npx tsx prisma/seed.ts
 */

const SOURCE = "https://dummyjson.com/products?limit=194";

/**
 * dummyjson prices are notional USD (e.g. 9.99). Scale to plausible Naira.
 * Must match NGN_PRICE_MULTIPLIER in src/lib/api/queries.ts.
 */
const NGN_PRICE_MULTIPLIER = 1500;
/** Strike-through price, replacing the hardcoded `price * 1.3` in the UI. */
const COMPARE_AT_RATIO = 1.3;

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock?: number;
  thumbnail: string;
  images: string[];
}

function toTitleCase(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Whole Naira -> kobo, kept integral so no fractional kobo can appear. */
function toKobo(usdish: number): number {
  return Math.round(usdish * NGN_PRICE_MULTIPLIER) * 100;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set — cannot seed.");
  }

  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  const db = new PrismaClient({ adapter });

  try {
    console.log("Fetching catalogue from dummyjson…");
    const res = await fetch(SOURCE);
    if (!res.ok) throw new Error(`dummyjson responded ${res.status}`);

    const { products } = (await res.json()) as { products: DummyProduct[] };
    if (!products?.length) throw new Error("dummyjson returned no products");

    // Categories first — products carry a required FK to them.
    const categorySlugs = Array.from(
      new Set(products.map((p) => p.category))
    ).sort();
    const categoryIdBySlug = new Map<string, string>();

    for (let index = 0; index < categorySlugs.length; index += 1) {
      const slug = categorySlugs[index];
      // A representative image for the category tile.
      const sample = products.find((p) => p.category === slug);
      const category = await db.category.upsert({
        where: { slug },
        create: {
          slug,
          name: toTitleCase(slug),
          imageUrl: sample?.thumbnail ?? null,
          sortOrder: index,
        },
        update: {
          name: toTitleCase(slug),
          imageUrl: sample?.thumbnail ?? null,
          sortOrder: index,
        },
      });
      categoryIdBySlug.set(slug, category.id);
    }
    console.log(`Seeded ${categoryIdBySlug.size} categories.`);

    let count = 0;
    for (const p of products) {
      const categoryId = categoryIdBySlug.get(p.category);
      if (!categoryId) continue; // unreachable, but keeps the FK write total

      const priceCents = toKobo(p.price);
      // `slug` stays the numeric id so existing /product/<id> links keep working.
      const slug = String(p.id);
      const images = p.images?.length ? p.images : [p.thumbnail];

      const data = {
        slug,
        name: p.title,
        description: p.description,
        priceCents,
        compareAtCents: Math.round(priceCents * COMPARE_AT_RATIO),
        currency: "NGN",
        images,
        thumbnail: p.thumbnail,
        stock: p.stock ?? 0,
        isActive: true,
        categoryId,
      };

      await db.product.upsert({
        where: { sourceId: String(p.id) },
        create: { ...data, sourceId: String(p.id) },
        update: data,
      });
      count += 1;
    }

    console.log(`Seeded ${count} products.`);
  } finally {
    // Always release the pool, or the script hangs on a live connection.
    await db.$disconnect().catch(() => {});
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
