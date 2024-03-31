import { HttpAdapterHost } from '@nestjs/core'
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

import { AppLogger } from '../logger/appLogger.service'
import { DEFAULT_LOG_LEVELS } from '../logger/constants/logLevels'
import { ErrorMessage } from '../types'

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
  private readonly logger = new AppLogger(AppExceptionsFilter.name)

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private configService: ConfigService,
  ) {
    const logLevel = DEFAULT_LOG_LEVELS[parseInt(configService.get('LOG_LEVEL', '2'))]
    this.logger.setLogLevels([logLevel])
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const { url, method, body, query } = ctx.getRequest<Request>()

    const httpStatus = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR

    let exceptionMessage = ''
    if (exception instanceof HttpException) {
      exceptionMessage = exception.message
    } else if (exception instanceof Error) {
      exceptionMessage = `${ErrorMessage.InternalServerError} ${exception.message}`
    } else {
      exceptionMessage = ErrorMessage.InternalServerError
    }

    const responseBody = {
      statusCode: httpStatus,
      message: exceptionMessage,
      timestamp: new Date().toISOString(),
      path: url,
    }

    const msg = `${method} ${url} ${httpStatus} ${JSON.stringify(query)} ${JSON.stringify(body)}`
    this.logger.debug(msg)

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
