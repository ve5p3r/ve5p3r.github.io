# ve5p3r.dev

The current ve5p3r.dev page migrated to server-rendered React on Bun. The public server exposes only `/`, `/healthz`, the compiled client and stylesheet, and the fox image.

The root `index.html`, `fox.webp`, and `CNAME` remain as a temporary compatibility surface for the existing Caddy/static deployment. Remove them only after the Portainer service is live and the effective route has been verified.

```bash
bun install --frozen-lockfile --ignore-scripts
bun run check:local
bun run test
bun run dev
```

The server binds to `127.0.0.1` by default. Containers set `HOST=0.0.0.0`; `PORT` must be an integer from 1 through 65535.
