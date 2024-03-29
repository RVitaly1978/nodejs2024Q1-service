# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Install [Docker](https://docs.docker.com/engine/install/)

> Node.js required version is **20 LTS**

## Downloading

```bash
# clone repo
git clone https://github.com/RVitaly1978/nodejs2024Q1-service.git

# go to the project directory
cd nodejs2024Q1-service
```

## Checkout to `part3` branch

```bash
git checkout part3
```

## Installing NPM modules

```bash
npm install
```

## Environment

Create a `.env` file: copy and rename `.env.example` file
```bash
PORT=4000

CRYPT_SALT=10
JWT_SECRET_KEY=secret123123
JWT_SECRET_REFRESH_KEY=secret123123
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432
DB_NAME=hls-db
DB_NETWORK=hls-network
DB_DRIVER=bridge
DB_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"
```

> For usage with docker compose provided containerized database, `DB_HOST` should be configured to be service name `db`

## Build production application

```bash
npm run build

# in Docker container
npm run compose:build:prod
```

## Running application

```bash
# in develop mode
npm run start

# in develop mode (--watch)
npm run start:dev

# in production mode
npm run start:prod

# in Docker container in develop mode (--watch)
npm run compose:start
```

## OpenAPI

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and run tests:

```bash
# run all tests without authorization
npm run test

# run only one of all test suites
npm run test -- <path to suite>

# run all test with authorization
npm run test:auth

# run only specific test suite with authorization
npm run test:auth -- <path to suite>
```

## Docker container vulnerability scan

> `docker scout` CLI plugin is available by default on [Docker Desktop](https://docs.docker.com/desktop/) starting with version `4.17`. Otherwise, you need to install [docker scout](https://github.com/docker/scout-cli?tab=readme-ov-file) yourself.

To scan docker images (**app** and **db**) vulnerability execute:

```bash
npm run docker:scout
```

## Auto-fix and format

```bash
# lint (without --fix)
npm run lint:check

# lint (with --fix)
npm run lint

# prettier
npm run format
```

## Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
