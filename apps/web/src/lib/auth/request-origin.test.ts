import { describe, expect, it } from "vitest";

import { selectAuthRedirectOrigin } from "./request-origin";

describe("selectAuthRedirectOrigin", () => {
  it("keeps OAuth on the active trusted Vercel deployment", () => {
    expect(
      selectAuthRedirectOrigin({
        nodeEnv: "production",
        productionUrl: "dreamshop-next.vercel.app",
        requestOrigin: "https://dreamshop-next.vercel.app",
        siteUrl: "https://dream-odessa.shop",
      }),
    ).toBe("https://dreamshop-next.vercel.app");
  });

  it("falls back to the canonical site for an untrusted origin", () => {
    expect(
      selectAuthRedirectOrigin({
        nodeEnv: "production",
        productionUrl: "dreamshop-next.vercel.app",
        requestOrigin: "https://attacker.example",
        siteUrl: "https://dream-odessa.shop",
      }),
    ).toBe("https://dream-odessa.shop");
  });

  it("allows the current localhost port outside production", () => {
    expect(
      selectAuthRedirectOrigin({
        nodeEnv: "development",
        requestOrigin: "http://localhost:3012",
        siteUrl: "http://localhost:3000",
      }),
    ).toBe("http://localhost:3012");
  });
});
