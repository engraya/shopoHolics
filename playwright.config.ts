import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

/**
 * Smoke-level E2E. The storefront is driven by the public DummyJSON API and
 * needs no database, so the dev server boots with throwaway secrets just to
 * satisfy the Prisma/Auth singletons at import time.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          DATABASE_URL:
            process.env.DATABASE_URL ?? "postgresql://e2e:e2e@localhost:5432/e2e",
          AUTH_SECRET: process.env.AUTH_SECRET ?? "e2e-only-dummy-secret",
          NEXT_TELEMETRY_DISABLED: "1",
        },
      },
});
