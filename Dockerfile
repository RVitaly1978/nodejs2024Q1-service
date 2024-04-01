FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json .

RUN npm ci && npm cache clean --force

COPY . .



FROM node:20-alpine AS develop

WORKDIR /app

COPY --from=base /app .

CMD ["npm", "run", "start:docker:dev"]



FROM base AS build

RUN npm run build



FROM node:20-alpine AS production

USER node

WORKDIR /app

COPY --chown=node:node package*.json .
COPY --chown=node:node ./prisma ./prisma
COPY --chown=node:node --from=build /app/dist ./dist

RUN npm ci --omit=dev && npm cache clean --force

CMD ["npm", "run", "start:docker:prod"]
