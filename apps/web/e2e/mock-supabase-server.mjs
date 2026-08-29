import { spawn } from "node:child_process";
import { createServer } from "node:http";

const host = "127.0.0.1";
const mockPort = 9999;
const webPort = 3012;

const category = {
  description: "Стиглі фрукти без зайвого.",
  id: "11111111-1111-4111-8111-111111111111",
  is_active: true,
  media: [],
  name: "Фруктові чипси",
  slug: "fruit-chips",
  sort_order: 1,
};

const products = [
  {
    category: {
      id: category.id,
      is_active: true,
      name: category.name,
      slug: category.slug,
    },
    description: "Хрумкі мангові скибочки для перекусу та коктейлів.",
    id: "22222222-2222-4222-8222-222222222222",
    category_id: category.id,
    created_at: "2026-08-20T09:00:00.000Z",
    images: [],
    in_stock: true,
    ingredients: ["манго"],
    is_active: true,
    is_popular: true,
    legacy_id: "legacy-mango-chips",
    media: [],
    name: "Мангові чипси",
    organic: true,
    original_price: null,
    price: 180,
    slug: "mango-chips",
    sort_order: 1,
    stock_quantity: 9,
    weight: "50 г",
  },
  {
    category: {
      id: category.id,
      is_active: true,
      name: category.name,
      slug: category.slug,
    },
    description: "Полуничні скибочки, які тимчасово закінчилися.",
    id: "33333333-3333-4333-8333-333333333333",
    category_id: category.id,
    created_at: "2026-08-19T09:00:00.000Z",
    images: [],
    in_stock: false,
    ingredients: ["полуниця"],
    is_active: true,
    is_popular: false,
    legacy_id: "legacy-strawberry-chips",
    media: [],
    name: "Полуничні чипси",
    organic: true,
    original_price: null,
    price: 175,
    slug: "strawberry-chips",
    sort_order: 2,
    stock_quantity: 0,
    weight: "50 г",
  },
];

const fixtureAdmin = {
  app_metadata: { role: "admin" },
  aud: "authenticated",
  created_at: "2026-01-01T00:00:00.000Z",
  email: "admin@fixture.invalid",
  id: "44444444-4444-4444-8444-444444444444",
  role: "authenticated",
  user_metadata: { first_name: "Олена" },
};

const profile = {
  contact_phone: "+380670000000",
  discount_percent: 5,
  email: fixtureAdmin.email,
  first_name: "Олена",
  id: fixtureAdmin.id,
  last_name: "Тестова",
  phone: "+380670000000",
  role: "admin",
};

const address = {
  city: "Одеса",
  delivery_details: "Відділення №1",
  delivery_method: "post_office",
  establishment_name: null,
  first_name: "Олена",
  id: "55555555-5555-4555-8555-555555555555",
  is_default: true,
  is_private_person: true,
  label: "Основна адреса",
  last_name: "Тестова",
  phone: "+380670000000",
  user_id: fixtureAdmin.id,
};

const order = {
  contact_for_clarification: false,
  created_at: "2026-08-20T10:30:00.000Z",
  customer_first_name: "Олена",
  customer_last_name: "Тестова",
  customer_note: "Без дзвінка",
  customer_phone: "+380670000000",
  delivery_amount: 0,
  delivery_city: "Одеса",
  delivery_details: "Відділення №1",
  delivery_method: "post_office",
  discount_amount: 18,
  establishment_name: null,
  id: "66666666-6666-4666-8666-666666666666",
  is_private_person: true,
  items: [
    {
      count: 1,
      id: "77777777-7777-4777-8777-777777777777",
      product_image_object_key: null,
      product_name: "Мангові чипси",
      quantity: 2,
      unit_price: 180,
    },
  ],
  order_number: 1042,
  payment_method: "cash_on_delivery",
  status: "processing",
  subtotal: 360,
  total: 342,
  tracking_number: null,
  user_id: fixtureAdmin.id,
};

const notification = {
  body: "Замовлення №1042 прийнято в обробку.",
  created_at: "2026-08-20T10:35:00.000Z",
  id: "88888888-8888-4888-8888-888888888888",
  order_id: order.id,
  read_at: null,
  title: "Статус замовлення оновлено",
  user_id: fixtureAdmin.id,
};

function sendJson(response, body, total = Array.isArray(body) ? body.length : 1) {
  response.writeHead(200, {
    "access-control-allow-origin": "*",
    "content-range": total ? `0-${total - 1}/${total}` : "*/0",
    "content-type": "application/json",
  });
  response.end(JSON.stringify(body));
}

function matchingProducts(searchParams) {
  const slug = searchParams.get("slug");
  const idFilter = searchParams.get("id");
  const legacyId = searchParams.get("legacy_id");
  const excludedId = idFilter?.startsWith("neq.")
    ? idFilter.replace("neq.", "")
    : null;
  const exactId = idFilter?.startsWith("eq.")
    ? idFilter.replace("eq.", "")
    : null;

  return products.filter((product) => {
    if (slug && product.slug !== slug.replace("eq.", "")) return false;
    if (legacyId && product.legacy_id !== legacyId.replace("eq.", "")) return false;
    if (exactId && product.id !== exactId) return false;
    return product.id !== excludedId;
  });
}

