FROM oven/bun:1.3.14-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts
COPY . .
RUN bun run check:local

FROM oven/bun:1.3.14-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=5173
COPY --from=build --chown=bun:bun /app/dist ./dist
USER bun
EXPOSE 5173
CMD ["bun", "--cwd=dist", "--no-env-file", "run", "server.js"]
