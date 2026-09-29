import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
for (const script of ["format:check", "lint", "typecheck", "build"]) {
  const child = Bun.spawn([process.execPath, "--no-env-file", "run", script], {
    cwd: root,
    env: { ...process.env, NODE_ENV: script === "build" ? "production" : "development" },
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  const exitCode = await child.exited;
  if (exitCode !== 0) process.exit(exitCode);
}