function hasBearerToken(request) {
  const authorization = request.headers.authorization;
  return Boolean(authorization?.startsWith("Bearer ") && authorization.split(".").length === 3);
}

const mockSupabase = createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${host}:${mockPort}`);

  if (url.pathname === "/rest/v1/categories") {
    sendJson(response, [category]);
    return;
  }

  if (url.pathname === "/rest/v1/products") {
    const rows = matchingProducts(url.searchParams);
    sendJson(response, rows, rows.length);
    return;
  }

  if (url.pathname === "/rest/v1/profiles") {
    sendJson(response, [profile]);
    return;
  }

  if (url.pathname === "/rest/v1/customer_addresses") {
    sendJson(response, [address]);
    return;
  }

  if (url.pathname === "/rest/v1/orders") {
    const exactId = url.searchParams.get("id")?.replace("eq.", "");
    const rows = exactId && order.id !== exactId ? [] : [order];
    sendJson(response, rows, rows.length);
    return;
  }

  if (url.pathname === "/rest/v1/notifications") {
    sendJson(response, [notification]);
    return;
  }

  if (url.pathname === "/rest/v1/product_media") {
    sendJson(response, []);
    return;
  }

  if (url.pathname === "/rest/v1/order_status_history") {
    sendJson(response, [
      { created_at: order.created_at, id: 1, status: "pending" },
      { created_at: "2026-08-20T10:35:00.000Z", id: 2, status: "processing" },
    ]);
    return;
  }

  if (url.pathname === "/rest/v1/rpc/get_admin_dashboard_summary") {
    sendJson(response, [{
      customer_count: 18,
      low_stock_count: 1,
      orders_30d_count: 12,
      out_of_stock_count: 1,
      pending_order_count: 2,
      processing_order_count: 1,
      revenue_30d: 8240,
    }]);
    return;
  }

  if (url.pathname === "/rest/v1/rpc/get_admin_integration_summary") {
    sendJson(response, [{
      failed_count: 0,
      oldest_pending_at: null,
      pending_count: 0,
      processed_24h_count: 4,
      retrying_count: 0,
    }]);
    return;
  }

  if (url.pathname === "/rest/v1/rpc/get_admin_failed_integration_events") {
    sendJson(response, []);
    return;
  }

  if (url.pathname === "/rest/v1/rpc/get_admin_order_summary") {
    sendJson(response, [{ order_count: 1, order_total: order.total }]);
    return;
  }

  if (url.pathname === "/rest/v1/rpc/get_admin_order_status_counts") {
    sendJson(response, [
      { order_count: 0, status: "cancelled" },
      { order_count: 0, status: "delivered" },
      { order_count: 1, status: "processing" },
      { order_count: 0, status: "pending" },
      { order_count: 0, status: "shipped" },
    ]);
    return;
  }

  if (url.pathname === "/auth/v1/user" && hasBearerToken(request)) {
    sendJson(response, fixtureAdmin);
    return;
  }

  if (url.pathname.startsWith("/auth/v1/")) {
    response.writeHead(401, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "not_authenticated" }));
    return;
  }

  sendJson(response, []);
});

let nextProcess;
let stopping = false;
const appEnvironment = {
  ...process.env,
  NEXT_PUBLIC_API_URL: `http://${host}:${mockPort}`,
  NEXT_PUBLIC_E2E_MOCK: "1",
  NEXT_PUBLIC_SITE_URL: "https://dream-odessa.shop",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "playwright-public-key",
  NEXT_PUBLIC_SUPABASE_URL: `http://${host}:${mockPort}`,
  STOREFRONT_MAINTENANCE: "false",
};

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;

  if (nextProcess && nextProcess.exitCode === null) {
    nextProcess.kill("SIGTERM");
  }

  mockSupabase.close(() => process.exit(exitCode));
  setTimeout(() => process.exit(exitCode), 5_000).unref();
}

function startProductionServer() {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  nextProcess = spawn(npm, ["run", "start", "--", "--port", String(webPort)], {
    env: appEnvironment,
    stdio: "inherit",
  });
  nextProcess.once("exit", (code) => stop(code ?? 1));
}

function buildThenStart() {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  nextProcess = spawn(npm, ["run", "build"], {
    env: appEnvironment,
    stdio: "inherit",
  });
  nextProcess.once("exit", (code) => {
    if (stopping) return;
    if (code !== 0) {
      stop(code ?? 1);
      return;
    }
    startProductionServer();
  });
}

mockSupabase.once("error", (error) => {
  console.error("Unable to start the local Playwright Supabase mock.", error);
  process.exit(1);
});

mockSupabase.listen(mockPort, host, () => {
  buildThenStart();
});

process.once("SIGINT", () => stop());
process.once("SIGTERM", () => stop());
