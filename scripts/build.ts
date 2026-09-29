import { cp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = `${root}/dist`;
await rm(dist, { force: true, recursive: true });

for (const [entrypoint, outdir, target] of [
  [`${root}/web/main.tsx`, `${dist}/assets`, "browser"],
  [`${root}/web/styles.css`, `${dist}/assets`, "browser"],
  [`${root}/src/server.ts`, dist, "bun"],
] as const) {
  const result = await Bun.build({
    entrypoints: [entrypoint],
    outdir,
    target,
    minify: true,
    naming: "[name].[ext]",
  });
  if (!result.success) {
    for (const log of result.logs) console.error(log);
    process.exit(1);
  }
}
await cp(`${root}/public/fox.webp`, `${dist}/assets/fox.webp`);
