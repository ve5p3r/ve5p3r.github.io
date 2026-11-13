# Vesper EmDash field journal

An additive, unpublished EmDash 1.2.0 / Astro 7.3.6 / Node standalone site. The October 9 iteration gives the original fox and wordmark room, introduces a candid agent voice, and leads with dated public engineering artifacts. The original Bun/React and static deployment surfaces remain separate and unchanged.

## Local verification

```sh
bun install --frozen-lockfile --ignore-scripts
bun run verify:copy
bun run typecheck
env -u EMDASH_DATA_DIR bun run build
bun run test
```

The smoke harness requires a build and uses a fresh temporary database, uploads and sessions. It starts and removes its own loopback listener on port 41889 (override with `SMOKE_PORT`). It checks routes, assets, private-file rejection, live CMS edits and unpublished-content fallback. Do not point it at production data.

For a local preview, seed a separate fixture with the EmDash CLI, then start the built Node entry from that fixture directory. Node 24 and Bun 1.3.14 are the verified Hera toolchain. No dependency or runtime-route change was part of the design iteration.

## Content and evidence

- `src/components/App.tsx`: new introduction, agent/persona context, dated shared-corpus scope and retained contact destinations.
- `WorkJournal.tsx`: [NoPipe](https://github.com/ve5p3r/nopipe), [HumanOracle](https://github.com/ve5p3r/human-oracle), and [HOOT](https://github.com/ve5p3r/hoot-contracts), with pinned source receipts and visible limits. NoPipe's visible history starts March 1, not January. HumanOracle's reported outcomes are simulations. Repository source does not verify deployment or current service availability.
- `HistoryArchive.tsx`: the earlier story, infrastructure, projects, timeline and ecosystem copy is preserved verbatim inside a collapsed historical disclosure. Its original claims are qualified before the content; they are not certified as current facts.
- The verified sigil and wordmark SVGs remain byte-identical to the October 4 branding receipt. The favicon and social PNG use that sigil; the older fox image remains available only for compatibility.
- The user supplied verified migration figures: 4,375,542 vectors from 328,653 complete source records. The old 1,908,563-vector index overlaps and uses another model; counts are not added. Refinement remains ongoing. No private corpus content is rendered or queried by this site.
- The public page renders on the server. Disclosures use native HTML; no new frontend runtime dependency is introduced.

`verify:copy` compares the historical archive against `../web/main.tsx`, preserves the five external/contact destinations, checks new source links, original artwork hashes, and agreement between published seed and fallback copy. An isolated checkout can pass the legacy repository explicitly: `bun run verify:copy /home/jack/code/ve5p3r.dev`.

The homepage collection still exposes headline, introduction, kicker and contact email. **Conflict-skipping seed does not overwrite an existing published homepage row.** A later release needs editorial review of any existing CMS values so old introduction text is not accidentally paired with the new journal. This pass only seeded disposable fixtures.

Detailed research, before/after files, screenshots, test logs and checksums are in `/home/jack/inventory/tasks/overnight-sites-svelte-20261008/design-iteration-20261009/`.

## Release boundaries

Nothing was pushed, published or routed. The October 8 container verification is historical and its image predates this iteration. Rebuild and verify a current image before release. See [RELEASE.md](release.md) for the existing owner-controlled secret/volume, owner setup, backup, cutover and rollback gates. No credentials were created, copied or changed.
