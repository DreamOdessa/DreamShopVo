import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

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

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    )
    .toBe(true);
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
      await expectNoHorizontalOverflow(page);
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
      blockingViolations.map(({ id, nodes }) => ({ id, nodes: nodes.length })),
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
