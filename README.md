# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
> Node.js required version is **20 LTS**

## Downloading

```bash
git clone https://github.com/RVitaly1978/nodejs2024Q1-service.git
```

## Checkout to `part2` branch

```bash
git checkout part2
```

## Installing NPM modules

```bash
npm install
```

## Create a `.env` file

Copy and rename `.env.example` file


## Build production application

```bash
npm run build
```

## Running application

```bash
# in develop mode
npm run start

# in develop mode (--watch)
npm run start:dev

# in production mode
npm run start:prod
```

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


### Auto-fix and format

```bash
# lint
npm run lint

# prettier
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
