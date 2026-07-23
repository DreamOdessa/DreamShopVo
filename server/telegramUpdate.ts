export type JsonRecord = Record<string, unknown>;

export type TelegramMessage = {
  chatId: string;
  contact?: {
    phoneNumber: string;
    userId: string;
  };
  from: {
    id: string;
    name: string;
  };
  text?: string;
};

export function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getSafeInteger(value: unknown): string | null {
  return typeof value === 'number' && Number.isSafeInteger(value)
    ? String(value)
    : null;
}

export function parseTelegramUpdate(body: unknown): JsonRecord | null {
  if (isRecord(body)) return body;
  if (typeof body !== 'string') return null;

  try {
    const parsed = JSON.parse(body);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function getTelegramUpdateId(update: JsonRecord): string | null {
  return getSafeInteger(update.update_id);
}

export function parseTelegramMessage(
  update: JsonRecord
): TelegramMessage | null {
  if (!isRecord(update.message)) return null;
  const message = update.message;
  if (!isRecord(message.chat) || !isRecord(message.from)) return null;

  const chatId = getSafeInteger(message.chat.id);
  const fromId = getSafeInteger(message.from.id);
  if (!chatId || !fromId) return null;

  const firstName = typeof message.from.first_name === 'string'
    ? message.from.first_name.trim()
    : '';
  const lastName = typeof message.from.last_name === 'string'
    ? message.from.last_name.trim()
    : '';
  const name = [firstName, lastName].filter(Boolean).join(' ').slice(0, 120) ||
    'Telegram user';
  const text = typeof message.text === 'string'
    ? message.text.trim().slice(0, 256)
    : undefined;

  let contact: TelegramMessage['contact'];
  if (isRecord(message.contact)) {
    const contactUserId = getSafeInteger(message.contact.user_id);
    const phoneNumber = typeof message.contact.phone_number === 'string'
      ? message.contact.phone_number
      : '';
    if (contactUserId && phoneNumber) {
      contact = {
        phoneNumber,
        userId: contactUserId,
      };
    }
  }

  return {
    chatId,
    contact,
    from: {
      id: fromId,
      name,
    },
    text,
  };
}

export function normalizePhoneNumber(value: string): string | null {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith('0')) digits = `38${digits}`;
  return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
}
