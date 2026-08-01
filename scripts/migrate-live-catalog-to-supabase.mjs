import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, "..");
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const { createClient } = webRequire("@supabase/supabase-js");

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

loadEnv(path.join(root, ".env.local"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
const apply = process.argv.includes("--apply");
const writeMigration = process.argv.includes("--write-migration");

if (apply && (!supabaseUrl || !supabaseSecret)) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required.");
}

const firebase = initializeApp(
  {
    apiKey: "AIzaSyAxCHgP-eF_xp1kPan6HtcYUCYCJBZc7VE",
    authDomain: "dreamshop-odessa.firebaseapp.com",
    projectId: "dreamshop-odessa",
  },
  `catalog-migration-${Date.now()}`,
);
const firestore = getFirestore(firebase);
const supabase = apply
  ? createClient(supabaseUrl, supabaseSecret, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

const excludedName = /(ликер|лікер|джин|джын|джинов|настойк|настоян|spicer)/i;

function cleanSlug(value, fallback) {
  const slug = String(value || fallback)
    .normalize("NFKC")
    .toLocaleLowerCase("uk-UA")
    .replace(/[’'"`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return slug || fallback;
}

function asNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function asTextArray(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value.split(/[,;\n]/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

const [categorySnapshot, productSnapshot] = await Promise.all([
  getDocs(collection(firestore, "categories")),
  getDocs(collection(firestore, "products")),
]);

const sourceCategories = categorySnapshot.docs.map((document) => ({
  legacyId: document.id,
  ...document.data(),
}));
const sourceProducts = productSnapshot.docs
  .map((document) => ({ legacyId: document.id, ...document.data() }))
  .filter((product) => !excludedName.test(`${product.name || ""} ${product.title || ""}`));

const categoryBySlug = new Map();
for (const category of sourceCategories) {
  const slug = cleanSlug(category.slug, `category-${category.legacyId}`);
  categoryBySlug.set(slug, { ...category, slug });
}
for (const product of sourceProducts) {
  const slug = cleanSlug(product.category, "other");
  if (!categoryBySlug.has(slug)) {
    categoryBySlug.set(slug, {
      description: "",
      isActive: true,
      legacyId: `generated:${slug}`,
      name: String(product.category || "Інше"),
      showInShowcase: false,
      slug,
      sortOrder: 999,
    });
  }
}

console.log(`Firestore: ${sourceCategories.length} categories, ${productSnapshot.size} products.`);
console.log(`Migration set: ${categoryBySlug.size} categories, ${sourceProducts.length} products.`);

function sqlValue(value) {
  if (value == null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlTextArray(value) {
  const items = asTextArray(value);
  return items.length ? `array[${items.map(sqlValue).join(",")}]::text[]` : "'{}'::text[]";
}

if (writeMigration) {
  const lines = [
    "-- Generated from the live legacy Firestore catalog.",
    "-- Media URLs are intentionally excluded; new images are managed through R2.",
    "begin;",
    "",
  ];

  for (const source of categoryBySlug.values()) {
    lines.push(
      "insert into public.categories (legacy_id,name,slug,description,is_active,show_in_showcase,sort_order)",
      `values (${sqlValue(source.legacyId)},${sqlValue(source.name || source.slug)},${sqlValue(source.slug)},${sqlValue(source.description || "")},${sqlValue(source.isActive !== false)},${sqlValue(source.showInShowcase === true)},${Math.trunc(asNumber(source.sortOrder, 0))})`,
      "on conflict (slug) do update set",
      "  legacy_id = excluded.legacy_id, name = excluded.name, description = excluded.description,",
      "  is_active = excluded.is_active, show_in_showcase = excluded.show_in_showcase, sort_order = excluded.sort_order;",
      "",
    );
  }

  for (let index = 0; index < sourceProducts.length; index += 1) {
    const source = sourceProducts[index];
    const categorySlug = cleanSlug(source.category, "other");
    const slug = cleanSlug(source.slug, `product-${source.legacyId}`);
    const price = Math.max(0, asNumber(source.price));
    const originalCandidate = asNumber(source.oldPrice ?? source.originalPrice, 0);
    const stockQuantity = source.stockQuantity == null
      ? null
      : Math.max(0, Math.trunc(asNumber(source.stockQuantity)));
    const values = [
      sqlValue(source.legacyId),
      `(select id from public.categories where slug = ${sqlValue(categorySlug)})`,
      sqlValue(source.name || "Товар"),
      sqlValue(slug),
      sqlValue(source.description || ""),
      sqlValue(price),
      sqlValue(originalCandidate > price ? originalCandidate : null),
      sqlValue(source.organic === true),
      sqlValue(source.inStock !== false && stockQuantity !== 0),
      sqlValue(source.isActive !== false),
      sqlValue(source.isPopular === true || source.isFeatured === true),
      sqlValue(String(source.weight || source.volume || "").trim() || null),
      sqlTextArray(source.ingredients),
      String(index),
      sqlValue(stockQuantity),
    ];
    lines.push(
      "insert into public.products (legacy_id,category_id,name,slug,description,price,original_price,organic,in_stock,is_active,is_popular,weight,ingredients,sort_order,stock_quantity)",
      `values (${values.join(",")})`,
      "on conflict (slug) do update set",
      "  legacy_id = excluded.legacy_id, category_id = excluded.category_id, name = excluded.name,",
      "  description = excluded.description, price = excluded.price, original_price = excluded.original_price,",
      "  organic = excluded.organic, in_stock = excluded.in_stock, is_active = excluded.is_active,",
      "  is_popular = excluded.is_popular, weight = excluded.weight, ingredients = excluded.ingredients,",
      "  sort_order = excluded.sort_order, stock_quantity = excluded.stock_quantity;",
      "",
    );
  }

  lines.push("commit;", "");
  const migrationPath = path.join(
    root,
    "supabase/migrations/20260801213000_import_legacy_catalog.sql",
  );
  fs.writeFileSync(migrationPath, lines.join("\n"));
  console.log(`Wrote ${migrationPath}.`);
  process.exit(0);
}

if (!apply) {
  console.log("Dry run complete. Add --apply to write to Supabase.");
  process.exit(0);
}

const { data: existingCategories, error: categoryReadError } = await supabase
  .from("categories")
  .select("id,legacy_id,slug");
if (categoryReadError) throw categoryReadError;

const categoryIds = new Map();
for (const source of categoryBySlug.values()) {
  const existing = existingCategories.find(
    (item) => item.legacy_id === source.legacyId || item.slug === source.slug,
  );
  const values = {
    description: String(source.description || ""),
    is_active: source.isActive !== false,
    legacy_id: source.legacyId,
    name: String(source.name || source.slug),
    show_in_showcase: source.showInShowcase === true,
    slug: source.slug,
    sort_order: Math.trunc(asNumber(source.sortOrder, 0)),
  };
  const query = existing
    ? supabase.from("categories").update(values).eq("id", existing.id).select("id").single()
    : supabase.from("categories").insert(values).select("id").single();
  const { data, error } = await query;
  if (error) throw new Error(`Category ${source.name}: ${error.message}`);
  categoryIds.set(source.slug, data.id);
}

const { data: existingProducts, error: productReadError } = await supabase
  .from("products")
  .select("id,legacy_id,slug");
if (productReadError) throw productReadError;

let inserted = 0;
let updated = 0;
for (let index = 0; index < sourceProducts.length; index += 1) {
  const source = sourceProducts[index];
  const categorySlug = cleanSlug(source.category, "other");
  const categoryId = categoryIds.get(categorySlug);
  if (!categoryId) throw new Error(`Missing category ${categorySlug} for ${source.name}.`);

  const slug = cleanSlug(source.slug, `product-${source.legacyId}`);
  const existing = existingProducts.find(
    (item) => item.legacy_id === source.legacyId || item.slug === slug,
  );
  const price = Math.max(0, asNumber(source.price));
  const originalCandidate = asNumber(source.oldPrice ?? source.originalPrice, 0);
  const stockQuantity = source.stockQuantity == null
    ? null
    : Math.max(0, Math.trunc(asNumber(source.stockQuantity)));
  const values = {
    category_id: categoryId,
    description: String(source.description || ""),
    in_stock: source.inStock !== false && stockQuantity !== 0,
    ingredients: asTextArray(source.ingredients),
    is_active: source.isActive !== false,
    is_popular: source.isPopular === true || source.isFeatured === true,
    legacy_id: source.legacyId,
    name: String(source.name || "Товар"),
    organic: source.organic === true,
    original_price: originalCandidate > price ? originalCandidate : null,
    price,
    slug,
    sort_order: index,
    stock_quantity: stockQuantity,
    weight: String(source.weight || source.volume || "").trim() || null,
  };
  const query = existing
    ? supabase.from("products").update(values).eq("id", existing.id)
    : supabase.from("products").insert(values);
  const { error } = await query;
  if (error) throw new Error(`Product ${source.name}: ${error.message}`);
  if (existing) updated += 1;
  else inserted += 1;
}

console.log(`Supabase updated: ${updated} products; inserted: ${inserted} products.`);
console.log("Legacy image links were intentionally not migrated.");
