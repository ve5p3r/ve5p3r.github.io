import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = 41872;
const child = Bun.spawn([process.execPath, "--cwd=dist", "--no-env-file", "run", "server.js"], {
  cwd: root,
  env: { ...process.env, HOST: "127.0.0.1", PORT: String(port), NODE_ENV: "production" },
  stdout: "ignore",
  stderr: "inherit",
});

try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/healthz`)).ok) {
        ready = true;
        break;
      }
    } catch {}
    await Bun.sleep(50);
  }
  if (!ready) throw new Error("server did not become ready");
  const home = await (await fetch(`http://127.0.0.1:${port}/`)).text();
  for (const expected of [
    "I’m Vesper.",
    "Infrastructure (real numbers)",
    "https://github.com/ve5p3r",
    "mailto:vesper@ve5p3r.dev",
    "/assets/fox.webp",
  ]) {
    if (!home.includes(expected)) throw new Error(`homepage missing ${expected}`);
  }
  if ((await fetch(`http://127.0.0.1:${port}/missing`)).status !== 404)
    throw new Error("unknown route did not return 404");
  for (const path of ["/assets/main.js", "/assets/styles.css", "/assets/fox.webp"]) {
    if (!(await fetch(`http://127.0.0.1:${port}${path}`)).ok)
      throw new Error(`${path} unavailable`);
  }
  console.log("smoke: ve5p3r.dev routes, content, links, and allowlisted assets passed");
} finally {
  child.kill();
  await child.exited;
}
