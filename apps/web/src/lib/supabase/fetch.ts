const DEFAULT_RETRY_DELAYS_MS = [500, 1_000, 2_000, 4_000, 8_000] as const;

type FetchImplementation = typeof fetch;

async function isFutureJwtResponse(response: Response) {
  if (response.status !== 401) {
    return false;
  }

  try {
    const body = (await response.clone().json()) as {
      code?: unknown;
      message?: unknown;
    };

    return (
      body.code === "PGRST303" &&
      typeof body.message === "string" &&
      body.message.toLocaleLowerCase("en-US").includes("jwt issued at future")
    );
  } catch {
    return false;
  }
}

function wait(delayMs: number) {
  return delayMs > 0
    ? new Promise<void>((resolve) => setTimeout(resolve, delayMs))
    : Promise.resolve();
}

/**
 * PostgREST can briefly reject a freshly issued, otherwise valid Supabase JWT
 * when its validator clock is stale. Retrying the identical request preserves
 * the authenticated identity and never bypasses JWT validation or RLS.
 */
export function createSupabaseFetch(
  retryDelaysMs: readonly number[] = DEFAULT_RETRY_DELAYS_MS,
  fetchImplementation: FetchImplementation = fetch,
): FetchImplementation {
  return async (input, init) => {
    let response = await fetchImplementation(input, init);

    for (const delayMs of retryDelaysMs) {
      if (!(await isFutureJwtResponse(response))) {
        return response;
      }

      await wait(delayMs);
      response = await fetchImplementation(input, init);
    }

    return response;
  };
}
