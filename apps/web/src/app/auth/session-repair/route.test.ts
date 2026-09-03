import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

type MockCookie = {
  name: string;
  options?: { httpOnly?: boolean; path?: string; sameSite?: "lax" };
  value: string;
};

type MockClientOptions = {
  cookies: {
    setAll: (cookies: MockCookie[]) => void;
  };
};

let refreshSucceeds = true;

vi.mock("@supabase/ssr", () => ({
  createServerClient: (
    _url: string,
    _key: string,
    options: MockClientOptions,
  ) => ({
    auth: {
      refreshSession: async () => {
        if (!refreshSucceeds) {
          return { data: { session: null }, error: new Error("refresh failed") };
        }

        options.cookies.setAll([
          {
            name: "sb-project-auth-token",
            options: { httpOnly: true, path: "/", sameSite: "lax" },
            value: "repaired-session",
          },
        ]);

        return { data: { session: { access_token: "fresh" } }, error: null };
      },
    },
  }),
}));

vi.mock("../../../lib/env", () => ({
  getSupabaseEnv: () => ({
    supabasePublishableKey: "publishable",
    supabaseUrl: "https://project.supabase.co",
  }),
}));

import { GET } from "./route";

describe("session repair", () => {
  beforeEach(() => {
    refreshSucceeds = true;
  });

  it("refreshes the session and keeps the replacement cookies", async () => {
    const request = new NextRequest(
      "https://dreamshop-next.vercel.app/auth/session-repair?next=%2Faccount",
    );
    const response = await GET(request);

    expect(response.headers.get("location")).toBe(
      "https://dreamshop-next.vercel.app/account?session_repaired=1",
    );
    expect(response.headers.get("set-cookie")).toContain(
      "sb-project-auth-token=repaired-session",
    );
  });

  it("uses the reset route only when the refresh token is unusable", async () => {
    refreshSucceeds = false;
    const request = new NextRequest(
      "https://dreamshop-next.vercel.app/auth/session-repair?next=%2Faccount",
    );
    const response = await GET(request);

    expect(response.headers.get("location")).toBe(
      "https://dreamshop-next.vercel.app/auth/session-reset?next=%2Faccount",
    );
  });
});
