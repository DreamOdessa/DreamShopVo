import type { TelegramWebhookEnvironment } from './env';
import { getPrisma } from './prisma';
import { sendTelegramMessage } from './telegramApi';
import {
  createTelegramToken,
  hashTelegramToken,
  verifyTelegramToken,
} from './telegramTokens';
import {
  type JsonRecord,
  type TelegramMessage,
  normalizePhoneNumber,
  parseTelegramMessage,
} from './telegramUpdate';

const START_COMMAND = /^\/start(?:@[A-Za-z0-9_]+)?(?:\s+(\S+))?\s*$/;

async function handleStartCommand(
  message: TelegramMessage,
  token: string | undefined,
  environment: TelegramWebhookEnvironment
): Promise<void> {
  const prisma = getPrisma();
  const challengeId = token
    ? verifyTelegramToken(token, 'start', environment.secret)
    : null;

  if (!token || !challengeId) {
    await sendTelegramMessage(
      environment.botToken,
      message.chatId,
      `Відкрийте реєстрацію на сайті ${environment.siteOrigin} і натисніть кнопку Telegram.`
    );
    return;
  }

  const challenge = await prisma.telegramAuthChallenge.findUnique({
    where: {
      id: challengeId,
    },
    select: {
      expiresAt: true,
      telegramUserId: true,
      tokenHash: true,
    },
  });
  const isValidChallenge = challenge &&
    challenge.expiresAt > new Date() &&
    challenge.tokenHash === hashTelegramToken(token) &&
    (!challenge.telegramUserId || challenge.telegramUserId === message.from.id);

  if (!isValidChallenge) {
    await sendTelegramMessage(
      environment.botToken,
      message.chatId,
      'Посилання недійсне або вже прострочене. Поверніться на сайт і почніть ще раз.'
    );
    return;
  }

  const result = await prisma.telegramAuthChallenge.updateMany({
    where: {
      id: challengeId,
      status: 'PENDING_CONTACT',
      expiresAt: {
        gt: new Date(),
      },
      OR: [
        { telegramUserId: null },
        { telegramUserId: message.from.id },
      ],
    },
    data: {
      telegramChatId: message.chatId,
      telegramName: message.from.name,
      telegramUserId: message.from.id,
    },
  });

  if (result.count !== 1) {
    await sendTelegramMessage(
      environment.botToken,
      message.chatId,
      'Це посилання вже використане. Поверніться на сайт і почніть реєстрацію ще раз.'
    );
    return;
  }

  await sendTelegramMessage(
    environment.botToken,
    message.chatId,
    'Для підтвердження номера натисніть кнопку нижче.',
    {
      keyboard: [[{
        text: 'Поділитися номером',
        request_contact: true,
      }]],
      one_time_keyboard: true,
      resize_keyboard: true,
    }
  );
}

async function handleContact(
  message: TelegramMessage,
  environment: TelegramWebhookEnvironment
): Promise<void> {
  if (!message.contact || message.contact.userId !== message.from.id) {
    await sendTelegramMessage(
      environment.botToken,
      message.chatId,
      'Надішліть, будь ласка, власний номер кнопкою «Поділитися номером».'
    );
    return;
  }

  const phoneNumber = normalizePhoneNumber(message.contact.phoneNumber);
  if (!phoneNumber) {
    await sendTelegramMessage(
      environment.botToken,
      message.chatId,
      'Не вдалося перевірити формат номера. Поверніться на сайт і спробуйте ще раз.'
    );
    return;
  }

  const prisma = getPrisma();
  const challenge = await prisma.telegramAuthChallenge.findFirst({
    where: {
      telegramUserId: message.from.id,
      telegramChatId: message.chatId,
      status: {
        in: ['PENDING_CONTACT', 'READY_FOR_PASSWORD'],
      },
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!challenge) {
    await sendTelegramMessage(
      environment.botToken,
      message.chatId,
      `Сесія реєстрації прострочена. Поверніться на сайт ${environment.siteOrigin} і почніть ще раз.`,
      { remove_keyboard: true }
    );
    return;
  }

  await prisma.telegramAuthChallenge.update({
    where: {
      id: challenge.id,
    },
    data: {
      phoneNumber,
      status: 'READY_FOR_PASSWORD',
      telegramName: message.from.name,
    },
  });

  const completionToken = createTelegramToken(
    'complete',
    challenge.id,
    environment.secret
  );
  const completionUrl = new URL('/auth/telegram/complete', environment.siteOrigin);
  completionUrl.searchParams.set('token', completionToken);

  await sendTelegramMessage(
    environment.botToken,
    message.chatId,
    `Номер підтверджено. Завершіть реєстрацію: ${completionUrl.toString()}`,
    { remove_keyboard: true }
  );
}

export async function processTelegramUpdate(
  update: JsonRecord,
  environment: TelegramWebhookEnvironment
): Promise<void> {
  const message = parseTelegramMessage(update);
  if (!message) return;

  if (message.contact) {
    await handleContact(message, environment);
    return;
  }

  const command = message.text ? START_COMMAND.exec(message.text) : null;
  if (command) {
    await handleStartCommand(message, command[1], environment);
  }
}
