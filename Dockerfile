FROM mcr.microsoft.com/playwright:v1.58.0-jammy

WORKDIR /app

COPY AUTH-E2E/package*.json ./

RUN npm ci

COPY AUTH-E2E/ .

CMD ["npm", "run", "test:e2e"]
