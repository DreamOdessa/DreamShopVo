import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { authenticateAsFixtureAdmin } from "./authenticated-fixture";

test.setTimeout(90_000);

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

async function openPublicPage(page: Page, path = "/") {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });

  expect(response?.ok()).toBe(true);
}

const fixtureCartItem = {
  id: "22222222-2222-4222-8222-222222222222",
  imageObjectKey: null,
  inStock: true,
  name: "Мангові чипси",
  price: 180,
  quantity: 2,
  slug: "mango-chips",
  stockQuantity: 9,
};

async function seedFixtureCart(page: Page) {
  await page.addInitScript((item) => {
    localStorage.setItem("dreamshop_cart_v1", JSON.stringify([item]));
  }, fixtureCartItem);
}

async function expectNoHorizontalOverflow(page: Page, path: string) {
  const overflow = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    offenders:
      document.documentElement.scrollWidth > window.innerWidth
        ? Array.from(document.querySelectorAll<HTMLElement>("body *"))
            .map((element) => {
              const rect = element.getBoundingClientRect();
              return {
                className:
                  typeof element.className === "string"
                    ? element.className
                    : element.getAttribute("class") ?? "",
                right: Math.round(rect.right),
                tag: element.tagName,
                width: Math.round(rect.width),
              };
            })
            .filter((element) => element.right > window.innerWidth + 1)
            .slice(0, 8)
        : [],
    viewportWidth: window.innerWidth,
  }));

  expect(overflow, `Horizontal overflow at ${path}`).toEqual({
    documentWidth: overflow.viewportWidth,
    offenders: [],
    viewportWidth: overflow.viewportWidth,
  });
}

for (const viewport of viewports) {
  test(`public storefront screens are usable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const screens = [
      { heading: "Ласкаво просимо до DreamShop", path: "/" },
      { heading: "Каталог", path: "/catalog" },
      { heading: "Мангові чипси", path: "/product/mango-chips" },
      { heading: "Полуничні чипси", path: "/product/strawberry-chips" },
      { heading: "Кошик порожній", path: "/cart" },
      { heading: "Раді бачити знову", path: "/auth" },
    ];

    for (const screen of screens) {
      await openPublicPage(page, screen.path);
      await expect(
        page.getByRole("heading", { level: 1, name: screen.heading }),
      ).toBeVisible();
      if (screen.path === "/checkout") {
        const checkoutSummary = page.locator(".checkout-summary");

        await expect(
          page.getByRole("option", { name: "Переказ на рахунок" }),
        ).toHaveCount(0);
        await expect(
          checkoutSummary.getByText("Оплачується окремо перевізнику"),
        ).toBeVisible();
        await expect(
          checkoutSummary.getByText("Разом за товари"),
        ).toBeVisible();
      }
      await expectNoHorizontalOverflow(page, screen.path);
    }
  });

  test(`authenticated and admin screens are usable at ${viewport.name}`, async ({
    context,
    page,
  }) => {
    await page.setViewportSize(viewport);
    await authenticateAsFixtureAdmin(context);
    await seedFixtureCart(page);
    await page.goto("/");

    const screens = [
      { heading: "Оформлення замовлення", path: "/checkout" },
      { heading: "Вітаємо, Олена", path: "/account" },
      { heading: "Огляд роботи", path: "/admin/dashboard" },
      {
        heading: "Мангові чипси",
        path: "/admin/products/22222222-2222-4222-8222-222222222222",
      },
      { heading: "Замовлення", path: "/admin/orders" },
    ];

    for (const screen of screens) {
      await openPublicPage(page, screen.path);
      await expect(
        page.getByRole("heading", { level: 1, name: screen.heading }),
      ).toBeVisible();
      await expectNoHorizontalOverflow(page, screen.path);
    }
  });
}

test("public storefront has no serious or critical axe violations", async ({ page }) => {
  const publicPaths = [
    "/",
    "/catalog",
    "/product/mango-chips",
    "/product/strawberry-chips",
    "/cart",
    "/auth",
  ];

  for (const path of publicPaths) {
    await openPublicPage(page, path);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const blockingViolations = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );

    expect(
      blockingViolations.map(({ id, nodes }) => ({
        id,
        nodes: nodes.map(({ failureSummary, target }) => ({ failureSummary, target })),
      })),
      `Accessibility violations at ${path}`,
    ).toEqual([]);
  }
});

test("authenticated and admin references have no serious or critical axe violations", async ({
  context,
  page,
}) => {
  await authenticateAsFixtureAdmin(context);
  await seedFixtureCart(page);
  await page.goto("/");

  const authenticatedPaths = [
    "/checkout",
    "/account",
    "/admin/dashboard",
    "/admin/products/22222222-2222-4222-8222-222222222222",
    "/admin/orders",
  ];

  for (const path of authenticatedPaths) {
    await openPublicPage(page, path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const blockingViolations = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );

    expect(
      blockingViolations.map(({ id, nodes }) => ({
        id,
        nodes: nodes.map(({ failureSummary, target }) => ({ failureSummary, target })),
      })),
      `Accessibility violations at ${path}`,
    ).toEqual([]);
  }
});

test("private storefront routes preserve the sign-in handoff", async ({ page }) => {
  for (const path of ["/checkout", "/account"]) {
    await openPublicPage(page, path);
    const currentUrl = new URL(page.url());
    expect(currentUrl.pathname).toBe("/auth");
    expect(currentUrl.searchParams.get("next")).toBe(path);
    await expect(
      page.getByRole("heading", { level: 1, name: "Раді бачити знову" }),
    ).toBeVisible();
  }
});

test("unauthenticated admin routes require sign-in", async ({ page }) => {
  await openPublicPage(page, "/admin");
  expect(new URL(page.url()).pathname).toBe("/auth");
  await expect(
    page.getByRole("heading", { level: 1, name: "Раді бачити знову" }),
  ).toBeVisible();
});

test("legacy storefront routes use permanent canonical redirects", async ({ page }) => {
  const redirects = [
    { from: "/products", to: "/catalog" },
    { from: "/products/legacy-mango-chips", to: "/product/mango-chips" },
    { from: "/profile", to: "/account" },
    { from: "/orders", to: "/account#orders" },
  ];

  for (const { from, to } of redirects) {
    const response = await page.request.get(from, { maxRedirects: 0 });
    const location = response.headers().location;

    expect(response.status()).toBe(308);
    expect(location).toBeDefined();
    expect(new URL(location ?? "", "http://localhost:3012")).toHaveProperty(
      "pathname",
      to.split("#")[0],
    );
    expect(new URL(location ?? "", "http://localhost:3012")).toHaveProperty(
      "hash",
      to.includes("#") ? `#${to.split("#")[1]}` : "",
    );
  }
});

