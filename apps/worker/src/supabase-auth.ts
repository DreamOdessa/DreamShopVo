import { createClient, type User } from "@supabase/supabase-js";

import { HttpError } from "./http";
import type { WorkerEnv } from "./types";

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

export async function requireUser(
  request: Request,
  env: WorkerEnv,
): Promise<User> {
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

  return data.user;
}

export async function requireAdmin(
  request: Request,
  env: WorkerEnv,
): Promise<User> {
  const user = await requireUser(request, env);

  if (user.app_metadata?.role !== "admin") {
    throw new HttpError(403, "forbidden", "Administrator access is required.");
  }

  return user;
}
