import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { App } from "../src/components/App";

// HISTORY PIN (2 of 2; ../../scripts/smoke.ts pins the same two hashes independently and
// runs in CI, as does this script). Changing the constants in both files in one change is a
// deliberate history refresh and needs the owner's review.
// The historical baseline is PINNED. It is a byte-for-byte copy of web/main.tsx at commit
// d2f0b06 (the page as published before the November 14, 2026 operator attribution), vendored
// so "history" cannot drift when the live page changes. Both the file bytes and the rendered
// archive text are hash-locked below; refreshing either is a deliberate, reviewed edit.
const BASELINE_FILE = "../baseline/web-main.d2f0b06.tsx";
const BASELINE_SHA256 =
  "2b3079b6222b3aa72dcbd28b944b53168e69a3ffe021128bd9a72e99a23beb17";
const ARCHIVE_TEXT_SHA256 =
  "34a4a7b8b09ff25c62d79e32480255622ffbfba6afab7a95fec96229933f0741";
const sourceRoot = resolve(
  process.argv[2] || new URL("../..", import.meta.url).pathname,
);
const referencePath = new URL(BASELINE_FILE, import.meta.url).pathname;
const reference = await import(pathToFileURL(referencePath).href);
const original = renderToStaticMarkup(createElement(reference.App));
// The page CI actually publishes. It may grow new sections above the archive, but its
// archive and contact destinations are held to the same pinned baseline as this journal.
const livePath = resolve(sourceRoot, "web/main.tsx");
const live = renderToStaticMarkup(
  createElement((await import(pathToFileURL(livePath).href)).App),
);
const candidate = renderToStaticMarkup(createElement(App));
const seed = JSON.parse(
  await readFile(new URL("../seed/seed.json", import.meta.url), "utf8"),
);
const seeded = renderToStaticMarkup(
  createElement(App, { content: seed.content.homepage[0].data }),
);
const decode = (value: string) =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#([0-9]+);/g, (_, decimal) =>
      String.fromCodePoint(Number(decimal)),
    )
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
// Preserve the earlier public notes as an explicit historical archive.
const text = (html: string) =>
  decode(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
    .replace("🦊 Vesper ·", "Vesper ·");
const links = (html: string) =>
  Array.from(html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>/g), (match) =>
    decode(match[1]),
  );
const sections = (html: string) =>
  Array.from(
    html.matchAll(/<section\b[^>]*\bid="([^"]*)"[^>]*>/g),
    (match) => match[1],
  );
const images = (html: string) =>
  Array.from(html.matchAll(/<img\b[^>]*>/g), (match) => match[0]);
const archiveText = (html: string) =>
  text(
    html.slice(
      html.indexOf('<section id="story">'),
      html.indexOf('<section id="contact">'),
    ),
  );
const contactLinks = (html: string) =>
  links(html.slice(html.indexOf('<section id="contact">'))).filter((href) =>
    /^(https?:|mailto:)/.test(href),
  );
const sha = (bytes: Uint8Array | string) =>
  createHash("sha256").update(bytes).digest("hex");
assert.equal(
  sha(await readFile(referencePath)),
  BASELINE_SHA256,
  "Pinned historical baseline file is byte-identical to web/main.tsx@d2f0b06",
);
assert.equal(
  sha(archiveText(original)),
  ARCHIVE_TEXT_SHA256,
  "Pinned historical archive text hash",
);
assert.equal(
  archiveText(live),
  archiveText(original),
  "Published page keeps the earlier field notes verbatim, in source order",
);
// Approved additions to the contact region. The original destinations must stay, unchanged
// and in their original order; anything beyond them must be listed here, exactly once each,
// after the originals. Any other new link in the contact section or footer fails.
// 2026-11-14: the operator asked for a route to him in the contact section (owner-approved).
const APPROVED_CONTACT_ADDITIONS = [
  "https://jdot.dev",
  "mailto:connect@jdot.dev",
];
const assertContactLinks = (name: string, page: string) =>
  assert.deepEqual(
    contactLinks(page),
    [...contactLinks(original), ...APPROVED_CONTACT_ADDITIONS],
    `${name}: original contact destinations preserved, plus only the approved additions`,
  );
assertContactLinks("published page", live);
assert.equal(
  archiveText(candidate),
  archiveText(original),
  "Earlier field notes remain verbatim, in source order",
);
assert.equal(
  text(seeded),
  text(candidate),
  "Published starter copy and fallback agree",
);
assertContactLinks("journal", candidate);
assert.deepEqual(
  links(seeded),
  links(candidate),
  "Published starter links and fallback agree",
);
for (const id of sections(original))
  assert.ok(
    sections(candidate).includes(id),
    `Retained archive/contact section: ${id}`,
  );
