import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductCard from "./ProductCard";
import { formatPrice } from "@/lib/utils";
import type { ProductSummary } from "@/types";

// AddToCartButton is a client component that reaches for the cart context;
// stub it so this test stays focused on ProductCard's own rendering.
vi.mock("./AddToCartButton", () => ({
  default: () => <button type="button">Add To Cart</button>,
}));

// next/image and next/link don't need the Next runtime here.
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...(props as Record<string, string>)} />;
  },
}));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const product: ProductSummary = {
  _id: "42",
  slug: "42",
  name: "Essence Mascara Lash Princess",
  categoryName: "Beauty Products",
  price: 14985,
  imageUrl: "https://cdn.dummyjson.com/42/thumb.jpg",
};

describe("ProductCard", () => {
  it("renders the product name, category and image", () => {
    render(<ProductCard product={product} />);
    expect(
      screen.getByRole("heading", { name: product.name })
    ).toBeInTheDocument();
    expect(screen.getByText("Beauty Products")).toBeInTheDocument();
    expect(screen.getByAltText(product.name)).toBeInTheDocument();
  });

  it("shows the real price and a struck-through reference price", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText(formatPrice(product.price))).toBeInTheDocument();
    expect(
      screen.getByText(formatPrice(product.price * 1.3))
    ).toBeInTheDocument();
  });

  it("links to the product detail page", () => {
    render(<ProductCard product={product} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/product/42");
  });
});
