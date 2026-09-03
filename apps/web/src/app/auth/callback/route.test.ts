import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

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

vi.mock("@supabase/ssr", () => ({
  createServerClient: (
    _url: string,
    _key: string,
    options: MockClientOptions,
  ) => ({
    auth: {
      exchangeCodeForSession: async () => {
        options.cookies.setAll([
          {
            name: "sb-project-auth-token",
            options: { httpOnly: true, path: "/", sameSite: "lax" },
            value: "oauth-session",
          },
        ]);

        return { error: null };
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

describe("Google OAuth callback", () => {
  it("keeps the new Supabase session cookies on the account redirect", async () => {
    const request = new NextRequest(
      "https://dreamshop-next.vercel.app/auth/callback?code=oauth-code&next=%2Faccount",
    );
    const response = await GET(request);

    expect(response.headers.get("location")).toBe(
      "https://dreamshop-next.vercel.app/account",
    );
    expect(response.headers.get("set-cookie")).toContain(
      "sb-project-auth-token=oauth-session",
    );
  });
});
