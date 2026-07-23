import {
  applyCorsHeaders,
  applySecurityHeaders,
  HttpError,
  json,
} from "./http";
import { requireAdmin } from "./supabase-auth";
import type { WorkerEnv } from "./types";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const IMAGE_EXTENSIONS = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type SupportedImageType = keyof typeof IMAGE_EXTENSIONS;

export function getMediaKey(pathname: string, prefix: string) {
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

export async function uploadMedia(request: Request, env: WorkerEnv) {
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

  const url = new URL(`/media/${key}`, request.url).toString();

  return json(request, env, { key, url }, 201);
}

export async function serveMedia(
  request: Request,
  env: WorkerEnv,
  key: string,
) {
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

  return new Response(
    request.method === "HEAD" ? null : (object as R2ObjectBody).body,
    { headers },
  );
}

export async function deleteMedia(
  request: Request,
  env: WorkerEnv,
  key: string,
) {
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
