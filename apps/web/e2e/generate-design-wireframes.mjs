import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const outputRoot = resolve(process.cwd(), "../../docs/design-reference/wireframes");
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const screens = {
  home: ["Header / primary navigation", "Brand hero / catalogue CTA", "Category entry points", "Popular product grid"],
  catalog: ["Header / cart state", "Title and result count", "Search / category / sort filters", "Responsive product grid"],
  product: ["Breadcrumb / return path", "Product media and fallback", "Name / price / availability", "Quantity / cart / wishlist actions"],
  cart: ["Checkout progress", "Cart title / item count", "Items or explicit empty state", "Totals / checkout action"],
  checkout: ["Checkout progress", "Recipient fields", "Delivery and payment fields", "Order summary / disabled + pending submit"],
  account: ["Store header / account status", "Profile and quick actions", "Saved address / notifications", "Order history and states"],
  "admin-dashboard": ["Admin header / navigation", "Operational metrics", "Recent orders / inventory attention", "Integration health and retry states"],
  "admin-product-editor": ["Admin header / catalogue return", "Three-slot media manager", "Product fields and validation", "Save / archive feedback"],
  "admin-orders": ["Admin header / navigation", "Search / period / status filters", "Order rows and status", "Export / pagination / empty state"],
};

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function renderWireframe(screen, labels, viewport) {
  const { width, height } = viewport;
  const gutter = width <= 390 ? 16 : width <= 768 ? 20 : 24;
  const headerHeight = width <= 390 ? 64 : 76;
  const contentWidth = width - gutter * 2;
  const gap = width <= 390 ? 12 : 16;
  const bodyTop = headerHeight + gutter;
  const availableHeight = height - bodyTop - gutter;
  const blockHeight = Math.max(112, Math.floor((availableHeight - gap * 3) / 4));
  const titleSize = width <= 390 ? 13 : 16;
  const noteSize = width <= 390 ? 10 : 12;
  const blocks = labels.map((label, index) => {
    const y = bodyTop + index * (blockHeight + gap);
    const numberX = gutter + 18;
    const numberY = y + 25;
    const labelX = gutter + 44;
    const labelY = y + 29;

    return `
      <rect x="${gutter}" y="${y}" width="${contentWidth}" height="${blockHeight}" rx="12" fill="#f8fbfb" stroke="#50868b" stroke-width="2" stroke-dasharray="7 5"/>
      <circle cx="${numberX}" cy="${numberY}" r="12" fill="#145f68"/>
      <text x="${numberX}" y="${numberY + 4}" text-anchor="middle" class="number">${index + 1}</text>
      <text x="${labelX}" y="${labelY}" class="label">${escapeXml(label)}</text>
      <line x1="${gutter + 18}" y1="${y + 48}" x2="${gutter + contentWidth - 18}" y2="${y + 48}" stroke="#b9d1d3"/>
      <rect x="${gutter + 18}" y="${y + 64}" width="${Math.max(88, Math.floor(contentWidth * 0.28))}" height="14" rx="7" fill="#dceff0"/>
      <rect x="${gutter + 18}" y="${y + 88}" width="${Math.max(132, Math.floor(contentWidth * 0.58))}" height="10" rx="5" fill="#e9dddd"/>
    `.trim();
  }).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
    <title id="title">${escapeXml(screen)} wireframe at ${width} by ${height}</title>
    <desc id="description">Annotated structural wireframe for DreamShop visual parity review.</desc>
    <style>
      .title { fill: #143f45; font: 700 ${titleSize}px Inter, Arial, sans-serif; }
      .meta { fill: #315d62; font: 500 ${noteSize}px Inter, Arial, sans-serif; }
      .label { fill: #143f45; font: 650 ${noteSize}px Inter, Arial, sans-serif; }
      .number { fill: white; font: 700 ${noteSize}px Inter, Arial, sans-serif; }
    </style>
    <rect width="${width}" height="${height}" fill="#edf7f6"/>
    <rect width="${width}" height="${headerHeight}" fill="#c8e9eb"/>
    <text x="${gutter}" y="${Math.floor(headerHeight * 0.43)}" class="title">DreamShop · ${escapeXml(screen)}</text>
    <text x="${gutter}" y="${Math.floor(headerHeight * 0.72)}" class="meta">${width}×${height} · numbered annotations map to the comparison register</text>
    ${blocks}
  </svg>`;
}

for (const [screen, labels] of Object.entries(screens)) {
  for (const viewport of viewports) {
    const outputPath = resolve(outputRoot, screen, `${viewport.name}-${viewport.width}x${viewport.height}.svg`);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, renderWireframe(screen, labels, viewport), "utf8");
  }
}

console.log(`Generated ${Object.keys(screens).length * viewports.length} annotated wireframes.`);
