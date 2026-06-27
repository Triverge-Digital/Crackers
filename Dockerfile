# syntax=docker/dockerfile:1

# ---------- Builder ----------
# Installs full deps and compiles the Medusa app (backend + admin).
FROM node:20-slim AS builder
WORKDIR /app

# Native deps some Medusa packages need at build time
RUN apt-get update && apt-get install -y --no-install-recommends python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY bwcrackers/package.json bwcrackers/package-lock.json ./
# Cache mount keeps downloaded tarballs across builds → fast re-installs.
RUN --mount=type=cache,target=/root/.npm npm ci --loglevel=error

COPY bwcrackers/ ./
# Produces a self-contained app in .medusa/server (with its own package.json)
RUN npx medusa build

# ---------- Runner ----------
# Only the compiled output + production deps.
FROM node:20-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/.medusa/server ./
# Same npm cache mount; do NOT `npm cache clean` (the cache lives in the mount,
# not the layer, so it doesn't bloat the image and speeds up every rebuild).
RUN --mount=type=cache,target=/root/.npm npm install --omit=dev --loglevel=error

EXPOSE 9000

# Just run the server (serves API + admin at /app). DB migrations are applied
# manually (see CLAUDE.md) so container boot never depends on the pooler.
CMD ["npx", "medusa", "start"]
