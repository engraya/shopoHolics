import { test, expect } from "@playwright/test";

/**
 * Storefront smoke path — the critical browse-and-view journey, no auth or
 * checkout (those need a live DB + Paystack). Product data is server-rendered
 * from DummyJSON, so this run needs outbound network. Navigation is done by
 * URL rather than click interception to keep the smoke test deterministic.
 */
test.describe("storefront smoke", () => {
  test("home page renders with primary navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.+/);
    await expect(page.getByRole("navigation").first()).toBeVisible();
  });

  test("product listing renders product links", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator('a[href^="/product/"]').first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("product detail page shows an add-to-cart action", async ({ page }) => {
    await page.goto("/product/1");
    await expect(
      page.getByRole("button", { name: /add to cart/i }).first()
    ).toBeVisible({ timeout: 15_000 });
  });
});