for (const id of ["work", "notes", "archive"])
  assert.ok(sections(candidate).includes(id), `New journal section: ${id}`);
assert.ok(
  candidate.includes('class="history-disclosure"'),
  "Historical field notes have a native disclosure",
);
assert.ok(
  !candidate.includes('class="history-disclosure" open'),
  "Historical field notes are collapsed by default",
);
assert.ok(
  candidate.indexOf("have not been reverified as current facts") <
    candidate.indexOf('<section id="story">'),
  "Historical claims are qualified before the archive",
);
for (const href of [
  "https://github.com/ve5p3r/nopipe",
  "https://github.com/ve5p3r/human-oracle",
  "https://github.com/ve5p3r/hoot-contracts",
])
  assert.ok(links(candidate).includes(href), `Public artifact source: ${href}`);
assert.equal(
  images(candidate).length,
  4,
  "Header, hero and footer use the verified brand assets",
);
assert.ok(
  !candidate.includes("🦊"),
  "The decorative footer emoji is replaced by the sigil",
);
assert.ok(
  candidate.includes('alt="Vesper fox sigil"'),
  "Current sigil has an accessible name",
);
assert.ok(
  !candidate.includes("/assets/fox.webp"),
  "The older portrait is no longer rendered",
);
// November 14, 2026: operator attribution, owner-requested. These checks exist so the
// operator's note, the dated current record and the incident summaries cannot be removed,
// moved below the archive, or allowed to diverge between the two trees without a failure.
const sectionStart = (html: string, id: string) =>
  html.search(new RegExp(`<section\\b[^>]*\\bid="${id}"`));
const sectionHtml = (html: string, id: string) => {
  const start = sectionStart(html, id);
  assert.ok(start >= 0, `Section present: ${id}`);
  return html.slice(start, html.indexOf("</section>", start));
};
const claims = (html: string) =>
  Array.from(
    html.matchAll(/<p class="[^"]*\bartifact-claim\b[^"]*">(.*?)<\/p>/gs),
    (match) => text(match[1]),
  );
for (const [name, page, archiveMarker, codeId] of [
  ["journal", candidate, 'id="archive"', "work"],
  ["published page", live, 'id="history"', "source"],
] as const) {
  // Both trees keep the old notes in a closed disclosure, qualified before the notes start.
  assert.ok(
    page.includes('class="history-disclosure"') &&
      !page.includes('class="history-disclosure" open'),
    `${name}: historical notes are collapsed by default`,
  );
  const storyAt = page.indexOf('<section id="story">');
  const disclosureAt = page.indexOf('class="history-disclosure"');
  assert.ok(
    disclosureAt < storyAt &&
      page.indexOf("</details>", storyAt) < page.indexOf('<section id="contact">') &&
      page.indexOf("</details>", page.indexOf('<section id="ecosystem">')) > 0,
    `${name}: historical notes sit wholly inside the disclosure`,
  );
  assert.ok(
    page.indexOf("have not been reverified as current facts") < storyAt &&
      page.indexOf("have not been reverified as current facts") > 0,
    `${name}: historical claims are qualified before the notes`,
  );
  const navHtml = page.slice(page.indexOf("<nav"), page.indexOf("</nav>"));
  for (const id of ["story", "infra", "projects", "timeline", "ecosystem"])
    assert.ok(
      !navHtml.includes(`href="#${id}"`),
      `${name}: nav does not jump past the qualification into #${id}`,
    );
  for (const id of ["operator", "today", "incidents", codeId, "contact"])
    assert.ok(navHtml.includes(`href="#${id}"`), `${name}: nav links #${id}`);
  assert.ok(
    Array.from(navHtml.matchAll(/<a\b/g)).length <= 6,
    `${name}: nav has at most six items`,
  );
  const heroAt = page.indexOf('class="hero"');
  const strip = page.indexOf('class="operator-strip"');
  assert.ok(
    strip > heroAt &&
      strip < sectionStart(page, "operator") &&
      text(page.slice(strip, sectionStart(page, "operator"))).includes(
        "An agent operated by Jack Field — operator’s note below",
      ),
    `${name}: the hero names the operator`,
  );
  assert.ok(
    sectionStart(page, codeId) > sectionStart(page, "incidents") &&
      sectionStart(page, codeId) < page.indexOf(archiveMarker),
    `${name}: public source cards sit above the archive`,
  );
  for (const href of [
    "https://github.com/ve5p3r/nopipe/blob/7114e09f2bafb2d45e6f8a3ac9a7346a5e1f702c/cluster/src/rpc_server.rs",
    "https://github.com/ve5p3r/human-oracle/blob/4667f4bbec439fda8898765f22c6b6de0427c3d5/docs/WHITEPAPER.md",
  ])
    assert.ok(links(page).includes(href), `${name}: pinned source receipt ${href}`);
  const archiveAt = page.indexOf(archiveMarker);
  assert.ok(archiveAt > 0, `${name}: archive marker`);
  let previous = page.indexOf('class="hero"');
  assert.ok(previous >= 0, `${name}: hero`);
  for (const id of ["operator", "today", "incidents"]) {
    const at = sectionStart(page, id);
    assert.ok(at > previous, `${name}: #${id} follows the hero, in order`);
    assert.ok(at < archiveAt, `${name}: #${id} sits above the archive`);
    previous = at;
  }
  assert.equal(
    sections(page)[0],
    "operator",
    `${name}: the operator's note is the first section after the hero`,
  );
  const operator = sectionHtml(page, "operator");
  for (const expected of [
    "Operator’s note",
    "Jack Field",
    "South Charleston, West Virginia",
    "References available on request.",
  ])
    assert.ok(text(operator).includes(expected), `${name}: note says ${expected}`);
  assert.deepEqual(
    links(operator),
    ["https://jdot.dev", "mailto:connect@jdot.dev"],
    `${name}: operator links`,
  );
  assert.equal(images(operator).length, 0, `${name}: no operator image`);
  const today = text(sectionHtml(page, "today"));
  for (const expected of [
    "Dated November 14, 2026",
    "What runs today",
    "LiteLLM",
    "Authentik",
    "Plane",
    "ZeroClaw",
    "Self-hosted mail",
  ])
    assert.ok(today.includes(expected), `${name}: today says ${expected}`);
  const incidents = text(sectionHtml(page, "incidents"));
  for (const expected of [
    "January 29, 2026 · summary",
    "February 23, 2026 · summary",
    "the full post-mortems are not published",
  ])
    assert.ok(incidents.includes(expected), `${name}: incidents say ${expected}`);
  assert.equal(
    links(sectionHtml(page, "incidents")).length,
    0,
    `${name}: incident summaries link to no unpublished document`,
  );
  // New copy must not name the third party that only the verbatim archive mentions.
  assert.ok(
    !text(page.slice(0, archiveAt)).includes("Lyft"),
    `${name}: no third-party brand above the archive`,
  );
  assert.ok(
    text(page.slice(0, archiveAt)).includes("Jack Field"),
    `${name}: operator named above the archive`,
  );
}
for (const id of ["operator", "today", "incidents"])
  assert.equal(
    text(sectionHtml(candidate, id)),
    text(sectionHtml(live, id)),
    `Journal and published page agree on #${id}`,
  );
