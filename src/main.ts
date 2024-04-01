import { mkdir } from 'fs/promises'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { startSwagger } from './swagger/swagger'
import { AppModule } from './app.module'
import { AppLogger } from './logger/appLogger.service'
import { getLogLevels } from './logger/constants/logLevels'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })

  const configService = app.get(ConfigService)

  const logLevels = getLogLevels(parseInt(configService.get('LOG_LEVEL', '2')))
  const maxFileSize = parseInt(configService.get('MAX_LOG_SIZE', '10000'))
  const PORT = configService.get('PORT', 4000)

  try {
    await mkdir('logs')
  } catch {
    // logs dir already exists
  }

  const logger = app.get(AppLogger)
  app.useLogger(logger)
  app.useLogger(logLevels)
  logger.setLogRotation(maxFileSize)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  startSwagger(app, PORT)

  await app.listen(PORT, () => {
    logger.log(`Started on port ${PORT}`, 'PORT')
  })

  process.on('unhandledRejection', (reason) => {
    if (reason instanceof Error) {
      logger.error(reason.message, reason.stack, 'UnhandledRejection')
    } else if (typeof reason === 'object') {
      logger.error(JSON.stringify(reason), undefined, 'UnhandledRejection')
    } else {
      logger.error(String(reason), undefined, 'UnhandledRejection')
    }
  })

  process.on('uncaughtException', (error) => {
    logger.error(error.message, error.stack, 'UncaughtException')
    app.close()
  })
}

bootstrap()

// setTimeout(() => {
//   Promise.reject('Test rejected promise')
// }, 3000)

// setTimeout(() => {
//   throw new Error('Test error')
// }, 4000)
