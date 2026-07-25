import { NextResponse } from "next/server";

import {
  normalizedOrderSearch,
  orderPeriodFrom,
  orderSearchFilter,
  orderSince,
} from "../../../../lib/admin/order-filters";
import { getAdminContext } from "../../../../lib/auth/admin";
import { isOrderStatus, orderStatusLabels } from "../../../../lib/orders";

type ExportOrder = {
  created_at: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  delivery_city: string;
  delivery_details: string;
  delivery_method: "address" | "post_office" | "schedule" | "taxi";
  order_number: number;
  status: keyof typeof orderStatusLabels;
  total: number;
  tracking_number: string | null;
};

const deliveryMethodLabels: Record<ExportOrder["delivery_method"], string> = {
  address: "Адресна доставка",
  post_office: "Нова пошта",
  schedule: "Доставка за графіком",
  taxi: "Таксі",
};

function csvCell(value: number | string | null) {
  let text = value === null ? "" : String(value);

  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const query = normalizedOrderSearch(url.searchParams.get("q"));
  const period = orderPeriodFrom(url.searchParams.get("period"));
  const statusParam = url.searchParams.get("status");
  const status = statusParam && isOrderStatus(statusParam) ? statusParam : null;
  const since = orderSince(period);
  const rows: ExportOrder[] = [];
  const batchSize = 1000;

  for (let start = 0; start < 10_000; start += batchSize) {
    let exportQuery = supabase
      .from("orders")
      .select(
        "order_number,created_at,status,total,customer_first_name,customer_last_name,customer_phone,delivery_city,delivery_method,delivery_details,tracking_number",
      )
      .order("created_at", { ascending: false })
      .range(start, start + batchSize - 1);

    if (status) {
      exportQuery = exportQuery.eq("status", status);
    }

    if (since) {
      exportQuery = exportQuery.gte("created_at", since);
    }

    if (query) {
      exportQuery = exportQuery.or(orderSearchFilter(query));
    }

    const { data, error } = await exportQuery;

    if (error) {
      return NextResponse.json(
        { error: "Unable to export orders." },
        { status: 500 },
      );
    }

    const batch = (data ?? []) as ExportOrder[];
    rows.push(...batch);

    if (batch.length < batchSize) {
      break;
    }
  }

  const header = [
    "Номер",
    "Дата",
    "Статус",
    "Ім'я",
    "Телефон",
    "Місто",
    "Доставка",
    "Адреса / відділення",
    "ТТН",
    "Сума, грн",
  ];
  const csvRows = rows.map((order) =>
    [
      order.order_number,
      new Date(order.created_at).toLocaleString("uk-UA", {
        timeZone: "Europe/Kyiv",
      }),
      orderStatusLabels[order.status],
      `${order.customer_first_name} ${order.customer_last_name}`,
      order.customer_phone,
      order.delivery_city,
      deliveryMethodLabels[order.delivery_method],
      order.delivery_details,
      order.tracking_number,
      Number(order.total).toFixed(2),
    ]
      .map(csvCell)
      .join(","),
  );
  const body = `\uFEFF${[header.map(csvCell).join(","), ...csvRows].join("\r\n")}`;
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(body, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="dreamshop-orders-${date}.csv"`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
