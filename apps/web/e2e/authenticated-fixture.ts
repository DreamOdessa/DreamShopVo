import type { BrowserContext } from "@playwright/test";

export const fixtureAdmin = {
  app_metadata: { role: "admin" },
  aud: "authenticated",
  created_at: "2026-01-01T00:00:00.000Z",
  email: "admin@fixture.invalid",
  id: "44444444-4444-4444-8444-444444444444",
  role: "authenticated",
  user_metadata: { first_name: "Олена" },
};

function encodeJson(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function fixtureAccessToken() {
  const now = Math.floor(Date.now() / 1_000);
  const header = encodeJson({ alg: "HS256", typ: "JWT" });
  const payload = encodeJson({
    aal: "aal1",
    app_metadata: fixtureAdmin.app_metadata,
    aud: fixtureAdmin.aud,
    email: fixtureAdmin.email,
    exp: now + 86_400,
    iat: now,
    role: fixtureAdmin.role,
    sub: fixtureAdmin.id,
    user_metadata: fixtureAdmin.user_metadata,
  });

  return `${header}.${payload}.${Buffer.from("fixture-signature").toString("base64url")}`;
}

export async function authenticateAsFixtureAdmin(
  context: BrowserContext,
  baseURL = "http://localhost:3012",
) {
  const expiresAt = Math.floor(Date.now() / 1_000) + 86_400;
  const session = {
    access_token: fixtureAccessToken(),
    expires_at: expiresAt,
    expires_in: 86_400,
    refresh_token: "fixture-refresh-token",
    token_type: "bearer",
    user: fixtureAdmin,
  };

  await context.addCookies([
    {
      name: "sb-127-auth-token",
      url: baseURL,
      value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`,
    },
  ]);
}
