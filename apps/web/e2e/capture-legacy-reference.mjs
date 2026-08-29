import { spawn } from "node:child_process";
import { resolve } from "node:path";

const baseURL = "http://127.0.0.1:3004";
const repositoryRoot = resolve(process.cwd(), "../..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
let server;

function stopServer() {
  if (!server || server.exitCode !== null) return;

  if (process.platform === "win32") {
    server.kill("SIGTERM");
  } else {
    process.kill(-server.pid, "SIGTERM");
  }
}

async function waitForServer() {
  const deadline = Date.now() + 120_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {
      // The development server is still starting.
    }

    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }

  throw new Error("Legacy preview did not start within 120 seconds.");
}

async function run() {
  server = spawn(npm, ["run", "start:legacy-preview"], {
    cwd: repositoryRoot,
    detached: process.platform !== "win32",
    env: { ...process.env },
    stdio: "inherit",
  });

  try {
    await waitForServer();

    const playwright = spawn(
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["playwright", "test", "e2e/legacy-reference.capture.spec.ts", "--project=chromium"],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          CAPTURE_LEGACY_REFERENCE: "1",
          PLAYWRIGHT_BASE_URL: baseURL,
        },
        stdio: "inherit",
      },
    );

    const exitCode = await new Promise((resolveExit) => {
      playwright.once("exit", (code) => resolveExit(code ?? 1));
    });
    process.exitCode = exitCode;
  } finally {
    stopServer();
  }
}

process.once("SIGINT", () => {
  stopServer();
  process.exit(130);
});
process.once("SIGTERM", () => {
  stopServer();
  process.exit(143);
});

await run();
