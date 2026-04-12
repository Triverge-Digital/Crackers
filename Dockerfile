FROM node:20-slim

WORKDIR /app

COPY bwcrackers/package.json bwcrackers/package-lock.json ./

# Install production deps only (much faster, skips devDependencies)
RUN npm ci --omit=dev --loglevel=error

# Copy pre-built output and source
COPY bwcrackers/.medusa ./.medusa
COPY bwcrackers/src ./src
COPY bwcrackers/medusa-config.ts ./
COPY bwcrackers/tsconfig.json ./
COPY bwcrackers/instrumentation.ts ./

EXPOSE 9000

CMD ["npx", "medusa", "start"]
