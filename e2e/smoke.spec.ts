import { test, expect } from "@playwright/test";

/**
 * Storefront smoke path — the critical browse-to-product journey, no auth or
 * checkout (those need a live DB + Paystack). Product data is server-rendered
 * from DummyJSON, so this run needs outbound network.
 */
test.describe("storefront smoke", () => {
  test("home page renders with primary navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.+/);
    await expect(page.getByRole("navigation").first()).toBeVisible();
  });

  test("browse from listing to a product detail page", async ({ page }) => {
    await page.goto("/products");

    const firstProduct = page.locator('a[href^="/product/"]').first();
    await expect(firstProduct).toBeVisible({ timeout: 15_000 });
    await firstProduct.click();

    await expect(page).toHaveURL(/\/product\/.+/);
    await expect(
      page.getByRole("button", { name: /add to cart/i }).first()
    ).toBeVisible();
  });
});
