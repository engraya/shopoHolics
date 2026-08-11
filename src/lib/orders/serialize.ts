import type { Order, OrderItem } from "@prisma/client";

/**
 * Widens an order row for the wire.
 *
 * The money columns are BigInt, so Prisma types them as `bigint` — and
 * `JSON.stringify` throws on a bigint rather than degrading. Every order that
 * leaves the server as JSON therefore comes through here. Numbers are exact to
 * 2^53 kobo (~₦90tn), far past anything this store can charge, and `src/types`
 * already describes orders in `number`.
 */

export type SerializedOrder = Omit<
  Order,
  "subtotalCents" | "shippingCents" | "taxCents" | "discountCents" | "totalCents"
> & {
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  discountCents: number;
  totalCents: number;
  items: SerializedOrderItem[];
};

export type SerializedOrderItem = Omit<OrderItem, "priceCents"> & {
  priceCents: number;
};

export function serializeOrderItem(item: OrderItem): SerializedOrderItem {
  return { ...item, priceCents: Number(item.priceCents) };
}

export function serializeOrder(order: Order & { items: OrderItem[] }): SerializedOrder {
  return {
    ...order,
    subtotalCents: Number(order.subtotalCents),
    shippingCents: Number(order.shippingCents),
    taxCents: Number(order.taxCents),
    discountCents: Number(order.discountCents),
    totalCents: Number(order.totalCents),
    items: order.items.map(serializeOrderItem),
  };
}
