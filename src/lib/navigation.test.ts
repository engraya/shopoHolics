import { describe, it, expect } from "vitest";
import {
  PRIMARY_NAV,
  footerNav,
  isActivePath,
  safeCallbackUrl,
  DEFAULT_REDIRECT,
} from "./navigation";

const products = PRIMARY_NAV.find((i) => i.href === "/products")!;
const home = PRIMARY_NAV.find((i) => i.href === "/")!;

describe("isActivePath", () => {
  it("matches Home only on the exact root", () => {
    expect(isActivePath("/", home)).toBe(true);
    expect(isActivePath("/products", home)).toBe(false);
  });

  it("matches a nav item on its own prefix", () => {
    expect(isActivePath("/products", products)).toBe(true);
    expect(isActivePath("/products/all", products)).toBe(true);
  });

  it("matches Products on the /product detail prefix via `match`", () => {
    expect(isActivePath("/product/123", products)).toBe(true);
  });

  it("does not match an unrelated path", () => {
    expect(isActivePath("/categories", products)).toBe(false);
  });
});

describe("footerNav", () => {
  it("returns only items in the requested group", () => {
    expect(footerNav("shop").every((i) => i.footerGroup === "shop")).toBe(true);
    expect(footerNav("company").every((i) => i.footerGroup === "company")).toBe(
      true
    );
  });

  it("omits header-only items like Home", () => {
    expect(footerNav("shop").some((i) => i.href === "/")).toBe(false);
  });
});

describe("safeCallbackUrl", () => {
  it("passes a normal rooted path through (trimmed)", () => {
    expect(safeCallbackUrl("/account")).toBe("/account");
    expect(safeCallbackUrl("  /account/orders  ")).toBe("/account/orders");
  });

  it("rejects protocol-relative and backslash open-redirects", () => {
    expect(safeCallbackUrl("//evil.test")).toBe(DEFAULT_REDIRECT);
    expect(safeCallbackUrl("/\\evil.test")).toBe(DEFAULT_REDIRECT);
  });

  it("rejects absolute URLs", () => {
    expect(safeCallbackUrl("https://evil.test")).toBe(DEFAULT_REDIRECT);
  });

  it("rejects non-string and empty values", () => {
    expect(safeCallbackUrl(undefined)).toBe(DEFAULT_REDIRECT);
    expect(safeCallbackUrl(42)).toBe(DEFAULT_REDIRECT);
    expect(safeCallbackUrl("")).toBe(DEFAULT_REDIRECT);
  });
});
