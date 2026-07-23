import type { IncomingMessage, ServerResponse } from 'http';

const NOVA_POSHTA_URL = 'https://api.novaposhta.ua/v2.0/json/';
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_BODY_BYTES = 16_384;
const MAX_QUERY_LENGTH = 120;
const REFERENCE_PATTERN = /^[A-Za-z0-9-]{1,80}$/;
const DELIVERY_SERVICES = new Set([
  'WarehouseWarehouse',
  'WarehouseDoors',
  'DoorsWarehouse',
  'DoorsDoors',
]);

type ApiRequest = IncomingMessage & {
  body?: unknown;
};

type ApiResponse = ServerResponse & {
  status(code: number): ApiResponse;
  json(body: unknown): void;
};

type JsonRecord = Record<string, unknown>;

interface NovaPoshtaResponse {
  success?: boolean;
  data?: unknown[];
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseBody(body: unknown): JsonRecord | null {
  if (isRecord(body)) return body;

  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body);
      return isRecord(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  return null;
}

function getString(
  body: JsonRecord,
  key: string,
  maxLength: number,
  required = true
): string | undefined {
  const value = body[key];
  if (value === undefined && !required) return undefined;
  if (typeof value !== 'string') throw new Error('invalid_request');

  const normalized = value.trim();
  if ((required && normalized.length === 0) || normalized.length > maxLength) {
    throw new Error('invalid_request');
  }

  return normalized;
}

function getReference(body: JsonRecord, key: string, required = true): string | undefined {
  const value = getString(body, key, 80, required);
  if (value !== undefined && !REFERENCE_PATTERN.test(value)) {
    throw new Error('invalid_request');
  }
  return value;
}

function getNumber(
  body: JsonRecord,
  key: string,
  min: number,
  max: number
): number {
  const value = body[key];
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new Error('invalid_request');
  }
  return value;
}

function getHeader(req: ApiRequest, name: string): string {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function hasSameOrigin(req: ApiRequest): boolean {
  const origin = getHeader(req, 'origin');
  const forwardedHost = getHeader(req, 'x-forwarded-host');
  const host = forwardedHost || getHeader(req, 'host');

  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function callNovaPoshta(
  apiKey: string,
  modelName: string,
  calledMethod: string,
  methodProperties: JsonRecord
): Promise<unknown[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(NOVA_POSHTA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey,
        modelName,
        calledMethod,
        methodProperties,
      }),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error('upstream_error');

    const result = await response.json() as NovaPoshtaResponse;
    if (!result.success || !Array.isArray(result.data)) {
      throw new Error('upstream_error');
    }

    return result.data;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeSearchCities(data: unknown[]): JsonRecord[] {
  const first = isRecord(data[0]) ? data[0] : null;
  const addresses = first && Array.isArray(first.Addresses) ? first.Addresses : [];

  return addresses
    .filter(isRecord)
    .map(address => ({
      ...address,
      Ref: address.DeliveryCity || address.Ref || '',
      Description: address.Present || address.MainDescription || address.Description || '',
      DescriptionRu: address.Present || address.MainDescription || address.DescriptionRu || '',
    }))
    .filter(city => typeof city.Ref === 'string' && city.Ref.length > 0);
}

async function handleAction(apiKey: string, body: JsonRecord): Promise<unknown> {
  const action = getString(body, 'action', 40);

  switch (action) {
    case 'searchCities': {
      const query = getString(body, 'query', MAX_QUERY_LENGTH);
      const searchData = await callNovaPoshta(
        apiKey,
        'Address',
        'searchSettlements',
        { CityName: query, Limit: 10 }
      );
      const cities = normalizeSearchCities(searchData);
      if (cities.length > 0) return cities;

      return callNovaPoshta(apiKey, 'Address', 'getCities', {
        FindByString: query,
        Limit: 10,
      });
    }

    case 'getWarehouses': {
      const cityRef = getReference(body, 'cityRef');
      return callNovaPoshta(apiKey, 'AddressGeneral', 'getWarehouses', {
        CityRef: cityRef,
        Limit: 200,
      });
    }

    case 'searchWarehouses': {
      const query = getString(body, 'query', MAX_QUERY_LENGTH);
      const cityRef = getReference(body, 'cityRef', false);
      return callNovaPoshta(apiKey, 'AddressGeneral', 'getWarehouses', {
        FindByString: query,
        ...(cityRef ? { CityRef: cityRef } : {}),
        Limit: 20,
      });
    }

    case 'getDeliveryCost': {
      const citySender = getReference(body, 'citySender');
      const cityRecipient = getReference(body, 'cityRecipient');
      const serviceType = getString(body, 'serviceType', 30);
      const weight = getNumber(body, 'weight', 0.1, 1_000);
      const cost = getNumber(body, 'cost', 0, 10_000_000);

      if (!serviceType || !DELIVERY_SERVICES.has(serviceType)) {
        throw new Error('invalid_request');
      }

      const data = await callNovaPoshta(
        apiKey,
        'InternetDocument',
        'getDocumentPrice',
        {
          CitySender: citySender,
          CityRecipient: cityRecipient,
          ServiceType: serviceType,
          Weight: weight,
          Cost: cost,
          CargoType: 'Cargo',
          SeatsAmount: 1,
        }
      );
      const first = isRecord(data[0]) ? data[0] : null;
      return typeof first?.Cost === 'number' ? first.Cost : 0;
    }

    default:
      throw new Error('invalid_request');
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const contentLength = Number(getHeader(req, 'content-length') || 0);
  if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) {
    res.status(413).json({ success: false, error: 'Request too large' });
    return;
  }

  if (!hasSameOrigin(req)) {
    res.status(403).json({ success: false, error: 'Forbidden' });
    return;
  }

  const apiKey = process.env.NOVA_POSHTA_API_KEY?.trim();
  if (!apiKey) {
    res.status(503).json({ success: false, error: 'Service unavailable' });
    return;
  }

  const body = parseBody(req.body);
  if (!body) {
    res.status(400).json({ success: false, error: 'Invalid request' });
    return;
  }

  try {
    const data = await handleAction(apiKey, body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    const isInvalidRequest = error instanceof Error && error.message === 'invalid_request';
    res.status(isInvalidRequest ? 400 : 502).json({
      success: false,
      error: isInvalidRequest ? 'Invalid request' : 'Delivery service unavailable',
    });
  }
}
