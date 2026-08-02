import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Canvas, loadImage } from "skia-canvas";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
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

loadEnv(path.join(root, "apps/web/.env.local"));
loadEnv(path.join(root, ".env.local"));

const apply = process.argv.includes("--apply");
const force = process.argv.includes("--force");
const keepFiles = process.argv.includes("--keep-files") || !apply;
const limitArg = process.argv.find((argument) => argument.startsWith("--limit="));
const productArg = process.argv.find((argument) => argument.startsWith("--product="));
const limit = limitArg ? Math.max(1, Number(limitArg.split("=")[1]) || 1) : Infinity;
const productFilter = productArg?.split("=").slice(1).join("=").trim().toLowerCase();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = apply
  ? process.env.SUPABASE_SECRET_KEY
  : process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    apply
      ? "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required for --apply."
      : "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are required.",
  );
}

const outputDirectory = path.join(root, ".generated/product-covers");
fs.mkdirSync(outputDirectory, { recursive: true });

const firebase = initializeApp(
  {
    apiKey: "AIzaSyAxCHgP-eF_xp1kPan6HtcYUCYCJBZc7VE",
    authDomain: "dreamshop-odessa.firebaseapp.com",
    projectId: "dreamshop-odessa",
  },
  `cover-source-${Date.now()}`,
);
const firestore = getFirestore(firebase);
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function sourceImages(product) {
  return [...new Set([
    product.image,
    product.imageUrl,
    ...(Array.isArray(product.images) ? product.images : []),
  ].filter((value) => typeof value === "string" && /^https?:\/\//.test(value)))];
}

function wrapTitle(context, title, maxWidth) {
  const words = title.trim().replace(/\s+/g, " ").split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && context.measureText(candidate).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function drawRubberMat(context, width, height, logo) {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#092f38");
  gradient.addColorStop(0.52, "#0b5360");
  gradient.addColorStop(1, "#06252c");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalAlpha = 0.18;
  context.strokeStyle = "#8bd9dc";
  context.lineWidth = 3;
  for (let y = 20; y < height; y += 24) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y + 34);
    context.stroke();
  }
  context.restore();

  context.fillStyle = "rgba(1, 17, 21, 0.42)";
  context.roundRect(46, 46, width - 92, height - 92, 38);
  context.fill();
  context.strokeStyle = "rgba(137, 222, 224, 0.34)";
  context.lineWidth = 4;
  context.stroke();

  if (logo) {
    const logoWidth = 245;
    const logoHeight = (logo.height / logo.width) * logoWidth;
    context.save();
    context.globalAlpha = 0.2;
    for (let x = 95; x < width - 120; x += 330) {
      context.drawImage(logo, x, 76, logoWidth, logoHeight);
    }
    context.restore();
  }
}

function removeLightBackdrop(canvas) {
  const context = canvas.getContext("2d");
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const lightness = Math.min(red, green, blue);
    const neutrality = Math.max(red, green, blue) - lightness;

    if (lightness > 236 && neutrality < 20) {
      data[index + 3] = Math.max(0, Math.round((255 - lightness) * 13));
    }
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
}

function drawFallbackProduct(context, name, description) {
  const source = `${name} ${description}`;
  const mango = /манго/i.test(source);
  const apple = /apple|яблу/i.test(source);
  const citrus = /citrus|цитрус|апельс|лимон|лайм/i.test(source);
  const colors = mango
    ? ["#ffb323", "#f37a21"]
    : apple
      ? ["#d64d3d", "#f4c65c"]
      : citrus
        ? ["#f5a623", "#f7d35c"]
        : ["#65c7bf", "#168697"];
  context.save();
  context.translate(600, 490);
  context.rotate(-0.12);
  for (let index = 0; index < 7; index += 1) {
    context.fillStyle = colors[index % colors.length];
    context.beginPath();
    context.ellipse(index * 30 - 90, index * 12 - 30, 155, 70, 0.08, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "rgba(95, 50, 5, 0.3)";
    context.lineWidth = 3;
    context.stroke();
  }
  context.restore();
}

async function renderCover(product, oldProduct, logo) {
  const width = 1200;
  const height = 1200;
  const canvas = new Canvas(width, height);
  const context = canvas.getContext("2d");
  drawRubberMat(context, width, height, logo);

  const imageUrls = sourceImages(oldProduct || {});
  let renderedSource = false;

  for (const imageUrl of imageUrls) {
    try {
      const response = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) continue;
      const source = await loadImage(Buffer.from(await response.arrayBuffer()));
    const stage = new Canvas(900, 750);
    const stageContext = stage.getContext("2d");
    const scale = Math.min(840 / source.width, 700 / source.height, 1.7);
    const drawWidth = source.width * scale;
    const drawHeight = source.height * scale;
    stageContext.drawImage(
      source,
      (stage.width - drawWidth) / 2,
      (stage.height - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );
    removeLightBackdrop(stage);

    context.save();
    context.shadowColor = "rgba(0, 0, 0, 0.48)";
    context.shadowBlur = 32;
    context.shadowOffsetY = 22;
    context.drawImage(stage, 150, 170, 900, 750);
    context.restore();
    renderedSource = true;
      break;
    } catch {
      // A stale legacy URL should not stop the remaining batch.
    }
  }

  if (!renderedSource) {
    drawFallbackProduct(context, product.name, product.description || "");
  }

  context.fillStyle = "rgba(3, 27, 32, 0.88)";
  context.roundRect(90, 940, 1020, 170, 24);
  context.fill();
  context.strokeStyle = "rgba(135, 222, 223, 0.55)";
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = "#ffffff";
  context.font = '700 48px Arial, sans-serif';
  context.textAlign = "center";
  context.textBaseline = "middle";
  const titleLines = wrapTitle(context, product.name, 900);
  const startY = titleLines.length === 1 ? 1025 : 996;
  titleLines.forEach((line, index) => context.fillText(line, 600, startY + index * 58));

  return canvas.toBuffer("webp", { quality: 0.88 });
}

function uploadToR2(file, key) {
  const result = spawnSync(
    "npx",
    [
      "wrangler",
      "r2",
      "object",
      "put",
      `dream-shop/${key}`,
      "--file",
      file,
      "--content-type",
      "image/webp",
      "--cache-control",
      "public, max-age=31536000, immutable",
      "--remote",
      "--force",
    ],
    { cwd: path.join(root, "apps/worker"), encoding: "utf8" },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "R2 upload failed.");
  }
}

async function registerCover(product, key, sizeBytes) {
  const { data: current, error: readError } = await supabase
    .from("product_media")
    .select("id,object_key")
    .eq("product_id", product.id)
    .eq("sort_order", 0)
    .maybeSingle();

  if (readError) throw readError;
  const values = {
    alt_text: `${product.name} на брендованому килимку DreamShop`,
    height: 1200,
    kind: "main",
    mime_type: "image/webp",
    object_key: key,
    size_bytes: sizeBytes,
    sort_order: 0,
    width: 1200,
  };

  const query = current
    ? supabase.from("product_media").update(values).eq("id", current.id)
    : supabase.from("product_media").insert({ ...values, product_id: product.id });
  const { error } = await query;
  if (error) throw error;
}

const [{ data: products, error: productError }, oldSnapshot] = await Promise.all([
  supabase
    .from("products")
    .select("id,legacy_id,name,slug,description,is_active,product_media(sort_order)")
    .eq("is_active", true)
    .order("sort_order"),
  getDocs(collection(firestore, "products")),
]);

if (productError) throw productError;
const oldProducts = new Map(oldSnapshot.docs.map((document) => [document.id, document.data()]));
const logo = await loadImage(path.join(root, "apps/web/public/logo-name.PNG"));
const selected = (products || [])
  .filter((product) => {
    if (!force && product.product_media?.some((media) => media.sort_order === 0)) return false;
    if (!productFilter) return true;
    return `${product.id} ${product.slug} ${product.name}`.toLowerCase().includes(productFilter);
  })
  .slice(0, limit);

console.log(`${apply ? "APPLY" : "DRY RUN"}: ${selected.length} covers selected.`);
let completed = 0;
let failed = 0;

for (const product of selected) {
  const file = path.join(outputDirectory, `${product.id}.webp`);
  const key = `products/generated/${product.id}.webp`;

  try {
    const buffer = await renderCover(product, oldProducts.get(product.legacy_id), logo);
    fs.writeFileSync(file, buffer);

    if (apply) {
      uploadToR2(file, key);
      await registerCover(product, key, buffer.byteLength);
      if (!keepFiles) fs.unlinkSync(file);
    }

    completed += 1;
    console.log(`OK ${completed}/${selected.length}: ${product.name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL: ${product.name}: ${error instanceof Error ? error.message : error}`);
  }
}

console.log(JSON.stringify({ completed, failed, mode: apply ? "apply" : "dry-run" }));
if (failed) process.exitCode = 1;
