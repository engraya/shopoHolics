import { describe, it, expect } from "vitest";
import { cn, formatPrice, formatMinor } from "./utils";

describe("cn", () => {
  it("joins truthy class names and drops falsy ones", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("lets a later Tailwind class win a conflict", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("formatPrice", () => {
  it("formats whole Naira with grouping", () => {
    expect(formatPrice(1500)).toContain("1,500");
  });
});

describe("formatMinor", () => {
  it("treats its input as kobo and matches the Naira formatting", () => {
    expect(formatMinor(150_000)).toBe(formatPrice(1500));
  });

  it("accepts a bigint straight from Prisma", () => {
    expect(formatMinor(BigInt(150_000))).toBe(formatPrice(1500));
  });
});
