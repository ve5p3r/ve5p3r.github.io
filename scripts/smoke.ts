import { createHash } from "node:crypto";
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
  // Operator attribution (November 14, 2026) must be served above the historical notes.
  const storyAt = home.indexOf('<section id="story">');
  const contactAt = home.indexOf('<section id="contact">');
  if (storyAt < 0 || contactAt < storyAt) throw new Error("historical sections missing");
  let previous = home.indexOf('class="hero"');
  for (const expected of [
    'id="operator"',
    "Operator’s note",
    "https://jdot.dev",
    "mailto:connect@jdot.dev",
    "References available on request.",
    'id="today"',
    "Dated November 14, 2026",
    "Retired since the January–March notes",
    'id="incidents"',
    "January 29, 2026 · summary",
    "February 23, 2026 · summary",
    "have not been reverified as current facts",
  ]) {
    const at = home.indexOf(expected);
    if (at <= previous || at > storyAt)
      throw new Error(`missing or out of order above the historical notes: ${expected}`);
    previous = at;
  }
  if (!/<title>[^<]*Jack Field[^<]*<\/title>/.test(home))
    throw new Error("title does not name the operator");
  if (!home.slice(0, storyAt).includes("Jack Field"))
    throw new Error("operator is not named above the historical notes");
  // The January–March 2026 notes stay verbatim: same normalisation and hash as
  // emdash/scripts/verify-copy.ts, pinned to web/main.tsx at commit d2f0b06.
  const archiveText = home
    .slice(storyAt, contactAt)
    .replace(/<[^>]*>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  const archiveHash = createHash("sha256").update(archiveText).digest("hex");
  if (archiveHash !== "34a4a7b8b09ff25c62d79e32480255622ffbfba6afab7a95fec96229933f0741")
    throw new Error(`historical notes changed (sha256 ${archiveHash})`);
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
