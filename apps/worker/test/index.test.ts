import { afterEach, describe, expect, it, vi } from "vitest";

import { type Env, fetchRequest } from "../src/index";

function createEnv(overrides: Partial<Env> = {}): Env {
  return {
    PRODUCT_MEDIA: {
      delete: vi.fn(),
      get: vi.fn().mockResolvedValue(null),
      head: vi.fn().mockResolvedValue(null),
      put: vi.fn(),
    } as unknown as R2Bucket,
    ...overrides,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("DreamShop Worker", () => {
  it("reports configured services without exposing credentials", async () => {
    const response = await fetchRequest(
      new Request("https://api.example.test/health"),
      createEnv({
        SUPABASE_URL: "https://project.supabase.co",
        SUPABASE_PUBLISHABLE_KEY: "publishable",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "ok",
      services: {
        media: true,
        supabase: true,
      },
    });
  });

  it("rejects an admin upload without a bearer token", async () => {
    const response = await fetchRequest(
      new Request("https://api.example.test/admin/media", {
        method: "POST",
        headers: {
          "Content-Type": "image/webp",
        },
        body: new Uint8Array([1, 2, 3]),
      }),
      createEnv({
        SUPABASE_URL: "https://project.supabase.co",
        SUPABASE_PUBLISHABLE_KEY: "publishable",
      }),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ error: "unauthorized" });
  });

  it("rejects unsupported upload types before writing to R2", async () => {
    const env = createEnv();
    const response = await fetchRequest(
      new Request("https://api.example.test/admin/media", {
        method: "POST",
        headers: {
          "Content-Type": "image/svg+xml",
        },
        body: "<svg />",
      }),
      env,
    );

    expect(response.status).toBe(415);
    expect(env.PRODUCT_MEDIA.put).not.toHaveBeenCalled();
  });

  it("does not expose objects outside the product prefix", async () => {
    const response = await fetchRequest(
      new Request("https://api.example.test/media/private/users.json"),
      createEnv(),
    );

    expect(response.status).toBe(404);
  });

  it("allows CORS preflight only for an exact configured origin", async () => {
    const env = createEnv({
      ALLOWED_ORIGINS: "https://shop.example.test",
    });
    const allowed = await fetchRequest(
      new Request("https://api.example.test/admin/media", {
        method: "OPTIONS",
        headers: { Origin: "https://shop.example.test" },
      }),
      env,
    );
    const denied = await fetchRequest(
      new Request("https://api.example.test/admin/media", {
        method: "OPTIONS",
        headers: { Origin: "https://evil.example.test" },
      }),
      env,
    );

    expect(allowed.status).toBe(204);
    expect(allowed.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://shop.example.test",
    );
    expect(denied.status).toBe(403);
  });
});
