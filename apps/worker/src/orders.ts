import { createClient } from "@supabase/supabase-js";

import type { WorkerEnv } from "./types";

type ClaimedEvent = {
  aggregate_id: string | null;
  id: number;
};

type OrderRow = {
  contact_for_clarification: boolean;
  customer_first_name: string;
  customer_last_name: string;
  customer_note: string | null;
  customer_phone: string;
  delivery_city: string;
  delivery_details: string;
  delivery_method: string;
  order_number: number;
  payment_method: string;
  total: number;
};

type OrderItemRow = {
  product_name: string;
  quantity: number;
  unit_price: number;
};

const deliveryLabels: Record<string, string> = {
  address: "Адресна доставка",
  post_office: "Відділення пошти",
  schedule: "За розкладом",
  taxi: "Таксі",
};

const paymentLabels: Record<string, string> = {
  bank_transfer: "Переказ на рахунок",
  card_on_delivery: "Карткою при отриманні",
  card_online: "Онлайн карткою",
  cash_on_delivery: "Післяплата",
};

function serviceClient(env: WorkerEnv) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

function escapeHtml(value: string | number) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength
    ? `${value.slice(0, maxLength - 1)}…`
    : value;
}

function money(value: number) {
  return new Intl.NumberFormat("uk-UA", {
    currency: "UAH",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

function orderMessage(order: OrderRow, items: OrderItemRow[]) {
  const itemLines = items.slice(0, 15).map(
    (item) =>
      `• ${escapeHtml(truncate(item.product_name, 120))} × ${
        item.quantity
      } — ${escapeHtml(money(item.unit_price * item.quantity))}`,
  );

  if (items.length > 15) {
    itemLines.push(`• Ще позицій: ${items.length - 15}`);
  }

  const lines = [
    `<b>Нове замовлення №${escapeHtml(order.order_number)}</b>`,
    "",
    ...itemLines,
    "",
    `<b>Разом:</b> ${escapeHtml(money(order.total))}`,
    `<b>Одержувач:</b> ${escapeHtml(order.customer_first_name)} ${escapeHtml(
      order.customer_last_name,
    )}`,
    `<b>Телефон:</b> ${escapeHtml(order.customer_phone)}`,
    `<b>Доставка:</b> ${escapeHtml(
      deliveryLabels[order.delivery_method] ?? order.delivery_method,
    )}`,
    `<b>Місто:</b> ${escapeHtml(order.delivery_city)}`,
    `<b>Деталі:</b> ${escapeHtml(truncate(order.delivery_details, 300))}`,
    `<b>Оплата:</b> ${escapeHtml(
      paymentLabels[order.payment_method] ?? order.payment_method,
    )}`,
  ];

  if (order.contact_for_clarification) {
    lines.push("<b>Потрібен дзвінок для уточнення</b>");
  }

  if (order.customer_note) {
    lines.push(
      `<b>Коментар:</b> ${escapeHtml(truncate(order.customer_note, 500))}`,
    );
  }

  return lines.join("\n");
}

async function sendOrderMessage(
  env: WorkerEnv,
  order: OrderRow,
  items: OrderItemRow[],
) {
  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      body: JSON.stringify({
        chat_id: env.TELEGRAM_ORDER_CHAT_ID,
        disable_web_page_preview: true,
        parse_mode: "HTML",
        text: orderMessage(order, items),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error("Telegram rejected the order notification.");
  }
}

export async function processOrderOutbox(env: WorkerEnv) {
  if (
    !env.SUPABASE_URL ||
    !env.SUPABASE_SECRET_KEY ||
    !env.TELEGRAM_BOT_TOKEN ||
    !/^-?\d+$/.test(env.TELEGRAM_ORDER_CHAT_ID?.trim() ?? "")
  ) {
    return { processed: 0 };
  }

  const supabase = serviceClient(env);
  const { data, error } = await supabase.rpc("claim_integration_events", {
    p_event_type: "order.created",
    p_limit: 10,
  });

  if (error) {
    throw new Error("Unable to claim order events.");
  }

  const events = (data ?? []) as ClaimedEvent[];
  let processed = 0;

  for (const event of events) {
    try {
      if (!event.aggregate_id) {
        throw new Error("Order event has no aggregate ID.");
      }

      const [{ data: order, error: orderError }, { data: items, error: itemsError }] =
        await Promise.all([
          supabase
            .from("orders")
            .select(
              "order_number,total,customer_first_name,customer_last_name,customer_phone,delivery_city,delivery_method,delivery_details,payment_method,contact_for_clarification,customer_note",
            )
            .eq("id", event.aggregate_id)
            .maybeSingle(),
          supabase
            .from("order_items")
            .select("product_name,unit_price,quantity")
            .eq("order_id", event.aggregate_id)
            .order("id"),
        ]);

      if (orderError || itemsError || !order || !items?.length) {
        throw new Error("Order data is unavailable.");
      }

      await sendOrderMessage(
        env,
        order as OrderRow,
        items as OrderItemRow[],
      );

      const { error: updateError } = await supabase
        .from("integration_outbox")
        .update({
          last_error: null,
          processed_at: new Date().toISOString(),
        })
        .eq("id", event.id);

      if (updateError) {
        throw new Error("Unable to complete the order event.");
      }

      processed += 1;
    } catch {
      const retryAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      await supabase
        .from("integration_outbox")
        .update({
          available_at: retryAt,
          last_error: "order_notification_failed",
        })
        .eq("id", event.id);
    }
  }

  return { processed };
}
