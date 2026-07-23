import type { IncomingMessage, ServerResponse } from 'http';
import { getTelegramWebhookEnvironment } from '../server/env';
import { getPrisma } from '../server/prisma';
import { processTelegramUpdate } from '../server/telegramRegistration';
import { secretsMatch } from '../server/telegramTokens';
import {
  getTelegramUpdateId,
  isRecord,
  parseTelegramUpdate,
} from '../server/telegramUpdate';

const MAX_BODY_BYTES = 65_536;

type ApiRequest = IncomingMessage & {
  body?: unknown;
};

type ApiResponse = ServerResponse & {
  status(code: number): ApiResponse;
  json(body: unknown): void;
};

function isUniqueConstraintError(error: unknown): boolean {
  return isRecord(error) && error.code === 'P2002';
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse
): Promise<void> {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const contentLength = Number(request.headers['content-length'] || 0);
  if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) {
    response.status(413).json({ error: 'payload_too_large' });
    return;
  }

  try {
    const environment = getTelegramWebhookEnvironment();
    const suppliedSecret = request.headers['x-telegram-bot-api-secret-token'];
    const normalizedSecret = Array.isArray(suppliedSecret)
      ? suppliedSecret[0] || ''
      : suppliedSecret || '';

    if (!secretsMatch(normalizedSecret, environment.webhookSecret)) {
      response.status(401).json({ error: 'unauthorized' });
      return;
    }

    const update = parseTelegramUpdate(request.body);
    const updateId = update ? getTelegramUpdateId(update) : null;
    if (!update || !updateId) {
      response.status(400).json({ error: 'invalid_update' });
      return;
    }

    const prisma = getPrisma();
    try {
      await prisma.telegramUpdate.create({
        data: {
          updateId,
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        response.status(200).json({ ok: true });
        return;
      }
      throw error;
    }

    try {
      await processTelegramUpdate(update, environment);
    } catch (error) {
      await prisma.telegramUpdate.delete({
        where: {
          updateId,
        },
      }).catch(() => undefined);
      throw error;
    }

    response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook failed', error);
    response.status(503).json({ error: 'telegram_webhook_unavailable' });
  }
}
