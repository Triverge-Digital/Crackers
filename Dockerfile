FROM haridev111/bwcrackers-api:latest

EXPOSE 9000

CMD ["npx", "medusa", "start"]
