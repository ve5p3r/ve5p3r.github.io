import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { App } from "../src/components/App";

// Compare against the existing public source without changing or contacting it.
const sourceRoot = resolve(
  process.argv[2] || new URL("../..", import.meta.url).pathname,
);
const referencePath = resolve(sourceRoot, "web/main.tsx");
const reference = await import(pathToFileURL(referencePath).href);
const original = renderToStaticMarkup(createElement(reference.App));
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
assert.deepEqual(
  contactLinks(candidate),
  contactLinks(original),
  "Existing external/contact destinations are preserved",
);
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
const sha = (bytes: Uint8Array | string) =>
  createHash("sha256").update(bytes).digest("hex");
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
      source: referencePath,
      source_sha256: sha(await readFile(referencePath)),
      historical_archive_text_sha256: sha(archiveText(original)),
      candidate_text_sha256: sha(text(candidate)),
      section_ids: sections(candidate),
      link_count: links(candidate).length,
      checks: [
        "historical archive parity",
        "seed/fallback parity",
        "contact destinations",
        "retained sections",
        "source links",
        "historical qualification",
        "verified brand assets",
        "sigil alternative text",
        "legacy fox bytes preserved",
      ],
      approved_difference:
        "October 9 expressive design iteration: new source-backed work journal, candid introduction and dated corpus context. Earlier notes are explicitly historical; public contact destinations and exact artwork are preserved.",
      scope:
        "Archive/seed/link/artwork integrity only; historical infrastructure and service claims are not reverified.",
    },
    null,
    2,
  ),
);
