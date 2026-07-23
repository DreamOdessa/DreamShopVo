import type { IncomingMessage, ServerResponse } from 'http';
import { getTelegramStartEnvironment } from '../server/env';
import { getPrisma } from '../server/prisma';
import {
  createChallengeId,
  createTelegramToken,
  fingerprintClient,
  hashTelegramToken,
} from '../server/telegramTokens';

const CHALLENGE_TTL_MS = 15 * 60 * 1_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX = 5;

type ApiResponse = ServerResponse & {
  status(code: number): ApiResponse;
  json(body: unknown): void;
};

function getHeader(request: IncomingMessage, name: string): string {
  const value = request.headers[name];
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function hasSameOrigin(request: IncomingMessage): boolean {
  const origin = getHeader(request, 'origin');
  const host = getHeader(request, 'x-forwarded-host') || getHeader(request, 'host');
  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function getClientIp(request: IncomingMessage): string {
  const forwardedFor = getHeader(request, 'x-forwarded-for');
  const clientIp = forwardedFor.split(',')[0]?.trim() ||
    getHeader(request, 'x-real-ip').trim();
  return clientIp.slice(0, 64) || 'unknown';
}

export default async function handler(
  request: IncomingMessage,
  response: ApiResponse
): Promise<void> {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  if (!hasSameOrigin(request)) {
    response.status(403).json({ error: 'forbidden' });
    return;
  }

  try {
    const environment = getTelegramStartEnvironment();
    const prisma = getPrisma();
    const now = new Date();
    const requestFingerprint = fingerprintClient(
      getClientIp(request),
      environment.secret
    );
    const recentChallengeCount = await prisma.telegramAuthChallenge.count({
      where: {
        requestFingerprint,
        createdAt: {
          gte: new Date(now.getTime() - RATE_LIMIT_WINDOW_MS),
        },
      },
    });

    if (recentChallengeCount >= RATE_LIMIT_MAX) {
      response.setHeader('Retry-After', String(RATE_LIMIT_WINDOW_MS / 1_000));
      response.status(429).json({ error: 'rate_limited' });
      return;
    }

    const challengeId = createChallengeId();
    const token = createTelegramToken(
      'start',
      challengeId,
      environment.secret
    );

    await prisma.telegramAuthChallenge.create({
      data: {
        id: challengeId,
        tokenHash: hashTelegramToken(token),
        requestFingerprint,
        expiresAt: new Date(now.getTime() + CHALLENGE_TTL_MS),
      },
    });

    response.status(201).json({
      botUrl: `https://t.me/${environment.botUsername}?start=${encodeURIComponent(token)}`,
    });
  } catch (error) {
    console.error('Telegram registration start is unavailable', error);
    response.status(503).json({ error: 'telegram_auth_unavailable' });
  }
}
