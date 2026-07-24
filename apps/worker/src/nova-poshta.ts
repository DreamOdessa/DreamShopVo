import { HttpError, json } from "./http";
import { requireUser } from "./supabase-auth";
import type { WorkerEnv } from "./types";

const NOVA_POSHTA_API_URL = "https://api.novaposhta.ua/v2.0/json/";
const REF_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type NovaResponse = {
  data?: unknown[];
  errors?: unknown[];
  success?: boolean;
};

function normalizedQuery(value: string | null, maxLength: number) {
  const normalized = value?.trim().replace(/\s+/g, " ") ?? "";
  return normalized.length <= maxLength ? normalized : "";
}

function objectValue(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function stringValue(
  record: Record<string, unknown>,
  key: string,
  maxLength: number,
) {
  const value = record[key];
  return typeof value === "string" && value.length <= maxLength ? value : "";
}

async function novaRequest(
  env: WorkerEnv,
  modelName: string,
  calledMethod: string,
  methodProperties: Record<string, string>,
) {
  if (!env.NOVA_POSHTA_API_KEY) {
    throw new HttpError(
      503,
      "service_unavailable",
      "Delivery service is not configured.",
    );
  }

  let response: Response;

  try {
    response = await fetch(NOVA_POSHTA_API_URL, {
      body: JSON.stringify({
        apiKey: env.NOVA_POSHTA_API_KEY,
        calledMethod,
        methodProperties,
        modelName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(7000),
    });
  } catch {
    throw new HttpError(
      503,
      "service_unavailable",
      "Delivery service is temporarily unavailable.",
    );
  }

  if (!response.ok) {
    throw new HttpError(
      503,
      "service_unavailable",
      "Delivery service is temporarily unavailable.",
    );
  }

  const payload = (await response.json()) as NovaResponse;

  if (!payload.success || !Array.isArray(payload.data)) {
    throw new HttpError(
      503,
      "service_unavailable",
      "Delivery service returned an invalid response.",
    );
  }

  return payload.data;
}

export async function searchNovaPoshtaCities(
  request: Request,
  env: WorkerEnv,
) {
  await requireUser(request, env);
  const query = normalizedQuery(new URL(request.url).searchParams.get("q"), 80);

  if (query.length < 2) {
    throw new HttpError(
      400,
      "invalid_request",
      "Enter at least two characters.",
    );
  }

  const data = await novaRequest(env, "AddressGeneral", "searchSettlements", {
    CityName: query,
    Limit: "20",
    Page: "1",
  });
  const root = objectValue(data[0]);
  const addresses = Array.isArray(root?.Addresses) ? root.Addresses : [];
  const cities = addresses
    .map(objectValue)
    .filter((city): city is Record<string, unknown> => Boolean(city))
    .map((city) => ({
      name:
        stringValue(city, "Present", 120) ||
        stringValue(city, "MainDescription", 120),
      ref:
        stringValue(city, "DeliveryCity", 64) ||
        stringValue(city, "Ref", 64),
    }))
    .filter(({ name, ref }) => name && REF_PATTERN.test(ref))
    .slice(0, 20);

  return json(request, env, { cities });
}

export async function getNovaPoshtaWarehouses(
  request: Request,
  env: WorkerEnv,
) {
  await requireUser(request, env);
  const url = new URL(request.url);
  const cityRef = normalizedQuery(url.searchParams.get("cityRef"), 64);
  const query = normalizedQuery(url.searchParams.get("q"), 80);

  if (!REF_PATTERN.test(cityRef)) {
    throw new HttpError(400, "invalid_request", "The city is invalid.");
  }

  const data = await novaRequest(env, "AddressGeneral", "getWarehouses", {
    CityRef: cityRef,
    FindByString: query,
    Language: "UA",
    Limit: "100",
    Page: "1",
  });
  const warehouses = data
    .map(objectValue)
    .filter((warehouse): warehouse is Record<string, unknown> =>
      Boolean(warehouse),
    )
    .map((warehouse) => ({
      name:
        stringValue(warehouse, "Description", 500) ||
        stringValue(warehouse, "ShortAddress", 500),
      number: stringValue(warehouse, "Number", 20),
      ref: stringValue(warehouse, "Ref", 64),
    }))
    .filter(({ name, ref }) => name && REF_PATTERN.test(ref))
    .slice(0, 100);

  return json(request, env, { warehouses });
}