test("unknown legacy product routes remain a 404", async ({ page }) => {
  const response = await page.request.get("/products/unknown-legacy-product", {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(404);
});

test("unknown routes show the Ukrainian root 404 page", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Сторінку не знайдено" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Перейти до каталогу" })).toBeVisible();
  const robotsDirectives = await page.locator('meta[name="robots"]').evaluateAll(
    (elements) => elements.map((element) => element.getAttribute("content")),
  );
  expect(robotsDirectives).toContain("noindex");
});

test("homepage canonical and sitemap use the production site URL", async ({ page }) => {
  await openPublicPage(page);

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://dream-odessa.shop",
  );

  const sitemap = await page.request.get("/sitemap.xml");

  expect(sitemap.ok()).toBe(true);
  const sitemapXml = await sitemap.text();
  expect(sitemapXml).toContain("https://dream-odessa.shop</loc>");
  expect(sitemapXml).toContain("https://dream-odessa.shop/catalog</loc>");
  expect(sitemapXml).toContain(
    "https://dream-odessa.shop/product/mango-chips</loc>",
  );
});

test("catalog query variants are noindexed and use clean canonicals", async ({ page }) => {
  for (const [path, canonical] of [
    ["/catalog?q=манго&sort=price-asc&page=1", "https://dream-odessa.shop/catalog"],
    [
      "/catalog/fruit-chips?available=1",
      "https://dream-odessa.shop/catalog/fruit-chips",
    ],
  ]) {
    await openPublicPage(page, path);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      canonical,
    );
  }
});

test("homepage uses showcase and popular catalog flags", async ({ page }) => {
  await openPublicPage(page);

  const showcase = page.locator("#home-categories");
  const popularProducts = page.locator(".store-home-products");

  await expect(
    showcase.getByRole("heading", { name: "Фруктові чипси" }),
  ).toBeVisible();
  await expect(showcase.getByText("Прихована категорія")).toHaveCount(0);
  await expect(
    popularProducts.getByRole("heading", { name: "Популярні товари" }),
  ).toBeVisible();
  await expect(
    popularProducts.getByRole("link", {
      exact: true,
      name: "Мангові чипси",
    }),
  ).toBeVisible();
  const mangoCard = popularProducts.locator(".product-card").filter({
    hasText: "Мангові чипси",
  });
  await expect(mangoCard.getByRole("link")).toHaveCount(1);
  await expect(
    popularProducts.getByRole("link", {
      exact: true,
      name: "Полуничні чипси",
    }),
  ).toHaveCount(0);
});

test("mobile menu is keyboard-accessible and respects reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openPublicPage(page);

  const skipLink = page.getByRole("link", { name: "Перейти до основного вмісту" });
  await skipLink.focus();
  await skipLink.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  const menuToggle = page.locator(".store-menu-toggle");
  await menuToggle.focus();
  await expect(menuToggle).toBeFocused();
  await menuToggle.press("Enter");

  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#store-mobile-navigation")).toHaveClass(/is-open/);
  await expect(page.getByRole("button", { name: "Закрити меню" }).last()).toBeFocused();
  await expect.poll(() => page.evaluate(
    () => document.querySelector("#main-content")?.hasAttribute("inert") ?? false,
  )).toBe(true);

  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("link", { name: "Мій акаунт" }).last()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Закрити меню" }).last()).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
  await expect(menuToggle).toBeFocused();
  await expect.poll(() => page.evaluate(
    () => document.querySelector("#main-content")?.hasAttribute("inert") ?? false,
  )).toBe(false);
});

test("mobile checkout keeps recipient fields before the order summary", async ({
  context,
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await authenticateAsFixtureAdmin(context);
  await seedFixtureCart(page);
  await page.goto("/");

  await openPublicPage(page, "/checkout");

  const fields = page.locator(".checkout-fields");
  const summary = page.locator(".checkout-summary");
  const [fieldsBox, summaryBox] = await Promise.all([
    fields.boundingBox(),
    summary.boundingBox(),
  ]);

  expect(fieldsBox?.y).toBeLessThan(summaryBox?.y ?? 0);
  await expect(page.getByLabel("Ім’я")).toBeVisible();
  await expectNoHorizontalOverflow(page, "/checkout");
});