assert.ok(claims(live).length >= 5, "Public source cards carry their claims");
assert.deepEqual(
  claims(candidate),
  claims(live),
  "Journal and published page agree on the NoPipe and HumanOracle claims",
);
// October 9: authorized field-journal iteration. Original artwork stays byte-identical;
// earlier notes remain in the historical archive, while new copy cites inspected source.
const assetPairs = [["public/fox.webp", "public/assets/fox.webp"]];
for (const [oldPath, newPath] of assetPairs) {
  assert.equal(
    sha(await readFile(new URL(`../${newPath}`, import.meta.url))),
    sha(await readFile(resolve(sourceRoot, oldPath))),
    newPath,
  );
}
for (const [name, expected] of [
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
])
  assert.equal(
    sha(await readFile(new URL(`../public/assets/${name}`, import.meta.url))),
    expected,
    name,
  );
console.log(
  JSON.stringify(
    {
      result: "passed",
      baseline: referencePath,
      baseline_sha256: sha(await readFile(referencePath)),
      published_source: livePath,
      published_source_sha256: sha(await readFile(livePath)),
      historical_archive_text_sha256: sha(archiveText(original)),
      candidate_text_sha256: sha(text(candidate)),
      section_ids: sections(candidate),
      link_count: links(candidate).length,
      checks: [
        "pinned baseline bytes and archive text hash",
        "historical archive parity (journal and published page)",
        "operator note, dated record and incident summaries above the archive",
        "journal/published-page agreement on new sections and source claims",
        "collapsed notes, nav and hero attribution in both trees",
        "contact destinations plus approved additions only",
        "seed/fallback parity",
        "retained sections",
        "source links",
        "historical qualification",
        "verified brand assets",
        "sigil alternative text",
        "legacy fox bytes preserved",
      ],
      approved_addition:
        "November 14, 2026: owner-requested operator attribution (Jack Field named), dated current record and incident summaries, all above the archive.",
      approved_difference:
        "October 9 expressive design iteration: new source-backed work journal, candid introduction and dated corpus context. Earlier notes are explicitly historical; public contact destinations and exact artwork are preserved.",
      scope:
        "Archive/seed/link/artwork integrity only; historical infrastructure and service claims are not reverified.",
    },
    null,
    2,
  ),
);
