import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const npm = "npm";
const services = [
  { name: "backend", directory: "backend" },
  { name: "frontend", directory: "frontend" },
];

const children = services.map(({ name, directory }) => {
  const child = spawn(npm, ["run", "dev"], {
    cwd: join(projectRoot, directory),
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  child.on("error", (error) => {
    console.error(`Failed to start ${name}: ${error.message}`);
    stopAll(1);
  });

  return child;
});

let stopping = false;
function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  children.forEach((child) => {
    if (!child.killed) child.kill("SIGTERM");
  });
  process.exit(exitCode);
}

children.forEach((child, index) => {
  child.on("exit", (code) => {
    if (!stopping) {
      console.error(`${services[index].name} stopped unexpectedly.`);
      stopAll(code ?? 1);
    }
  });
});

process.on("SIGINT", () => stopAll());
process.on("SIGTERM", () => stopAll());
