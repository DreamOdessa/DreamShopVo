import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchRequest, type WorkerEnv } from "../src/index";
import { getMediaKey, isSupportedImageBytes } from "../src/media";
import { classifyWarehouse } from "../src/nova-poshta";
import {
  formatOrderNotification,
  processOrderOutbox,
} from "../src/orders";
import {
  normalizeTelegramPhone,
  telegramLoginEmail,
} from "../src/telegram";

function createEnv(overrides: Partial<WorkerEnv> = {}): WorkerEnv {
  return {
    ALLOWED_ORIGINS: "",
    NOVA_POSHTA_API_KEY: "",
    PRODUCT_MEDIA: {
      delete: vi.fn(),
      get: vi.fn().mockResolvedValue(null),
      head: vi.fn().mockResolvedValue(null),
      put: vi.fn(),
    } as unknown as R2Bucket,
    SITE_URL: "https://shop.example.test",
    SUPABASE_PUBLISHABLE_KEY: "",
    SUPABASE_SECRET_KEY: "",
    SUPABASE_URL: "",
    TELEGRAM_BOT_TOKEN: "",
    TELEGRAM_ORDER_CHAT_ID: "",
    TELEGRAM_WEBHOOK_SECRET: "",
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
        SUPABASE_SECRET_KEY: "secret",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "ok",
      services: {
        media: true,
        novaPoshta: false,
        supabase: true,
        telegram: false,
        telegramOrders: false,
      },
    });
  });

  it("does not claim order events until the notification chat is configured", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await expect(
      processOrderOutbox(
        createEnv({
          SUPABASE_SECRET_KEY: "secret",
          SUPABASE_URL: "https://project.supabase.co",
          TELEGRAM_BOT_TOKEN: "token",
        }),
      ),
    ).resolves.toEqual({ processed: 0 });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("claims created and cancelled order events", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        new Response("[]", {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
    );

    await expect(
      processOrderOutbox(
        createEnv({
          SUPABASE_SECRET_KEY: "secret",
          SUPABASE_URL: "https://project.supabase.co",
          TELEGRAM_BOT_TOKEN: "token",
          TELEGRAM_ORDER_CHAT_ID: "-100123456789",
        }),
      ),
    ).resolves.toEqual({ processed: 0 });

    const eventTypes = fetchSpy.mock.calls.map(([, init]) => {
      const body = JSON.parse(String(init?.body)) as {
        p_event_type: string;
      };

      return body.p_event_type;
    });

    expect(eventTypes).toEqual(["order.created", "order.cancelled"]);
  });

  it("formats a distinct Telegram message for a cancelled order", () => {
    const message = formatOrderNotification(
      "order.cancelled",
      {
        contact_for_clarification: false,
        customer_first_name: "Іван",
        customer_last_name: "Тест",
        customer_note: null,
        customer_phone: "+380671234567",
        delivery_city: "Одеса",
        delivery_details: "Відділення 1",
        delivery_method: "post_office",
        order_number: 42,
        payment_method: "cash_on_delivery",
        total: 300,
      },
      [{ product_name: "Манго", quantity: 1, unit_price: 300 }],
    );

    expect(message).toContain("<b>Замовлення №42 скасовано</b>");
    expect(message).toContain("Манго");
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

  it("rejects delivery lookup without a bearer token", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const response = await fetchRequest(
      new Request(
        "https://api.example.test/delivery/nova-poshta/cities?q=Одеса",
      ),
      createEnv({
        NOVA_POSHTA_API_KEY: "configured",
        SUPABASE_PUBLISHABLE_KEY: "publishable",
        SUPABASE_URL: "https://project.supabase.co",
      }),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ error: "unauthorized" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("separates Nova Poshta branches from parcel lockers", () => {
    expect(classifyWarehouse("Відділення №12", "Branch")).toBe("branch");
    expect(classifyWarehouse("Поштомат №34188", "Postomat")).toBe("locker");
    expect(classifyWarehouse("Parcel locker 24", "")).toBe("locker");
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

  it("validates image signatures instead of trusting the content type", () => {
    const png = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]).buffer;
    const spoofed = new Uint8Array([1, 2, 3, 4]).buffer;

    expect(isSupportedImageBytes("image/png", png)).toBe(true);
    expect(isSupportedImageBytes("image/png", spoofed)).toBe(false);
    expect(isSupportedImageBytes("image/jpeg", png)).toBe(false);
  });

  it("accepts AVIF when its compatible brand follows the major brand", () => {
    const avif = new Uint8Array([
      0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6d, 0x69, 0x66, 0x31,
      0x00, 0x00, 0x00, 0x00, 0x61, 0x76, 0x69, 0x66, 0x6d, 0x69, 0x66, 0x31,
    ]).buffer;

    expect(isSupportedImageBytes("image/avif", avif)).toBe(true);
  });

  it("does not expose objects outside the product prefix", async () => {
    const response = await fetchRequest(
      new Request("https://api.example.test/media/private/users.json"),
      createEnv(),
    );

    expect(response.status).toBe(404);
  });

  it("accepts category media keys and rejects private prefixes", async () => {
    const categoryKey = "categories/2026/07/example.webp";

    expect(getMediaKey(`/media/${categoryKey}`, "/media/")).toBe(categoryKey);

    const privateResponse = await fetchRequest(
      new Request("https://api.example.test/media/private/example.webp"),
      createEnv(),
    );

    expect(privateResponse.status).toBe(404);
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
    expect(allowed.headers.get("Access-Control-Allow-Headers")).toContain(
      "X-Media-Scope",
    );
    expect(denied.status).toBe(403);
  });

  it("rejects Telegram webhooks without the configured secret header", async () => {
    const response = await fetchRequest(
      new Request("https://api.example.test/telegram/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ update_id: 1 }),
      }),
      createEnv({
        TELEGRAM_WEBHOOK_SECRET: "configured-secret",
      }),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ error: "unauthorized" });
  });

  it("accepts authenticated Telegram updates that do not contain a message", async () => {
    const response = await fetchRequest(
      new Request("https://api.example.test/telegram/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-Bot-Api-Secret-Token": "configured-secret",
        },
        body: JSON.stringify({ update_id: 1 }),
      }),
      createEnv({
        TELEGRAM_WEBHOOK_SECRET: "configured-secret",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it("normalizes Telegram phone numbers to E.164", () => {
    expect(normalizeTelegramPhone("+38 (067) 123-45-67")).toBe(
      "+380671234567",
    );
    expect(normalizeTelegramPhone("123")).toBeNull();
  });

  it("derives a stable private login identifier without exposing the phone", async () => {
    const phone = "+380671234567";
    const first = await telegramLoginEmail(phone);
    const second = await telegramLoginEmail(phone);

    expect(first).toBe(second);
    expect(first).toMatch(
      /^telegram-[a-f0-9]{64}@auth\.dreamshop\.invalid$/,
    );
    expect(first).not.toContain(phone);
  });

  it("rejects malformed Telegram registration tokens before database access", async () => {
    const response = await fetchRequest(
      new Request("https://api.example.test/auth/telegram/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "long-enough-password",
          token: "invalid",
        }),
      }),
      createEnv(),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: "invalid_request" });
  });

  it("rejects malformed phone login before contacting Supabase", async () => {
    const response = await fetchRequest(
      new Request("https://api.example.test/auth/phone/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "long-enough-password",
          phone: "123",
        }),
      }),
      createEnv(),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: "invalid_request" });
  });
});
