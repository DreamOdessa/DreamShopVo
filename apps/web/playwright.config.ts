import { defineConfig, devices } from "@playwright/test";

const port = 3012;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;
const captureDesignReference = process.env.CAPTURE_DESIGN_REFERENCE === "1";

export default defineConfig({
  testDir: "./e2e",
  testIgnore: captureDesignReference ? [] : "**/*.capture.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "node e2e/mock-supabase-server.mjs",
        reuseExistingServer: !process.env.CI,
        url: baseURL,
      },
});
