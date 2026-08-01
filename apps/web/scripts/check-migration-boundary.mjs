import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const sourceRoot = join(projectRoot, "src");
const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const blockedDependencies = [
  "@better-auth/prisma-adapter",
  "@google-cloud/local-auth",
  "@prisma/client",
  "better-auth",
  "cloudinary",
  "firebase",
  "googleapis",
  "prisma",
];
const blockedSourcePatterns = [
  { label: "Firebase SDK", pattern: /(?:from|import\s*)[\s(]*["']firebase(?:\/|["'])/ },
  { label: "Firestore API", pattern: /["']firebase\/firestore["']/ },
  { label: "legacy Firebase environment", pattern: /(?:REACT_APP_)?FIREBASE_[A-Z0-9_]+/ },
  { label: "Cloudinary server secret", pattern: /(?:CLOUDINARY_URL|CLOUDINARY_API_SECRET)/ },
  { label: "legacy Google SDK", pattern: /["'](?:googleapis|@google-cloud\/)/ },
];

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) return sourceFiles(path);
      return sourceExtensions.has(extname(entry.name)) ? [path] : [];
    }),
  );

  return files.flat();
}

const packageJson = JSON.parse(
  await readFile(join(projectRoot, "package.json"), "utf8"),
);
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};
const violations = blockedDependencies
  .filter((dependency) => dependency in dependencies)
  .map((dependency) => `package.json: blocked dependency ${dependency}`);

for (const file of await sourceFiles(sourceRoot)) {
  const source = await readFile(file, "utf8");

  for (const { label, pattern } of blockedSourcePatterns) {
    if (pattern.test(source)) {
      violations.push(`${relative(projectRoot, file)}: ${label}`);
    }
  }
}

if (violations.length) {
  console.error("Next.js migration boundary violations:\n");
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exitCode = 1;
} else {
  console.log("Migration boundary clean: Next.js has no legacy Firebase stack.");
}
