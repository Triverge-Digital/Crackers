FROM node:20-slim

WORKDIR /app

# Copy lockfile + package.json (cached layer)
COPY bwcrackers/package.json bwcrackers/package-lock.json ./

# Fast install using lockfile - skips resolution
RUN npm ci --loglevel=error

# Copy source
COPY bwcrackers/src ./src
COPY bwcrackers/medusa-config.ts ./
COPY bwcrackers/tsconfig.json ./
COPY bwcrackers/instrumentation.ts ./

# Build
RUN npx medusa build

EXPOSE 9000

CMD ["npx", "medusa", "start"]
