import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const requiredFiles = [
  "apps/web/vercel.json",
  "apps/worker/wrangler.jsonc",
  "firebase.json",
  "vercel.json",
];

const contents = await Promise.all(
  requiredFiles.map(async (path) => [
    path,
    await readFile(resolve(root, path), "utf8"),
  ]),
);
const config = Object.fromEntries(contents);
const violations = [];

if (!config["apps/web/vercel.json"].includes('"framework": "nextjs"')) {
  violations.push("apps/web/vercel.json must remain the Next.js deployment entrypoint.");
}

if (!config["apps/worker/wrangler.jsonc"].includes('"main": "src/index.ts"')) {
  violations.push("apps/worker/wrangler.jsonc must retain its Worker entrypoint.");
}

if (!config["firebase.json"].includes('"source": "functions"')) {
  violations.push("firebase.json must continue to identify the legacy Functions rollback path.");
}

if (!config["vercel.json"].includes('"@vercel/static-build"')) {
  violations.push("vercel.json must remain identifiable as the legacy CRA deployment path.");
}

if (violations.length) {
  console.error("Deployment boundary violations:\n");
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exitCode = 1;
} else {
  console.log("Deployment boundaries are explicit: Next.js, Worker, Firebase rollback, legacy Vercel.");
}
