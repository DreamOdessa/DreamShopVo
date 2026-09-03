import { describe, expect, it, vi } from "vitest";

import { createSupabaseFetch } from "./fetch";

function futureJwtResponse() {
  return new Response(
    JSON.stringify({ code: "PGRST303", message: "JWT issued at future" }),
    { headers: { "Content-Type": "application/json" }, status: 401 },
  );
}

describe("Supabase fetch", () => {
  it("retries a future-JWT rejection without replacing the request", async () => {
    const success = new Response(JSON.stringify([{ id: "profile" }]), {
      status: 200,
    });
    const baseFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(futureJwtResponse())
      .mockResolvedValueOnce(success);
    const supabaseFetch = createSupabaseFetch([0], baseFetch);
    const init = { headers: { Authorization: "Bearer session-token" } };

    const response = await supabaseFetch("https://project.test/rest/v1/profiles", init);

    expect(response).toBe(success);
    expect(baseFetch).toHaveBeenCalledTimes(2);
    expect(baseFetch).toHaveBeenNthCalledWith(
      2,
      "https://project.test/rest/v1/profiles",
      init,
    );
  });

  it("does not retry unrelated authorization failures", async () => {
    const unauthorized = new Response(
      JSON.stringify({ code: "42501", message: "permission denied" }),
      { status: 401 },
    );
    const baseFetch = vi.fn<typeof fetch>().mockResolvedValue(unauthorized);
    const supabaseFetch = createSupabaseFetch([0, 0], baseFetch);

    const response = await supabaseFetch("https://project.test/rest/v1/profiles");

    expect(response).toBe(unauthorized);
    expect(baseFetch).toHaveBeenCalledTimes(1);
  });

  it("keeps the final platform error after the bounded retries", async () => {
    const baseFetch = vi
      .fn<typeof fetch>()
      .mockImplementation(async () => futureJwtResponse());
    const supabaseFetch = createSupabaseFetch([0, 0], baseFetch);

    const response = await supabaseFetch("https://project.test/rest/v1/profiles");

    expect(response.status).toBe(401);
    expect(baseFetch).toHaveBeenCalledTimes(3);
  });
});
