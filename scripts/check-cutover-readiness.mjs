import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const failures = [];

async function text(path) {
  return readFile(resolve(root, path), "utf8");
}

function requireText(path, contents, expected) {
  if (!contents.includes(expected)) {
    failures.push(`${path} is missing required marker: ${expected}`);
  }
}

const [plan, uat, webConfig, workerConfig, legacyConfig, firebaseConfig, webEnv, workerEnv] =
  await Promise.all([
    text("MASTER_REBUILD_PLAN.md"),
    text("docs/ADMIN_UAT_MATRIX.md"),
    text("apps/web/vercel.json"),
    text("apps/worker/wrangler.jsonc"),
    text("vercel.json"),
    text("firebase.json"),
    text("apps/web/.env.example"),
    text("apps/worker/.dev.vars.example"),
  ]);

requireText("MASTER_REBUILD_PLAN.md", plan, "[x] **RB-009");
requireText("docs/ADMIN_UAT_MATRIX.md", uat, "| Checkout and cancellation |");
requireText("apps/web/vercel.json", webConfig, '"framework": "nextjs"');
requireText("apps/worker/wrangler.jsonc", workerConfig, '"name": "dreamshop-api"');
requireText("apps/worker/wrangler.jsonc", workerConfig, '"binding": "PRODUCT_MEDIA"');
requireText("apps/worker/wrangler.jsonc", workerConfig, '"observability"');
requireText("vercel.json", legacyConfig, '"@vercel/static-build"');
requireText("firebase.json", firebaseConfig, '"source": "functions"');

for (const name of [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_SITE_URL",
]) {
  requireText("apps/web/.env.example", webEnv, `${name}=`);
}

for (const name of [
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SECRET_KEY",
  "ALLOWED_ORIGINS",
  "NOVA_POSHTA_API_KEY",
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_ORDER_CHAT_ID",
  "TELEGRAM_WEBHOOK_SECRET",
  "SITE_URL",
]) {
  requireText("apps/worker/.dev.vars.example", workerEnv, `${name}=`);
  requireText("apps/worker/wrangler.jsonc", workerConfig, `"${name}"`);
}

const migrations = (await readdir(resolve(root, "supabase/migrations")))
  .filter((name) => name.endsWith(".sql"))
  .sort();
const requiredMigrations = [
  "20260723210000_initial_marketplace_schema.sql",
  "20260820110000_enforce_product_media_slot_limit.sql",
  "20260829140000_disable_unconfigured_payment_methods.sql",
  "20260829160000_notify_customer_when_order_is_created.sql",
];

if (migrations.length < 1) {
  failures.push("No Supabase migrations were found.");
}

for (const migration of requiredMigrations) {
  if (!migrations.includes(migration)) {
    failures.push(`Required Supabase migration is missing: ${migration}`);
  }
}

for (const migration of migrations) {
  if (!/^\d{14}_[a-z0-9_]+\.sql$/.test(migration)) {
    failures.push(`Supabase migration name is not sortable: ${migration}`);
  }
}

if (failures.length) {
  console.error("Cutover preflight failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(
    `Cutover repository preflight passed: ${migrations.length} ordered migrations, UAT evidence, target configs, rollback configs and environment-name contracts are present.`,
  );
  console.log(
    "Remote auth, backups, R2 inventory, staging deployment, observability and domain rollback still require an authenticated rehearsal.",
  );
}
