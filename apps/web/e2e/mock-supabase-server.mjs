import { spawn } from "node:child_process";
import { createServer } from "node:http";

const host = "127.0.0.1";
const mockPort = 9999;
const webPort = 3012;

const category = {
  description: "Стиглі фрукти без зайвого.",
  id: "11111111-1111-4111-8111-111111111111",
  media: [],
  name: "Фруктові чипси",
  slug: "fruit-chips",
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
    images: [],
    in_stock: true,
    media: [],
    name: "Мангові чипси",
    organic: true,
    original_price: null,
    price: 180,
    slug: "mango-chips",
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
    images: [],
    in_stock: false,
    media: [],
    name: "Полуничні чипси",
    organic: true,
    original_price: null,
    price: 175,
    slug: "strawberry-chips",
    stock_quantity: 0,
    weight: "50 г",
  },
];

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
  const excludedId = searchParams.get("id")?.replace("neq.", "");

  return products.filter((product) => {
    if (slug && product.slug !== slug.replace("eq.", "")) return false;
    return product.id !== excludedId;
  });
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
  NEXT_PUBLIC_SITE_URL: `http://localhost:${webPort}`,
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
