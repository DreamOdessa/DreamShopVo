import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'crypto';

export type TelegramTokenPurpose = 'start' | 'complete';

const CHALLENGE_ID_BYTES = 12;
const SIGNATURE_BYTES = 20;
const TOKEN_PATTERN = /^([A-Za-z0-9_-]{16})\.([A-Za-z0-9_-]{27})$/;

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function signChallenge(
  purpose: TelegramTokenPurpose,
  challengeId: string,
  secret: string
): string {
  return createHmac('sha256', secret)
    .update(`dreamshop:telegram:${purpose}:${challengeId}`)
    .digest()
    .subarray(0, SIGNATURE_BYTES)
    .toString('base64url');
}

export function createChallengeId(): string {
  return randomBytes(CHALLENGE_ID_BYTES).toString('base64url');
}

export function createTelegramToken(
  purpose: TelegramTokenPurpose,
  challengeId: string,
  secret: string
): string {
  if (!/^[A-Za-z0-9_-]{16}$/.test(challengeId)) {
    throw new Error('Invalid Telegram challenge ID');
  }

  return `${challengeId}.${signChallenge(purpose, challengeId, secret)}`;
}

export function verifyTelegramToken(
  token: string,
  purpose: TelegramTokenPurpose,
  secret: string
): string | null {
  const match = TOKEN_PATTERN.exec(token);
  if (!match) return null;

  const [, challengeId, suppliedSignature] = match;
  const expectedSignature = signChallenge(purpose, challengeId, secret);
  return safeEqual(suppliedSignature, expectedSignature) ? challengeId : null;
}

export function hashTelegramToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function fingerprintClient(clientIp: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(`dreamshop:telegram:rate-limit:${clientIp}`)
    .digest('hex');
}

export function secretsMatch(left: string, right: string): boolean {
  return safeEqual(left, right);
}
