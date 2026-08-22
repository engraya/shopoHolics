import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  NGN_PRICE_MULTIPLIER,
  getAllProducts,
  getNewestProducts,
  getProductBySlug,
  getProductsByCategory,
} from "./queries";

const dummyProduct = {
  id: 1,
  title: "Essence Mascara Lash Princess",
  description: "A best-seller mascara.",
  category: "beauty-products",
  price: 9.99,
  thumbnail: "https://cdn.dummyjson.com/1/thumb.jpg",
  images: ["https://cdn.dummyjson.com/1/a.jpg"],
};

function mockFetchOnce(payload: unknown, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    json: async () => payload,
  } as Response);
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("NGN price conversion", () => {
  it("scales dummyjson USD-ish prices into whole Naira", () => {
    const fetchMock = mockFetchOnce({ products: [dummyProduct] });
    vi.stubGlobal("fetch", fetchMock);
    // 9.99 * 1500 = 14985, rounded.
    return getAllProducts().then((products) => {
      expect(NGN_PRICE_MULTIPLIER).toBe(1500);
      expect(products[0].price).toBe(Math.round(9.99 * NGN_PRICE_MULTIPLIER));
      expect(products[0].slug).toBe("1");
      expect(products[0].categoryName).toBe("Beauty Products");
    });
  });
});

describe("getProductBySlug", () => {
  it("returns null for a non-numeric slug without hitting the network", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await getProductBySlug("not-a-number")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("adapts a numeric slug into a Product", async () => {
    vi.stubGlobal("fetch", mockFetchOnce(dummyProduct));
    const product = await getProductBySlug("1");
    expect(product?.name).toBe("Essence Mascara Lash Princess");
    expect(product?.images).toEqual(dummyProduct.images);
  });

  it("returns null when the upstream responds not-ok", async () => {
    vi.stubGlobal("fetch", mockFetchOnce({}, false));
    expect(await getProductBySlug("999999")).toBeNull();
  });
});

describe("getNewestProducts", () => {
  it("requests the given limit, newest first", async () => {
    const fetchMock = mockFetchOnce({ products: [dummyProduct] });
    vi.stubGlobal("fetch", fetchMock);
    await getNewestProducts(2);
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("limit=2");
    expect(url).toContain("order=desc");
  });
});

describe("getProductsByCategory", () => {
  it("returns an empty list when the category is missing", async () => {
    vi.stubGlobal("fetch", mockFetchOnce({}, false));
    expect(await getProductsByCategory("nope")).toEqual([]);
  });
});
