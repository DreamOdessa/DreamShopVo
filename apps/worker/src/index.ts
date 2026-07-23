import { handleOptions, HttpError, json } from "./http";
import {
  deleteMedia,
  getMediaKey,
  serveMedia,
  uploadMedia,
} from "./media";
import {
  completeTelegramRegistration,
  handleTelegramWebhook,
  signInWithTelegramPhone,
} from "./telegram";
import type { WorkerEnv } from "./types";

export type { WorkerEnv } from "./types";

async function handleRequest(request: Request, env: WorkerEnv) {
  if (request.method === "OPTIONS") {
    return handleOptions(request, env);
  }

  const { pathname } = new URL(request.url);

  if (pathname === "/health" && request.method === "GET") {
    return json(request, env, {
      status: "ok",
      services: {
        media: Boolean(env.PRODUCT_MEDIA),
        supabase: Boolean(
          env.SUPABASE_URL &&
            env.SUPABASE_PUBLISHABLE_KEY &&
            env.SUPABASE_SECRET_KEY,
        ),
        telegram: Boolean(
          env.TELEGRAM_BOT_TOKEN &&
            env.TELEGRAM_WEBHOOK_SECRET &&
            env.SITE_URL,
        ),
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

  if (pathname === "/telegram/webhook" && request.method === "POST") {
    return handleTelegramWebhook(request, env);
  }

  if (
    pathname === "/auth/telegram/complete" &&
    request.method === "POST"
  ) {
    return completeTelegramRegistration(request, env);
  }

  if (pathname === "/auth/phone/login" && request.method === "POST") {
    return signInWithTelegramPhone(request, env);
  }

  if (
    pathname === "/admin/media" ||
    pathname.startsWith("/media/") ||
    pathname.startsWith("/admin/media/") ||
    pathname === "/telegram/webhook" ||
    pathname === "/auth/telegram/complete" ||
    pathname === "/auth/phone/login"
  ) {
    throw new HttpError(405, "method_not_allowed", "Method is not allowed.");
  }

  throw new HttpError(404, "not_found", "Route was not found.");
}

export async function fetchRequest(
  request: Request,
  env: WorkerEnv,
): Promise<Response> {
  try {
    return await handleRequest(request, env);
  } catch (error) {
    if (error instanceof HttpError) {
      return json(
        request,
        env,
        { error: error.code, message: error.message },
        error.status,
      );
    }

    console.error("Unhandled worker error", error);
    return json(
      request,
      env,
      {
        error: "service_unavailable",
        message: "The service is temporarily unavailable.",
      },
      503,
    );
  }
}

export default {
  fetch(request, env): Promise<Response> {
    return fetchRequest(request, env);
  },
} satisfies ExportedHandler<WorkerEnv>;
