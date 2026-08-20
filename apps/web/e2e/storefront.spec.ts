import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

for (const viewport of viewports) {
  test(`public home is usable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Ласкаво просимо до DreamShop" }),
    ).toBeVisible();

    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      )
      .toBe(true);
  });
}

test("public home has no serious or critical axe violations", async ({ page }) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const blockingViolations = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );

  expect(
    blockingViolations.map(({ id, nodes }) => ({ id, nodes: nodes.length })),
  ).toEqual([]);
});

test("mobile menu is keyboard-accessible and respects reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const menuToggle = page.locator(".store-menu-toggle");
  await menuToggle.focus();
  await expect(menuToggle).toBeFocused();
  await menuToggle.press("Enter");

  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#store-mobile-navigation")).toHaveClass(/is-open/);
  await page.keyboard.press("Escape");
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
});
