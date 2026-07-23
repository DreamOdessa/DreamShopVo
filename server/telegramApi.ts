const TELEGRAM_API_TIMEOUT_MS = 8_000;

type ReplyMarkup = {
  keyboard?: Array<Array<{
    text: string;
    request_contact?: boolean;
  }>>;
  remove_keyboard?: boolean;
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
};

export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string,
  replyMarkup?: ReplyMarkup
): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TELEGRAM_API_TIMEOUT_MS);

  try {
    let response: Response;
    try {
      response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            disable_web_page_preview: true,
            ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
          }),
          signal: controller.signal,
        }
      );
    } catch {
      throw new Error('Telegram API request failed');
    }

    if (!response.ok) {
      throw new Error(`Telegram API returned status ${response.status}`);
    }

    const result = await response.json() as { ok?: boolean };
    if (!result.ok) {
      throw new Error('Telegram API rejected the message');
    }
  } finally {
    clearTimeout(timeout);
  }
}
