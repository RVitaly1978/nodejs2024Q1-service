import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { AppLogger } from '../logger/appLogger.service'
import { DEFAULT_LOG_LEVELS } from '../logger/constants/logLevels'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new AppLogger(LoggingInterceptor.name)

  constructor(private configService: ConfigService) {
    const logLevel = DEFAULT_LOG_LEVELS[parseInt(configService.get('LOG_LEVEL', '2'))]
    this.logger.setLogLevels([logLevel])
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpCtx = context.switchToHttp()
    const { url, body, query, method } = httpCtx.getRequest()
    const { statusCode } = httpCtx.getResponse()
    const logContext = context.getClass().name

    const msg = `${method} ${url} ${statusCode} ${JSON.stringify(query)} ${JSON.stringify(body)}`

    return next.handle().pipe(
      tap(() => this.logger.debug(msg, logContext))
    )
  }
}
