const assert = require('node:assert/strict');
const test = require('node:test');

require('ts-node').register({
  compilerOptions: {
    module: 'CommonJS',
  },
  transpileOnly: true,
});

const {
  createChallengeId,
  createTelegramToken,
  fingerprintClient,
  hashTelegramToken,
  secretsMatch,
  verifyTelegramToken,
} = require('./telegramTokens');

const SECRET = 'test-secret-that-is-long-enough-for-hmac-use';

test('Telegram tokens fit deep links and are purpose-bound', () => {
  const challengeId = createChallengeId();
  const startToken = createTelegramToken('start', challengeId, SECRET);

  assert.equal(challengeId.length, 16);
  assert.ok(startToken.length <= 64);
  assert.equal(verifyTelegramToken(startToken, 'start', SECRET), challengeId);
  assert.equal(verifyTelegramToken(startToken, 'complete', SECRET), null);
});

test('Telegram tokens reject tampering and a different secret', () => {
  const challengeId = createChallengeId();
  const token = createTelegramToken('complete', challengeId, SECRET);
  const tampered = `${token.slice(0, -1)}${token.endsWith('A') ? 'B' : 'A'}`;

  assert.equal(verifyTelegramToken(tampered, 'complete', SECRET), null);
  assert.equal(
    verifyTelegramToken(token, 'complete', `${SECRET}-different`),
    null
  );
});

test('hashes and request fingerprints are deterministic without exposing input', () => {
  const tokenHash = hashTelegramToken('opaque-token');
  const fingerprint = fingerprintClient('203.0.113.10', SECRET);

  assert.equal(tokenHash.length, 64);
  assert.equal(fingerprint.length, 64);
  assert.equal(hashTelegramToken('opaque-token'), tokenHash);
  assert.equal(fingerprintClient('203.0.113.10', SECRET), fingerprint);
  assert.notEqual(fingerprintClient('203.0.113.11', SECRET), fingerprint);
  assert.equal(secretsMatch('same-value', 'same-value'), true);
  assert.equal(secretsMatch('same-value', 'different-value'), false);
});
