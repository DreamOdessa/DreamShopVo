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
      await expectNoHorizontalOverflow(page, screen.path);
    }
  });

  test(`authenticated and admin screens are usable at ${viewport.name}`, async ({
    context,
    page,
  }) => {
    await page.setViewportSize(viewport);
    await authenticateAsFixtureAdmin(context);
    await page.goto("/");
    await page.evaluate((item) => {
      localStorage.setItem("dreamshop_cart_v1", JSON.stringify([item]));
    }, {
      id: "22222222-2222-4222-8222-222222222222",
      imageObjectKey: null,
      inStock: true,
      name: "Мангові чипси",
      price: 180,
      quantity: 2,
      slug: "mango-chips",
      stockQuantity: 9,
    });

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
  await page.goto("/");
  await page.evaluate((item) => {
    localStorage.setItem("dreamshop_cart_v1", JSON.stringify([item]));
  }, {
    id: "22222222-2222-4222-8222-222222222222",
    imageObjectKey: null,
    inStock: true,
    name: "Мангові чипси",
    price: 180,
    quantity: 2,
    slug: "mango-chips",
    stockQuantity: 9,
  });

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

test("mobile menu is keyboard-accessible and respects reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openPublicPage(page);

  const menuToggle = page.locator(".store-menu-toggle");
  await menuToggle.focus();
  await expect(menuToggle).toBeFocused();
  await menuToggle.press("Enter");

  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#store-mobile-navigation")).toHaveClass(/is-open/);
  await page.keyboard.press("Escape");
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
});
