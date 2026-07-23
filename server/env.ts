const PRODUCTION_ORIGIN = 'https://dream-shop-vo.vercel.app';

export type TelegramWebhookEnvironment = {
  botToken: string;
  secret: string;
  siteOrigin: string;
  webhookSecret: string;
};

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return value;
}

function normalizeOrigin(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
    throw new Error('BETTER_AUTH_URL must use HTTPS outside localhost');
  }
  return url.origin;
}

function getServerSecret(): string {
  const secret = readRequiredEnv('BETTER_AUTH_SECRET');
  if (Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('BETTER_AUTH_SECRET must be at least 32 bytes');
  }
  return secret;
}

function getSiteOrigin(): string {
  return normalizeOrigin(readRequiredEnv('BETTER_AUTH_URL'));
}

export function getDatabaseUrl(): string {
  return readRequiredEnv('DATABASE_URL');
}

export function getAuthEnvironment(): {
  baseUrl: string;
  secret: string;
  trustedOrigins: string[];
  google?: {
    clientId: string;
    clientSecret: string;
  };
} {
  const secret = getServerSecret();
  const baseUrl = getSiteOrigin();
  const trustedOrigins = new Set([baseUrl, PRODUCTION_ORIGIN]);

  if (process.env.NODE_ENV !== 'production') {
    trustedOrigins.add('http://localhost:3000');
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (Boolean(googleClientId) !== Boolean(googleClientSecret)) {
    throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured together');
  }

  return {
    baseUrl,
    secret,
    trustedOrigins: [...trustedOrigins],
    ...(googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {}),
  };
}

export function getTelegramStartEnvironment(): {
  botUsername: string;
  secret: string;
} {
  const botUsername = readRequiredEnv('TELEGRAM_BOT_USERNAME').replace(/^@/, '');
  if (!/^[A-Za-z0-9_]{5,32}$/.test(botUsername)) {
    throw new Error('TELEGRAM_BOT_USERNAME is invalid');
  }

  return {
    botUsername,
    secret: getServerSecret(),
  };
}

export function getTelegramWebhookEnvironment(): TelegramWebhookEnvironment {
  const botToken = readRequiredEnv('TELEGRAM_BOT_TOKEN');
  if (!/^\d{6,12}:[A-Za-z0-9_-]{30,}$/.test(botToken)) {
    throw new Error('TELEGRAM_BOT_TOKEN is invalid');
  }

  const webhookSecret = readRequiredEnv('TELEGRAM_WEBHOOK_SECRET');
  if (Buffer.byteLength(webhookSecret, 'utf8') < 32) {
    throw new Error('TELEGRAM_WEBHOOK_SECRET must be at least 32 bytes');
  }

  return {
    botToken,
    secret: getServerSecret(),
    siteOrigin: getSiteOrigin(),
    webhookSecret,
  };
}
