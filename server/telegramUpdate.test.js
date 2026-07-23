const assert = require('node:assert/strict');
const test = require('node:test');

require('ts-node').register({
  compilerOptions: {
    module: 'CommonJS',
  },
  transpileOnly: true,
});

const {
  getTelegramUpdateId,
  normalizePhoneNumber,
  parseTelegramMessage,
  parseTelegramUpdate,
} = require('./telegramUpdate');

test('Telegram update parsing accepts a contact update without trusting its owner', () => {
  const update = parseTelegramUpdate(JSON.stringify({
    update_id: 123,
    message: {
      chat: { id: 456 },
      from: { id: 789, first_name: 'Test', last_name: 'User' },
      contact: { user_id: 999, phone_number: '+380 67 123 45 67' },
    },
  }));

  assert.ok(update);
  assert.equal(getTelegramUpdateId(update), '123');
  assert.deepEqual(parseTelegramMessage(update), {
    chatId: '456',
    contact: {
      phoneNumber: '+380 67 123 45 67',
      userId: '999',
    },
    from: {
      id: '789',
      name: 'Test User',
    },
    text: undefined,
  });
});

test('phone normalization produces E.164-like values and rejects invalid input', () => {
  assert.equal(normalizePhoneNumber('067 123 45 67'), '+380671234567');
  assert.equal(normalizePhoneNumber('00380 67 123 45 67'), '+380671234567');
  assert.equal(normalizePhoneNumber('123'), null);
});

test('Telegram update parsing rejects unsafe numeric identifiers', () => {
  const update = parseTelegramUpdate({
    update_id: Number.MAX_SAFE_INTEGER + 1,
  });

  assert.ok(update);
  assert.equal(getTelegramUpdateId(update), null);
});
