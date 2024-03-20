FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci && npm cache clean --force

COPY . .



FROM node:20-alpine AS develop

WORKDIR /app

COPY --from=builder /app .

CMD ["npm", "run", "start:docker:dev"]
