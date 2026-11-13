import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, sessionDrivers } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

const dataDir = process.env.EMDASH_DATA_DIR || "./";
const isLocal = dataDir === "./" || dataDir === "." || !dataDir;
const siteUrl = process.env.EMDASH_SITE_URL || process.env.SITE_URL;

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    react(),
    emdash({
      fonts: false,
      ...(siteUrl ? { siteUrl } : {}),
      trustedProxyHeaders: ["x-forwarded-for"],
      database: sqlite({
        url: isLocal ? "file:./data.db" : `file:${dataDir.replace(/\/+$/, "")}/emdash.db`,
      }),
      storage: local({
        directory: isLocal ? "./uploads" : `${dataDir.replace(/\/+$/, "")}/uploads`,
        baseUrl: "/_emdash/api/media/file",
      }),
    }),
  ],
  session: { driver: sessionDrivers.fsLite({ base: isLocal ? "./.astro/sessions" : `${dataDir.replace(/\/+$/, "")}/sessions` }), cookie: { secure: true, httpOnly: true, sameSite: "lax" } },
  devToolbar: { enabled: false },
});
