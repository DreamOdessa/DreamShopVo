import { afterEach, describe, expect, it } from "vitest";

import { getApiUrl, getSiteUrl, getSupabaseEnv } from "./env";

const environmentKeys = [
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_E2E_MOCK",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_VERCEL_URL",
  "NODE_ENV",
] as const;

const originalEnvironment = new Map(
  environmentKeys.map((name) => [name, process.env[name]]),
);

function useProductionEnvironment(
  overrides: Partial<Record<(typeof environmentKeys)[number], string>> = {},
) {
  Object.assign(process.env, {
    NEXT_PUBLIC_API_URL: "https://dreamshop-api.dreamshop-vo.workers.dev",
    NEXT_PUBLIC_SITE_URL: "https://dream-odessa.shop",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_production_key",
    NEXT_PUBLIC_SUPABASE_URL: "https://dreamshop.supabase.co",
    NODE_ENV: "production",
    ...overrides,
  });
}

afterEach(() => {
  for (const name of environmentKeys) {
    const originalValue = originalEnvironment.get(name);

    if (originalValue === undefined) {
      delete process.env[name];
    } else {
      Reflect.set(process.env, name, originalValue);
    }
  }
});

describe("production public environment", () => {
  it("uses the canonical production site origin", () => {
    useProductionEnvironment({
      NEXT_PUBLIC_SITE_URL: "https://dream-odessa.shop/",
    });

    expect(getSiteUrl()).toBe("https://dream-odessa.shop");
  });

  it("does not use a Vercel or localhost fallback in production", () => {
    useProductionEnvironment({
      NEXT_PUBLIC_SITE_URL: "",
      NEXT_PUBLIC_VERCEL_URL: "dreamshop-next.vercel.app",
    });

    expect(getSiteUrl).toThrow(
      "Missing required environment variable: NEXT_PUBLIC_SITE_URL",
    );
  });

  it("rejects a non-canonical production site origin", () => {
    useProductionEnvironment({
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    });

    expect(getSiteUrl).toThrow(
      "NEXT_PUBLIC_SITE_URL must be https://dream-odessa.shop",
    );
  });

  it("rejects a non-production Worker API origin", () => {
    useProductionEnvironment({
      NEXT_PUBLIC_API_URL: "http://localhost:8787",
    });

    expect(getApiUrl).toThrow(
      "NEXT_PUBLIC_API_URL must be a public HTTPS origin",
    );
  });

  it("allows a public HTTPS Worker hostname and keeps it configurable", () => {
    useProductionEnvironment({
      NEXT_PUBLIC_API_URL: "https://api.dream-odessa.shop",
    });

    expect(getApiUrl()).toBe("https://api.dream-odessa.shop");
  });

  it("rejects placeholder Supabase values", () => {
    useProductionEnvironment({
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "your_supabase_publishable_key",
      NEXT_PUBLIC_SUPABASE_URL: "https://your-project-ref.supabase.co",
    });

    expect(getSupabaseEnv).toThrow(
      "NEXT_PUBLIC_SUPABASE_URL must be a deployed https://<project-ref>.supabase.co URL",
    );
  });

  it("allows the explicit local E2E mock for API and Supabase only", () => {
    useProductionEnvironment({
      NEXT_PUBLIC_API_URL: "http://127.0.0.1:8787",
      NEXT_PUBLIC_E2E_MOCK: "1",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "playwright-public-key",
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:8787",
    });

    expect(getApiUrl()).toBe("http://127.0.0.1:8787");
    expect(getSupabaseEnv()).toEqual({
      supabasePublishableKey: "playwright-public-key",
      supabaseUrl: "http://127.0.0.1:8787",
    });
    expect(getSiteUrl()).toBe("https://dream-odessa.shop");
  });
});
