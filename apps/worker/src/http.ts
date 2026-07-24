import type { WorkerEnv } from "./types";

export type ErrorCode =
  | "conflict"
  | "forbidden"
  | "invalid_file"
  | "invalid_origin"
  | "invalid_request"
  | "method_not_allowed"
  | "not_found"
  | "service_unavailable"
  | "unauthorized";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}

export function applySecurityHeaders(headers: Headers) {
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("X-Content-Type-Options", "nosniff");
}

function allowedOrigins(env: WorkerEnv) {
  return new Set(
    env.ALLOWED_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
}

export function applyCorsHeaders(
  request: Request,
  env: WorkerEnv,
  headers: Headers,
) {
  const origin = request.headers.get("Origin");

  if (origin && allowedOrigins(env).has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.append("Vary", "Origin");
  }
}

export function json(
  request: Request,
  env: WorkerEnv,
  body: unknown,
  status = 200,
  extraHeaders?: HeadersInit,
) {
  const headers = new Headers(extraHeaders);
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Type", "application/json; charset=utf-8");
  applySecurityHeaders(headers);
  applyCorsHeaders(request, env, headers);

  return new Response(JSON.stringify(body), { status, headers });
}

export function handleOptions(request: Request, env: WorkerEnv) {
  const origin = request.headers.get("Origin");

  if (!origin || !allowedOrigins(env).has(origin)) {
    throw new HttpError(403, "invalid_origin", "Origin is not allowed.");
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Media-Scope",
      "Access-Control-Allow-Methods": "DELETE, GET, HEAD, OPTIONS, POST",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    },
  });
}
