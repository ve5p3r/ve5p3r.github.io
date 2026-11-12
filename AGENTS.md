# ve5p3r.dev

Production source repository for ve5p3r.dev, migrated to server-rendered React on Bun.

## Stack and layout

- **Runtime & Package Manager**: Bun 1.3.14 (`packageManager: bun@1.3.14`)
- **Framework**: React 19 (`react`, `react-dom` server-rendered via Bun.serve)
- **Formatting, Lint & Types**: Prettier 3.9, oxlint 1.86, TypeScript 7.0
- **Container**: `oven/bun:1.3.14-alpine`, runs as non-root user `bun`, listening on port 5173
- `src/server.ts`: Bun HTTP server handling `/`, `/healthz`, and `/assets/*` allowlist
- `web/`: Client entrypoint (`main.tsx`) and styling (`styles.css`)
- `public/`: Static runtime assets (`fox.webp`) copied into `dist/assets` during build
- `scripts/`: Build (`build.ts`), lint/typecheck/build pipeline (`check.ts`), and route smoke tests (`smoke.ts`)
- Root `index.html`, `fox.webp`, and `CNAME`: leftovers from the old static deployment. The container on Hera now serves the site, so they are not what visitors see; removing them is a separate, deliberate change

## Commands

The package scripts already pass `--no-env-file`; keep that flag when adding or changing a script.

- **Install**: `bun install --frozen-lockfile --ignore-scripts`
- **Dev**: `bun run dev`
- **Build**: `bun run build`
- **Start production bundle**: `bun run start`
- **Typecheck**: `bun run typecheck`
- **Lint**: `bun run lint`
- **Lint fix**: `bun run lint:fix`
- **Format check**: `bun run format:check`
- **Format**: `bun run format`
- **Local pipeline check**: `bun run check:local`
- **Smoke test**: `bun run test`

## How changes ship

- **Merging to `main` is a production deploy.** Never push directly to `main`; work on a branch and open a pull request.
- GitHub Actions (`.github/workflows/deploy.yml`) runs on PRs and pushes to `main`:
  1. `verify`: Runs `bun run check:local`, `bun run test`, builds runtime image `public-site-ci:${{ github.sha }}`, and tests container `/healthz`, `/`, and path security (404 on source/secret files).
  2. `publish` (on `main` push): Builds and pushes immutable image `ghcr.io/ve5p3r/ve5p3r.github.io:sha-<commit>` to GHCR, verifies non-root user, smoke-tests the image, and uploads `public-site-release` artifact (`release/release.json`).
  3. `deploy-azure` (on `main` push): Deploys the published digest to Azure App Service (`ve5p3r-dev-site`) via OIDC and verifies `/healthz` and `/`.
- **Hera Hosting**: The live site is served on Hera in Portainer stack `public-sites` (port 8813, published via Cloudflare tunnel). Hera's `public-sites-cd` timer runs every 5 minutes, picks up the newest successful main run, pulls the published digest, checks `/healthz`, and rolls back on failure.
- GitHub token authentication for this repo requires the `ve5p3r` GitHub account.

## Repository rules

- Never commit secrets, tokens, or `.env` files.
- The runtime image must run as non-root user `bun` (UID/GID != 0).
- Keep route privacy intact: only `/`, `/healthz`, and allowlisted `/assets/*` must be accessible. Internal files (`/.env`, `/package.json`, `/README.md`, `/src/*`) must return 404.
- Environment variables: `HOST` defaults to `127.0.0.1` locally, `0.0.0.0` in container; `PORT` must be an integer from 1 through 65535 (defaults to 5173).
