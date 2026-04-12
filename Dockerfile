FROM node:20-slim

WORKDIR /app

# Copy only backend
COPY bwcrackers/package.json bwcrackers/package-lock.json* ./

RUN npm install

COPY bwcrackers/ .

RUN npx medusa build

EXPOSE 9000

CMD ["npx", "medusa", "start"]
