import { spawn } from "node:child_process";

const executable = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(
  executable,
  [
    "playwright",
    "test",
    "e2e/design-reference.capture.spec.ts",
    "--project=chromium",
  ],
  {
    env: { ...process.env, CAPTURE_DESIGN_REFERENCE: "1" },
    stdio: "inherit",
  },
);

child.once("exit", (code) => process.exit(code ?? 1));
