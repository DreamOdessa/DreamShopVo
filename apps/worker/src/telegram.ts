import { createClient } from "@supabase/supabase-js";

import { HttpError, json } from "./http";
import type { WorkerEnv } from "./types";

const CHALLENGE_TTL_MS = 10 * 60 * 1000;
const MAX_JSON_BYTES = 16 * 1024;
const TELEGRAM_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

type TelegramContact = {
  phone_number?: string;
  user_id?: number;
};

type TelegramMessage = {
  chat?: {
    id?: number;
    type?: string;
  };
  contact?: TelegramContact;
  from?: {
    first_name?: string;
    id?: number;
  };
  text?: string;
};

type TelegramUpdate = {
  message?: TelegramMessage;
};

type ConsumedChallenge = {
  challenge_id: string;
  phone: string;
  telegram_chat_id: number | string;
  telegram_user_id: number | string;
};

type TelegramAuthUser = {
  email?: string | null;
  user_metadata?: Record<string, unknown>;
};

function createSupabaseClient(url: string, key: string) {
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
}

async function parseJson(request: Request) {
  const contentType = request.headers.get("Content-Type")?.split(";")[0].trim();
  const contentLength = Number(request.headers.get("Content-Length"));

  if (contentType !== "application/json") {
    throw new HttpError(415, "invalid_request", "JSON is required.");
  }

  if (Number.isFinite(contentLength) && contentLength > MAX_JSON_BYTES) {
    throw new HttpError(413, "invalid_request", "The request is too large.");
  }

  const text = await request.text();

  if (!text || text.length > MAX_JSON_BYTES) {
    throw new HttpError(400, "invalid_request", "The request is invalid.");
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new HttpError(400, "invalid_request", "The request is invalid.");
  }
}

function requireObject(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new HttpError(400, "invalid_request", "The request is invalid.");
  }

  return value as Record<string, unknown>;
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function telegramLoginEmail(phone: string) {
  const phoneHash = await sha256Hex(phone);

  return `telegram-${phoneHash}@auth.dreamshop.invalid`;
}

export function isMatchingTelegramIdentity(
  user: TelegramAuthUser | null | undefined,
  loginEmail: string,
) {
  return (
    user?.email === loginEmail &&
    user.user_metadata?.auth_source === "telegram"
  );
}

export function normalizeTelegramPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length < 10 || digits.length > 15) {
    return null;
  }

  return `+${digits}`;
}

async function telegramRequest(
  env: WorkerEnv,
  method: string,
  body: Record<string, unknown>,
) {
  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new HttpError(
      503,
      "service_unavailable",
      "Telegram is temporarily unavailable.",
    );
  }
}

async function requestPhone(env: WorkerEnv, chatId: number) {
  await telegramRequest(env, "sendMessage", {
    chat_id: chatId,
    text: "Щоб продовжити в DreamShop, поділіться своїм номером телефону.",
    reply_markup: {
      keyboard: [
        [
          {
            request_contact: true,
            text: "Поділитися номером",
          },
        ],
      ],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });
}

async function createChallenge(
  env: WorkerEnv,
  message: TelegramMessage,
  chatId: number,
  telegramUserId: number,
) {
  const phone = normalizeTelegramPhone(message.contact?.phone_number ?? "");

  if (!phone || message.contact?.user_id !== telegramUserId) {
    await telegramRequest(env, "sendMessage", {
      chat_id: chatId,
      text: "Надішліть свій номер кнопкою нижче.",
    });
    return;
  }

  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const supabase = createSupabaseClient(
    env.SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
  );

  const { error: insertError } = await supabase.rpc(
    "create_telegram_registration_challenge",
    {
      p_expires_at: new Date(Date.now() + CHALLENGE_TTL_MS).toISOString(),
      p_phone: phone,
      p_telegram_chat_id: chatId,
      p_telegram_user_id: telegramUserId,
      p_token_hash: `\\x${tokenHash}`,
    },
  );

  if (insertError) {
    throw new HttpError(
      503,
      "service_unavailable",
      "Registration is temporarily unavailable.",
    );
  }

  await telegramRequest(env, "sendMessage", {
    chat_id: chatId,
    text: "Номер підтверджено.",
    reply_markup: {
      remove_keyboard: true,
    },
  });

  await telegramRequest(env, "sendMessage", {
    chat_id: chatId,
    text: "Створіть або оновіть пароль на сайті. Посилання діє 10 хвилин.",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Продовжити на сайті",
            url: `${env.SITE_URL.replace(/\/+$/, "")}/auth/telegram#token=${encodeURIComponent(token)}`,
          },
        ],
      ],
    },
  });
}

export async function handleTelegramWebhook(
  request: Request,
  env: WorkerEnv,
) {
  const webhookSecret =
    request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";

  if (
    !webhookSecret ||
    !env.TELEGRAM_WEBHOOK_SECRET ||
    !constantTimeEqual(webhookSecret, env.TELEGRAM_WEBHOOK_SECRET)
  ) {
    throw new HttpError(401, "unauthorized", "Webhook authentication failed.");
  }

  const update = requireObject(await parseJson(request)) as TelegramUpdate;
  const message = update.message;
  const chatId = message?.chat?.id;
  const telegramUserId = message?.from?.id;

  if (
    !message ||
    message.chat?.type !== "private" ||
    typeof chatId !== "number" ||
    typeof telegramUserId !== "number"
  ) {
    return json(request, env, { ok: true });
  }

  if (message.text?.startsWith("/start")) {
    await requestPhone(env, chatId);
    return json(request, env, { ok: true });
  }

  if (message.contact) {
    await createChallenge(env, message, chatId, telegramUserId);
  }

  return json(request, env, { ok: true });
}

