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
  // Operator attribution (November 14, 2026) must be served above the historical notes,
  // in this order. Each item is searched for after the previous one.
  const historyAt = home.indexOf('id="history"');
  const storyAt = home.indexOf('<section id="story">');
  const contactAt = home.indexOf('<section id="contact">');
  if (historyAt < 0 || storyAt < historyAt || contactAt < storyAt)
    throw new Error("historical sections missing or out of order");
  let previous = home.indexOf('class="hero"');
  for (const expected of [
    "An agent operated by",
    "Jack Field",
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
    'id="source"',
    'id="history"',
    "have not been reverified as current facts",
    'class="history-disclosure"',
  ]) {
    const at = previous < 0 ? -1 : home.indexOf(expected, previous + 1);
    if (at < 0 || at > storyAt)
      throw new Error(`missing or out of order above the historical notes: ${expected}`);
    previous = at;
  }
  if (!/<title>[^<]*Jack Field[^<]*<\/title>/.test(home))
    throw new Error("title does not name the operator");
  // The old notes are collapsed by default and closed again before the contact section.
  if (home.includes('class="history-disclosure" open'))
    throw new Error("historical notes are not collapsed by default");
  const closeAt = home.indexOf("</details>", storyAt);
  if (closeAt < 0 || closeAt > contactAt)
    throw new Error("historical notes are not fully inside the disclosure");
  // Nothing in the nav may jump into the collapsed notes past their qualification.
  const nav = home.slice(home.indexOf("<nav"), home.indexOf("</nav>"));
  for (const id of ["story", "infra", "projects", "timeline", "ecosystem"])
    if (nav.includes(`href="#${id}"`)) throw new Error(`nav links into the old notes: #${id}`);
  for (const id of ["operator", "today", "incidents", "source", "history", "contact"])
    if (!nav.includes(`href="#${id}"`)) throw new Error(`nav is missing #${id}`);
  // The contact section also gives a route to the human.
  const contact = home.slice(contactAt);
  for (const expected of ["https://jdot.dev", "mailto:connect@jdot.dev"])
    if (!contact.includes(`href="${expected}"`))
      throw new Error(`contact section is missing ${expected}`);

  // HISTORY PIN (1 of 2). The January–March 2026 notes stay verbatim: same normalisation
  // and hash as emdash/scripts/verify-copy.ts, which pins it independently, and the vendored
  // baseline file is byte-checked here as well. Changing these constants together with the
  // ones in verify-copy.ts is a deliberate history refresh and needs the owner's review.
  const ARCHIVE_TEXT_SHA256 = "34a4a7b8b09ff25c62d79e32480255622ffbfba6afab7a95fec96229933f0741";
  const BASELINE_SHA256 = "2b3079b6222b3aa72dcbd28b944b53168e69a3ffe021128bd9a72e99a23beb17";
  const sha256 = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");
  const archiveText = home
    .slice(storyAt, contactAt)
    .replace(/<[^>]*>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  if (sha256(archiveText) !== ARCHIVE_TEXT_SHA256)
    throw new Error(`historical notes changed (sha256 ${sha256(archiveText)})`);
  const baseline = await Bun.file(`${root}/emdash/baseline/web-main.d2f0b06.tsx`).bytes();
  if (sha256(baseline) !== BASELINE_SHA256)
    throw new Error("pinned historical baseline file changed");

  // The social card must be a real 1200x630 PNG at the URL the meta tags name.
  if (!home.includes('property="og:image" content="https://ve5p3r.dev/assets/og-image.png"'))
    throw new Error("og:image does not point at the served social card");
  if (!home.includes('name="twitter:image" content="https://ve5p3r.dev/assets/og-image.png"'))
    throw new Error("twitter:image does not point at the served social card");
  const card = await fetch(`http://127.0.0.1:${port}/assets/og-image.png`);
  if (card.status !== 200 || card.headers.get("content-type") !== "image/png")
    throw new Error("social card is not served as image/png");
  const png = new DataView(await card.arrayBuffer());
  if (png.getUint32(0) !== 0x89504e47 || png.getUint32(16) !== 1200 || png.getUint32(20) !== 630)
    throw new Error("social card is not a 1200x630 PNG");
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
