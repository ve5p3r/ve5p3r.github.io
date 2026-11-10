# October 9 field-journal iteration

The current local source has new journal copy and layout, source-linked historical artifacts, a qualified historical archive and a dated corpus note. The original brand assets and contact destinations are preserved. Current validation is recorded in the design-iteration receipt; the earlier parity and container statements below describe their respective older snapshots.

The October 8 image does not contain either the later branding or this journal. A future release must rebuild and verify a new image, review any existing CMS homepage values (conflict-skipping seed will not replace them), and complete the existing owner setup and cutover gates. No live content database was edited.

---

# October 9 branding addendum

The current source now uses the verified Vesper sigil, wordmark and palette. Source build, copy parity and route/CMS smoke checks are rerun with this change. The October 8 image and container persistence evidence below are historical: that image does not include the new branding. Rebuild and verify a new image from this source before any separately authorized release. Runtime secret, owner setup and cutover gates are unchanged.

---

# Vesper local release candidate — 2026-10-08

Source root: `/home/jack/code/ve5p3r.dev/emdash`. This is a local review candidate. Nothing was pushed, published, routed or deployed.

## Existing public copy

The existing `../web/main.tsx` is the approved copy source for this conversion. Its SHA-256 is `2b3079b6222b3aa72dcbd28b944b53168e69a3ffe021128bd9a72e99a23beb17`. The rendered fallback and published seed have identical words in identical order, eleven identical links and six identical sections: story, infra, projects, timeline, ecosystem, contact. Image markup/alt text, stylesheet bytes and fox bytes also match. No new offer, client claim, integration or current infrastructure assertion was added. Historical wording was preserved; this check is not an audit of those historical claims.

Run from this directory:

```sh
bun install --frozen-lockfile --ignore-scripts
bun run verify:copy
bun run typecheck
bun run build
bun run test
```

`verify:copy` accepts an explicit original repository path when run in an isolated copy. Example: `bun run verify:copy /home/jack/code/ve5p3r.dev`. Review and intentionally refresh the copy baseline if the original public source later changes.

## Container recipe and verified artifact

`Dockerfile` and `container-start.sh` derive from `/home/jack/code/jdot-emdash-deploy/emdash/`. The Bun 1.3.14 and Node 24 Bookworm images use the same pinned digests as that existing release recipe. The lockfile install skips lifecycle scripts and passed. The runtime runs as `node`, holds SQLite/uploads/sessions under `/app/data`, and seeds public content once with conflict skipping. The recipe does not supply or create a runtime credential.

```sh
docker build --pull=false --build-arg EMDASH_SITE_URL=https://ve5p3r.dev -t vesper-emdash:overnight-20261008 .
docker image inspect vesper-emdash:overnight-20261008 --format '{{.Id}}'
```

Tested local image ID: `sha256:ceacc57109dcf3a284a9410c173a4880a252286b5b60577fe9d102571201e4ef`. This is a local Docker image identity, not a published registry digest. Source, lockfile and recipe checksums are in the morning review package.

The verification container used `--network none`, no published ports, a read-only root, dropped capabilities, no-new-privileges and one disposable data volume. Tests checked homepage, health, CSS/fox/admin, the admin redirect, and private-file rejection. A synthetic CMS edit survived replacement with a second container; seed content was not overwritten. Synthetic upload/session-directory files also survived, and SQLite integrity was `ok`. The owned containers and volume were removed. The tested image remains available for review.

These tests prove storage behavior, not a real EmDash login or cookie session. No owner, passkey, secret or live session was created. Reproduction harness and receipt:

- `/home/jack/inventory/tasks/overnight-sites-svelte-20261008/morning/verify-vesper-container.py`
- `/home/jack/inventory/tasks/overnight-sites-svelte-20261008/morning/evidence/vesper-container.json`

## Cutover handoff — not executed

1. Release owner reviews the exact changed files and image. Record the currently accepted Vesper image, service configuration and route before any change; the historical October 6 receipt is not a fresh live-state check.
2. Use a separate approved Vesper data volume mapped to `/app/data`, with the established `node` ownership. Never reuse jdot or Fieldkraft's database/session directories. `EMDASH_DATA_DIR=/app/data` and the canonical site URL are set during this build; changing those requires rebuilding and verifying the candidate.
3. Wire the approved runtime secret through the existing deployment mechanism without committing, printing or copying another site's secret. This pass neither selects nor grants credentials.
4. Through an owner-controlled setup window, establish the Vesper owner, verify sign-in and close initial setup before external routing. Retain the existing runtime isolation policy. No live command or setup action was performed here.
5. Approve the image publication and route change separately. Keep the original Bun/static files, `index.html`, fox, `CNAME`, old image and existing route available until acceptance.
6. Before traffic cutover, capture an online-consistent backup of that site's database plus uploads/session storage through the existing operator process. Validate health, canonical URLs, public content, setup closure, private-file rejection and owner access against the actual candidate host.
7. Roll back by restoring the previously recorded accepted image and route with the existing release owner/tooling. Retain the new Vesper volume for diagnosis; never point the former Bun/static release at an EmDash database or delete retained data as rollback.

Remaining manual decisions are runtime volume/secret selection, actual owner authentication, publication and cutover approval. Copy preservation, image construction, local public-route testing and synthetic restart persistence are complete.
