import { describe, it, expect } from "vitest";
import type { Order, OrderItem } from "@prisma/client";
import { serializeOrder, serializeOrderItem } from "./serialize";

// Prisma types the *Cents columns as bigint; construct minimal rows to match.
const item = {
  id: "item_1",
  orderId: "ord_1",
  productId: "42",
  name: "Essence Mascara",
  imageUrl: "https://cdn.example/1.jpg",
  slug: "42",
  priceCents: BigInt(150_000),
  quantity: 2,
} as unknown as OrderItem;

const order = {
  id: "ord_1",
  paystackReference: "shp_abc",
  status: "PAID",
  subtotalCents: BigInt(300_000),
  shippingCents: BigInt(0),
  taxCents: BigInt(0),
  discountCents: BigInt(50_000),
  totalCents: BigInt(250_000),
  currency: "NGN",
  items: [item],
} as unknown as Order & { items: OrderItem[] };

describe("serializeOrderItem", () => {
  it("widens priceCents from bigint to number", () => {
    const out = serializeOrderItem(item);
    expect(out.priceCents).toBe(150_000);
    expect(typeof out.priceCents).toBe("number");
    expect(out.name).toBe("Essence Mascara");
  });
});

describe("serializeOrder", () => {
  it("converts every money column and its items to numbers", () => {
    const out = serializeOrder(order);
    expect(out.subtotalCents).toBe(300_000);
    expect(out.discountCents).toBe(50_000);
    expect(out.totalCents).toBe(250_000);
    expect(out.items[0].priceCents).toBe(150_000);
    // The result must survive JSON.stringify, which throws on bigint.
    expect(() => JSON.stringify(out)).not.toThrow();
  });
});