export async function completeTelegramRegistration(
  request: Request,
  env: WorkerEnv,
) {
  const body = requireObject(await parseJson(request));
  const token = typeof body.token === "string" ? body.token : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (
    !TELEGRAM_TOKEN_PATTERN.test(token) ||
    password.length < 10 ||
    password.length > 72
  ) {
    throw new HttpError(
      400,
      "invalid_request",
      "The registration link or password is invalid.",
    );
  }

  const tokenHash = await sha256Hex(token);
  const adminClient = createSupabaseClient(
    env.SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
  );
  const { data, error: challengeError } = await adminClient.rpc(
    "consume_telegram_registration_challenge",
    {
      p_token_hash: `\\x${tokenHash}`,
    },
  );
  const challenge = (data as ConsumedChallenge[] | null)?.[0];

  if (challengeError) {
    throw new HttpError(
      503,
      "service_unavailable",
      "Registration is temporarily unavailable.",
    );
  }

  if (!challenge) {
    throw new HttpError(
      400,
      "invalid_request",
      "The registration link is invalid or expired.",
    );
  }

  const email = await telegramLoginEmail(challenge.phone);
  const { data: existingProfile, error: profileLookupError } =
    await adminClient
      .from("profiles")
      .select("id")
      .eq("phone", challenge.phone)
      .maybeSingle();

  if (profileLookupError) {
    throw new HttpError(
      503,
      "service_unavailable",
      "Registration is temporarily unavailable.",
    );
  }

  let authUserId: string;
  let createdUser = false;

  if (existingProfile) {
    const { data: existing, error: existingUserError } =
      await adminClient.auth.admin.getUserById(existingProfile.id);

    if (existingUserError || !existing.user) {
      throw new HttpError(
        503,
        "service_unavailable",
        "Registration is temporarily unavailable.",
      );
    }

    if (!isMatchingTelegramIdentity(existing.user, email)) {
      throw new HttpError(
        409,
        "conflict",
        "This phone number belongs to another sign-in method.",
      );
    }

    const { data: updated, error: updateError } =
      await adminClient.auth.admin.updateUserById(existing.user.id, {
        password,
        user_metadata: {
          ...existing.user.user_metadata,
          auth_source: "telegram",
          telegram_chat_id: String(challenge.telegram_chat_id),
          telegram_user_id: String(challenge.telegram_user_id),
        },
      });

    if (updateError || !updated.user) {
      throw new HttpError(
        503,
        "service_unavailable",
        "Registration is temporarily unavailable.",
      );
    }

    authUserId = updated.user.id;
  } else {
    const { data: created, error: createError } =
      await adminClient.auth.admin.createUser({
        app_metadata: {
          role: "customer",
        },
        email,
        email_confirm: true,
        password,
        user_metadata: {
          auth_source: "telegram",
          telegram_chat_id: String(challenge.telegram_chat_id),
          telegram_user_id: String(challenge.telegram_user_id),
        },
      });

    if (createError || !created.user) {
      const conflict =
        createError?.status === 422 ||
        createError?.code === "phone_exists" ||
        createError?.code === "user_already_exists";

      throw new HttpError(
        conflict ? 409 : 503,
        conflict ? "conflict" : "service_unavailable",
        conflict
          ? "An account with this phone number already exists."
          : "Registration is temporarily unavailable.",
      );
    }

    authUserId = created.user.id;
    createdUser = true;

    const { error: profileError } = await adminClient
      .from("profiles")
      .update({
        email: null,
        phone: challenge.phone,
      })
      .eq("id", authUserId);

    if (profileError) {
      await adminClient.auth.admin.deleteUser(authUserId);

      throw new HttpError(
        profileError.code === "23505" ? 409 : 503,
        profileError.code === "23505" ? "conflict" : "service_unavailable",
        profileError.code === "23505"
          ? "An account with this phone number already exists."
          : "Registration is temporarily unavailable.",
      );
    }
  }

  const publicClient = createSupabaseClient(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
  );
  const { data: signedIn, error: signInError } =
    await publicClient.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError || !signedIn.session) {
    if (createdUser) {
      await adminClient.auth.admin.deleteUser(authUserId);
    }

    throw new HttpError(
      503,
      "service_unavailable",
      "Registration is temporarily unavailable.",
    );
  }

  return json(request, env, {
    access_token: signedIn.session.access_token,
    refresh_token: signedIn.session.refresh_token,
  });
}

export async function signInWithTelegramPhone(
  request: Request,
  env: WorkerEnv,
) {
  const body = requireObject(await parseJson(request));
  const phone =
    typeof body.phone === "string"
      ? normalizeTelegramPhone(body.phone)
      : null;
  const password = typeof body.password === "string" ? body.password : "";

  if (!phone || !password || password.length > 72) {
    throw new HttpError(
      400,
      "invalid_request",
      "The phone number or password is invalid.",
    );
  }

  const publicClient = createSupabaseClient(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
  );
  const { data, error } = await publicClient.auth.signInWithPassword({
    email: await telegramLoginEmail(phone),
    password,
  });

  if (error || !data.session) {
    throw new HttpError(
      401,
      "unauthorized",
      "The phone number or password is invalid.",
    );
  }

  return json(request, env, {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
}
