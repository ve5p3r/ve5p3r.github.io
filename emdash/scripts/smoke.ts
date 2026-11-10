import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { Database } from "bun:sqlite";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Use a fresh temporary database, uploads and sessions for every run.
const root = new URL("..", import.meta.url);
const temporary = await mkdtemp(join(tmpdir(), "vesper-emdash-smoke-"));
const database = join(temporary, "data.db");
const port = Number(process.env.SMOKE_PORT || 41889);
const origin = `http://127.0.0.1:${port}`;
let server: ReturnType<typeof Bun.spawn> | undefined;
try {
  const seed = Bun.spawn(
    [
      "node",
      new URL("node_modules/emdash/dist/cli/index.mjs", root).pathname,
      "seed",
      new URL("seed/seed.json", root).pathname,
      "--database",
      database,
      "--uploads-dir",
      join(temporary, "uploads"),
      "--on-conflict",
      "skip",
    ],
    { stdout: "ignore", stderr: "inherit" },
  );
  assert.equal(await seed.exited, 0, "Temporary content seed");
  server = Bun.spawn(
    ["node", new URL("dist/server/entry.mjs", root).pathname],
    {
      cwd: temporary,
      env: {
        ...process.env,
        HOST: "127.0.0.1",
        PORT: String(port),
        NODE_ENV: "production",
      },
      stdout: "ignore",
      stderr: "inherit",
    },
  );
  let ready = false;
  for (let i = 0; i < 80; i++) {
    if (server.exitCode !== null)
      throw new Error("Owned preview exited before readiness");
    try {
      ready = (await fetch(`${origin}/healthz`)).ok;
    } catch {}
    if (ready) break;
    await Bun.sleep(100);
  }
  assert.ok(ready, "health endpoint ready");
  const home = await (await fetch(origin)).text();
  for (const text of [
    "Kept receipts.",
    "#work",
    "#notes",
    "#archive",
    'id="story"',
    'id="infra"',
    'id="timeline"',
    'id="ecosystem"',
    'id="projects"',
    "#contact",
    "https://github.com/ve5p3r",
    "mailto:vesper@ve5p3r.dev",
    "/assets/vesper-fox.svg",
    "/assets/vesper-wordmark.svg",
  ])
    assert.ok(home.includes(text), text);
  assert.equal([...home.matchAll(/<title>/g)].length, 1);
  assert.ok(home.includes("https://ve5p3r.dev/"));
  assert.ok(
    home.includes("https://ve5p3r.dev/assets/vesper-fox.png"),
    "social image uses the verified current sigil",
  );
  assert.ok(
    home.includes('type="image/svg+xml" href="/assets/vesper-fox.svg"'),
    "favicon uses the current sigil",
  );
  assert.ok(
    !home.includes("/assets/fox.webp"),
    "older portrait is absent from the current page",
  );
  for (const [path, expected] of [
    [
      "vesper-fox.svg",
      "2ea3bb28fe703a4c052587d4ae6866ff9487a4203dbbb348580dcbcc1d5a8fd5",
    ],
    [
      "vesper-wordmark.svg",
      "46df6785c80ae92bad615ed0909610f0da583f06b9506044c460682fcebd4157",
    ],
    [
      "vesper-fox.png",
      "61cde1593e32eeea0f02d48f49e659e865fbf00f75b4ba17ea1a905fb66e877f",
    ],
  ]) {
    const asset = await fetch(`${origin}/assets/${path}`);
    assert.equal(asset.status, 200, path);
    assert.equal(
      createHash("sha256")
        .update(Buffer.from(await asset.arrayBuffer()))
        .digest("hex"),
      expected,
      path,
    );
  }
  for (const path of [
    "/assets/styles.css",
    "/assets/fox.webp",
    "/_emdash/admin/",
  ])
    assert.equal((await fetch(origin + path)).status, 200, path);
  console.log("✓ Verified Vesper sigil, wordmark, favicon and social image");
  const redirect = await fetch(origin + "/admin", { redirect: "manual" });
  assert.equal(redirect.status, 302);
  assert.equal(redirect.headers.get("location"), "/_emdash/admin/");
  for (const path of [
    "/missing-path",
    "/data.db",
    "/.env",
    "/seed/seed.json",
    "/src/components/App.tsx",
  ])
    assert.equal((await fetch(origin + path)).status, 404, path);
  console.log(
    "✓ Existing public sections, links, assets, metadata, admin, health and private-file isolation",
  );
  const db = new Database(database);
  const row = db
    .query(
      "SELECT hero_headline, hero_lede, contact_email, status FROM ec_homepage WHERE id = 'home-config'",
    )
    .get() as {
    hero_headline: string;
    hero_lede: string;
    contact_email: string;
    status: string;
  };
  assert.ok(row);
  try {
    db.query(
      "UPDATE ec_homepage SET hero_headline=?, hero_lede=?, contact_email=? WHERE id='home-config'",
    ).run(
      "Synthetic CMS title",
      "Synthetic CMS introduction",
      "preview@example.invalid",
    );
    const changed = await (await fetch(origin)).text();
    for (const text of [
      "Synthetic CMS title",
      "Synthetic CMS introduction",
      "mailto:preview@example.invalid",
    ])
      assert.ok(changed.includes(text), text);
    db.query(
      "UPDATE ec_homepage SET status='draft' WHERE id='home-config'",
    ).run();
    const draft = await (await fetch(origin)).text();
    assert.ok(
      !draft.includes("Synthetic CMS title"),
      "Unpublished draft is absent",
    );
    assert.ok(
      draft.includes("Kept receipts."),
      "Current journal copy is the fallback",
    );
    console.log("✓ Live CMS edits and unpublished-content fallback");
  } finally {
    db.query(
      "UPDATE ec_homepage SET hero_headline=?, hero_lede=?, contact_email=?, status=? WHERE id='home-config'",
    ).run(row.hero_headline, row.hero_lede, row.contact_email, row.status);
    db.close();
  }
  assert.ok((await (await fetch(origin)).text()).includes("Kept receipts."));
  console.log("✓ Seed content restored; Vesper EmDash smoke passed");
} finally {
  if (server) {
    server.kill();
    await server.exited;
  }
  await rm(temporary, { recursive: true, force: true });
}
