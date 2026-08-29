import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { expect, test, type Page } from "@playwright/test";

import { authenticateAsFixtureAdmin } from "./authenticated-fixture";

test.setTimeout(90_000);

const captureEnabled = process.env.CAPTURE_DESIGN_REFERENCE === "1";
const captureRoot = resolve(process.cwd(), "../../docs/design-reference/fixture");
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const cartItem = {
  id: "22222222-2222-4222-8222-222222222222",
  imageObjectKey: null,
  inStock: true,
  name: "Мангові чипси",
  price: 180,
  quantity: 2,
  slug: "mango-chips",
  stockQuantity: 9,
};

async function openPage(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(response?.ok()).toBe(true);
}

async function capture(page: Page, screen: string, viewport: (typeof viewports)[number]) {
  const outputPath = resolve(captureRoot, screen, `${viewport.name}-${viewport.width}x${viewport.height}.png`);

  await mkdir(dirname(outputPath), { recursive: true });
  await page.screenshot({ path: outputPath });
}

test.describe("design-reference fixture capture", () => {
  test.skip(!captureEnabled, "Run only through npm run capture:design-reference.");

  for (const viewport of viewports) {
    test(`captures deterministic storefront states at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);

      const screens = [
        { heading: "Ласкаво просимо до DreamShop", name: "home", path: "/" },
        { heading: "Каталог", name: "catalog", path: "/catalog" },
        { heading: "Мангові чипси", name: "product", path: "/product/mango-chips" },
        {
          heading: "Полуничні чипси",
          name: "product-unavailable",
          path: "/product/strawberry-chips",
        },
        { heading: "Кошик порожній", name: "cart-empty", path: "/cart" },
        { heading: "Раді бачити знову", name: "auth", path: "/auth" },
        {
          heading: "Раді бачити знову",
          name: "auth-error",
          path: "/auth?error=google",
        },
        {
          heading: "Раді бачити знову",
          name: "auth-success",
          path: "/auth?notice=password-updated",
        },
      ];

      for (const screen of screens) {
        await openPage(page, screen.path);
        await expect(
          page.getByRole("heading", { level: 1, name: screen.heading }),
        ).toBeVisible();
        await capture(page, screen.name, viewport);
      }

      await page.goto("/");
      await page.evaluate((item) => {
        localStorage.setItem("dreamshop_cart_v1", JSON.stringify([item]));
      }, cartItem);
      await openPage(page, "/cart");
      await expect(page.getByRole("heading", { level: 1, name: "Кошик" })).toBeVisible();
      await capture(page, "cart-populated", viewport);

      await authenticateAsFixtureAdmin(page.context());
      const authenticatedScreens = [
        { heading: "Оформлення замовлення", name: "checkout", path: "/checkout" },
        { heading: "Вітаємо, Олена", name: "account", path: "/account" },
        { heading: "Огляд роботи", name: "admin-dashboard", path: "/admin/dashboard" },
        {
          heading: "Мангові чипси",
          name: "admin-product-editor",
          path: "/admin/products/22222222-2222-4222-8222-222222222222",
        },
        { heading: "Замовлення", name: "admin-orders", path: "/admin/orders" },
      ];

      for (const screen of authenticatedScreens) {
        await openPage(page, screen.path);
        await expect(
          page.getByRole("heading", { level: 1, name: screen.heading }),
        ).toBeVisible();
        if (screen.name === "checkout") {
          await expect(
            page.getByRole("heading", { level: 2, name: "Одержувач" }),
          ).toBeVisible();
        }
        await capture(page, screen.name, viewport);
      }
    });
  }
});
