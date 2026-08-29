import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { expect, test, type Page } from "@playwright/test";

test.setTimeout(120_000);

const captureEnabled = process.env.CAPTURE_LEGACY_REFERENCE === "1";
const captureRoot = resolve(process.cwd(), "../../docs/design-reference/legacy");
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const legacyCartItem = {
  product: {
    category: "chips",
    createdAt: "2026-01-10T09:00:00.000Z",
    description: "Демонстраційний товар для перевірки старого інтерфейсу.",
    id: "local-mango",
    image: "/small-icon.png",
    inStock: true,
    isActive: true,
    isPopular: true,
    name: "Манго",
    organic: true,
    price: 300,
    weight: "50 г",
  },
  quantity: 2,
};

async function capture(page: Page, screen: string, viewport: (typeof viewports)[number]) {
  const outputPath = resolve(captureRoot, screen, `${viewport.name}-${viewport.width}x${viewport.height}.png`);

  await mkdir(dirname(outputPath), { recursive: true });
  await page.screenshot({ path: outputPath });
}

test.describe("read-only legacy design reference", () => {
  test.skip(!captureEnabled, "Run only through npm run capture:legacy-reference.");

  for (const viewport of viewports) {
    test(`captures authenticated legacy references at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.addInitScript(() => {
        sessionStorage.setItem("dreamshop_private_maintenance_access", "granted");
      });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.evaluate((item) => {
        localStorage.setItem("dreamshop_cart", JSON.stringify([item]));
      }, legacyCartItem);

      await page.goto("/checkout", { waitUntil: "domcontentloaded" });
      await expect(page.getByText("Оформлення замовлення", { exact: true })).toBeVisible();
      await capture(page, "checkout", viewport);

      await page.goto("/profile", { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 1, name: "Мій профіль" })).toBeVisible();
      await capture(page, "account", viewport);

      await page.goto("/admin", { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
      await capture(page, "admin-dashboard", viewport);

      await page.getByRole("link", { name: "Продукты" }).click();
      await expect(page.getByText("Управление товарами", { exact: true })).toBeVisible();
      if (viewport.width > 768) {
        await page.getByRole("button", { name: "Добавить товар" }).click();
        await expect(page.getByText("Добавить товар", { exact: true }).last()).toBeVisible();
      } else {
        await page.locator("nav i").first().click();
        const mangoCard = page
          .getByRole("heading", { level: 4, name: "Манго" })
          .locator("xpath=ancestor::*[.//button][1]");
        await mangoCard.getByRole("button").nth(3).click();
        await expect(page.getByText("Редактировать товар", { exact: true })).toBeVisible();
      }
      await capture(page, "admin-product-editor", viewport);

      await page.goto("/admin", { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
      await page.getByRole("link", { name: "Заказы" }).click();
      await expect(page.getByText("Управление заказами", { exact: true })).toBeVisible();
      await capture(page, "admin-orders", viewport);
    });
  }
});
