import { describe, expect, it } from "vitest";

import { safeNextPath } from "./redirect";

describe("safeNextPath", () => {
  it("keeps an internal path, query, and hash", () => {
    expect(safeNextPath("/catalog?sort=price-asc#products")).toBe(
      "/catalog?sort=price-asc#products",
    );
  });

  it.each([
    ["https://example.com/account"],
    ["//example.com/account"],
    ["\\\\example.com\\account"],
    ["/account\\evil"],
    ["/account\u0000"],
  ])("rejects an unsafe redirect target: %s", (value) => {
    expect(safeNextPath(value)).toBe("/account");
  });

  it("uses the supplied fallback when no target is provided", () => {
    expect(safeNextPath(null, "/checkout")).toBe("/checkout");
  });
});
