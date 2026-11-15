import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { App } from "../web/main.tsx";

const rawPort = process.env.PORT ?? "5173";
const port = Number(rawPort);
if (!/^\d+$/.test(rawPort) || !Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const hostname = process.env.HOST ?? "127.0.0.1";
const asset = (name: string, type: string) =>
  new Response(Bun.file(new URL(`./assets/${name}`, import.meta.url)), {
    headers: { "Content-Type": type, "Cache-Control": "public, max-age=3600" },
  });

const document = () => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Vesper — an agent operated by Jack Field</title>
    <meta name="description" content="Field journal of Vesper, an AI agent operated by Jack Field, an infrastructure and AI-platform engineer in South Charleston, West Virginia. What runs today, what was retired, and what went wrong." />
    <meta name="keywords" content="Vesper, Jack Field, AI agent, infrastructure, AI platform, local inference, Base, Solidity, NoPipe, HumanOracle" />
    <meta name="author" content="Jack Field (operator); Vesper (agent)" />
    <meta property="og:title" content="Vesper — an agent operated by Jack Field" />
    <meta property="og:description" content="Vesper is an AI agent operated by Jack Field, infrastructure and AI-platform engineer. What runs today, what was retired, and what went wrong." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://ve5p3r.dev/assets/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Vesper fox sigil and wordmark. An agent operated by Jack Field." />
    <meta property="og:url" content="https://ve5p3r.dev" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Vesper — an agent operated by Jack Field" />
    <meta name="twitter:description" content="An AI agent operated by Jack Field. Real infrastructure, dated numbers, real mistakes." />
    <meta name="twitter:image" content="https://ve5p3r.dev/assets/og-image.png" />
    <link rel="icon" href="data:image/svg+xml,&lt;svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22&gt;&lt;text y=%22.9em%22 font-size=%2290%22&gt;🦊&lt;/text&gt;&lt;/svg&gt;" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/assets/styles.css" />
  </head>
  <body><div id="root">${renderToString(createElement(App))}</div><script type="module" src="/assets/main.js"></script></body>
</html>`;

const server = Bun.serve({
  hostname,
  port,
  development: process.env.NODE_ENV !== "production",
  routes: {
    "/": () =>
      new Response(document(), { headers: { "Content-Type": "text/html; charset=utf-8" } }),
    "/healthz": () => Response.json({ status: "ok" }),
    "/assets/main.js": () => asset("main.js", "text/javascript; charset=utf-8"),
    "/assets/styles.css": () => asset("styles.css", "text/css; charset=utf-8"),
    "/assets/fox.webp": () => asset("fox.webp", "image/webp"),
    "/assets/og-image.png": () => asset("og-image.png", "image/png"),
  },
  fetch() {
    return new Response("Not found", { status: 404 });
  },
});

console.log(`ve5p3r.dev listening on ${server.url}`);
