import { createClient, type User } from "@supabase/supabase-js";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const IMAGE_EXTENSIONS = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type SupportedImageType = keyof typeof IMAGE_EXTENSIONS;

export interface Env {
  PRODUCT_MEDIA: R2Bucket;
  SUPABASE_URL?: string;
  SUPABASE_PUBLISHABLE_KEY?: string;
  ALLOWED_ORIGINS?: string;
  R2_PUBLIC_BASE_URL?: string;
}

type ErrorCode =
  | "forbidden"
  | "invalid_file"
  | "invalid_origin"
  | "method_not_allowed"
  | "not_found"
  | "service_unavailable"
  | "unauthorized";

class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}

function json(
  request: Request,
  env: Env,
  body: unknown,
  status = 200,
  extraHeaders?: HeadersInit,
) {
  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  applySecurityHeaders(headers);
  applyCorsHeaders(request, env, headers);

  return new Response(JSON.stringify(body), { status, headers });
}

function applySecurityHeaders(headers: Headers) {
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("X-Content-Type-Options", "nosniff");
}

function allowedOrigins(env: Env) {
  return new Set(
    (env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
}

function applyCorsHeaders(request: Request, env: Env, headers: Headers) {
  const origin = request.headers.get("Origin");

  if (origin && allowedOrigins(env).has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.append("Vary", "Origin");
  }
}

function handleOptions(request: Request, env: Env) {
  const origin = request.headers.get("Origin");

  if (!origin || !allowedOrigins(env).has(origin)) {
    throw new HttpError(403, "invalid_origin", "Origin is not allowed.");
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "DELETE, GET, HEAD, OPTIONS, POST",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    },
  });
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new HttpError(401, "unauthorized", "Authentication is required.");
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    throw new HttpError(401, "unauthorized", "Authentication is required.");
  }

  return token;
}

async function requireAdmin(request: Request, env: Env): Promise<User> {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    throw new HttpError(
      503,
      "service_unavailable",
      "Authentication service is not configured.",
    );
  }

  const token = getBearerToken(request);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new HttpError(401, "unauthorized", "The session is invalid or expired.");
  }

  if (data.user.app_metadata?.role !== "admin") {
    throw new HttpError(403, "forbidden", "Administrator access is required.");
  }

  return data.user;
}

function getMediaKey(pathname: string, prefix: string) {
  let key: string;

  try {
    key = decodeURIComponent(pathname.slice(prefix.length));
  } catch {
    throw new HttpError(404, "not_found", "Media was not found.");
  }

  if (
    !key.startsWith("products/") ||
    key.length > 300 ||
    key.includes("..") ||
    key.includes("\\") ||
    key.includes("\0")
  ) {
    throw new HttpError(404, "not_found", "Media was not found.");
  }

  return key;
}

function createMediaKey(contentType: SupportedImageType) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const extension = IMAGE_EXTENSIONS[contentType];

  return `products/${year}/${month}/${crypto.randomUUID()}.${extension}`;
}

async function uploadMedia(request: Request, env: Env) {
  const contentType = request.headers.get("Content-Type")?.split(";")[0].trim();

  if (!contentType || !(contentType in IMAGE_EXTENSIONS)) {
    throw new HttpError(
      415,
      "invalid_file",
      "Only JPEG, PNG, WebP, and AVIF images are supported.",
    );
  }

  const contentLength = Number(request.headers.get("Content-Length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BYTES) {
    throw new HttpError(413, "invalid_file", "The image exceeds the 10 MB limit.");
  }

  const user = await requireAdmin(request, env);
  const bytes = await request.arrayBuffer();

  if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new HttpError(
      bytes.byteLength === 0 ? 400 : 413,
      "invalid_file",
      bytes.byteLength === 0
        ? "The image body is empty."
        : "The image exceeds the 10 MB limit.",
    );
  }

  const key = createMediaKey(contentType as SupportedImageType);
  await env.PRODUCT_MEDIA.put(key, bytes, {
    httpMetadata: {
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
    },
    customMetadata: {
      uploadedBy: user.id,
    },
  });

  const mediaBaseUrl = env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, "") ?? "";
  const url = mediaBaseUrl
    ? `${mediaBaseUrl}/${key}`
    : new URL(`/media/${key}`, request.url).toString();

  return json(request, env, { key, url }, 201);
}

async function serveMedia(request: Request, env: Env, key: string) {
  const object =
    request.method === "HEAD"
      ? await env.PRODUCT_MEDIA.head(key)
      : await env.PRODUCT_MEDIA.get(key);

  if (!object) {
    throw new HttpError(404, "not_found", "Media was not found.");
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", object.httpEtag);
  headers.set("Content-Length", String(object.size));
  applySecurityHeaders(headers);
  applyCorsHeaders(request, env, headers);

  return new Response(request.method === "HEAD" ? null : (object as R2ObjectBody).body, {
    headers,
  });
}

async function deleteMedia(request: Request, env: Env, key: string) {
  await requireAdmin(request, env);

  const object = await env.PRODUCT_MEDIA.head(key);

  if (!object) {
    throw new HttpError(404, "not_found", "Media was not found.");
  }

  await env.PRODUCT_MEDIA.delete(key);
  const headers = new Headers();
  applySecurityHeaders(headers);
  applyCorsHeaders(request, env, headers);

  return new Response(null, {
    status: 204,
    headers,
  });
}

async function handleRequest(request: Request, env: Env) {
  if (request.method === "OPTIONS") {
    return handleOptions(request, env);
  }

  const { pathname } = new URL(request.url);

  if (pathname === "/health" && request.method === "GET") {
    return json(request, env, {
      status: "ok",
      services: {
        media: Boolean(env.PRODUCT_MEDIA),
        supabase: Boolean(env.SUPABASE_URL && env.SUPABASE_PUBLISHABLE_KEY),
      },
    });
  }

  if (pathname === "/admin/media" && request.method === "POST") {
    return uploadMedia(request, env);
  }

  if (
    pathname.startsWith("/media/") &&
    (request.method === "GET" || request.method === "HEAD")
  ) {
    return serveMedia(request, env, getMediaKey(pathname, "/media/"));
  }

  if (pathname.startsWith("/admin/media/") && request.method === "DELETE") {
    return deleteMedia(request, env, getMediaKey(pathname, "/admin/media/"));
  }

  if (
    pathname === "/admin/media" ||
    pathname.startsWith("/media/") ||
    pathname.startsWith("/admin/media/")
  ) {
    throw new HttpError(405, "method_not_allowed", "Method is not allowed.");
  }

  throw new HttpError(404, "not_found", "Route was not found.");
}

export async function fetchRequest(request: Request, env: Env): Promise<Response> {
  try {
    return await handleRequest(request, env);
  } catch (error) {
    if (error instanceof HttpError) {
      return json(request, env, { error: error.code, message: error.message }, error.status);
    }

    console.error("Unhandled worker error", error);
    return json(
      request,
      env,
      { error: "service_unavailable", message: "The service is temporarily unavailable." },
      503,
    );
  }
}

export default {
  fetch(request, env): Promise<Response> {
    return fetchRequest(request, env);
  },
} satisfies ExportedHandler<Env>;
