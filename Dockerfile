# syntax=docker/dockerfile:1

# ---------- Builder ----------
# Installs full deps and compiles the Medusa app (backend + admin).
FROM node:20-slim AS builder
WORKDIR /app

# Native deps some Medusa packages need at build time
RUN apt-get update && apt-get install -y --no-install-recommends python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY bwcrackers/package.json bwcrackers/package-lock.json ./
RUN npm ci --loglevel=error

COPY bwcrackers/ ./
# Produces a self-contained app in .medusa/server (with its own package.json)
RUN npx medusa build

# ---------- Runner ----------
# Only the compiled output + production deps.
FROM node:20-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/.medusa/server ./
RUN npm install --omit=dev --loglevel=error \
    && npm cache clean --force

EXPOSE 9000

# Just run the server (serves API + admin at /app). DB migrations are applied
# manually (see CLAUDE.md) so container boot never depends on the pooler.
CMD ["npx", "medusa", "start"]
