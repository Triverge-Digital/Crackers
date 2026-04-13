FROM node:20-slim

WORKDIR /app

COPY bwcrackers/package.json bwcrackers/package-lock.json ./
RUN npm ci --omit=dev --loglevel=error

COPY bwcrackers/.medusa ./.medusa

# medusa start must run from the compiled output directory
# so ./src/modules/order-enquiry resolves to the compiled JS
WORKDIR /app/.medusa/server

EXPOSE 9000

CMD ["npx", "medusa", "start"]
