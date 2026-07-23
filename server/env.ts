const PRODUCTION_ORIGIN = 'https://dream-shop-vo.vercel.app';

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
  const secret = readRequiredEnv('BETTER_AUTH_SECRET');
  if (Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('BETTER_AUTH_SECRET must be at least 32 bytes');
  }

  const baseUrl = normalizeOrigin(readRequiredEnv('BETTER_AUTH_URL'));
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
