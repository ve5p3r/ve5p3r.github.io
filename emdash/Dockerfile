FROM oven/bun:1.3.14@sha256:e10577f0db68676a7024391c6e5cb4b879ebd17188ab750cf10024a6d700e5c4 AS bun
FROM node:24-bookworm-slim@sha256:d6aa754f16b3197301076f047b5def2f02ea1dbbc2ca920407d46d7ec7f87b20 AS build
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts
COPY . .
ARG EMDASH_SITE_URL
ENV EMDASH_SITE_URL=$EMDASH_SITE_URL EMDASH_DATA_DIR=/app/data
RUN bun run build

FROM node:24-bookworm-slim@sha256:d6aa754f16b3197301076f047b5def2f02ea1dbbc2ca920407d46d7ec7f87b20 AS runtime
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=5173 EMDASH_DATA_DIR=/app/data
ARG EMDASH_SITE_URL
ENV EMDASH_SITE_URL=$EMDASH_SITE_URL
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/seed ./seed
COPY --from=build --chown=node:node /app/container-start.sh ./container-start.sh
RUN mkdir -p /app/data && chown node:node /app/data
USER node
EXPOSE 5173
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s CMD node -e "fetch('http://127.0.0.1:5173/healthz').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["sh", "./container-start.sh"]
