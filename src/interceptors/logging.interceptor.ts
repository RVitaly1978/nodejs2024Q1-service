import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { AppLogger } from '../logger/appLogger.service'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: AppLogger) {
    this.logger.setContext(LoggingInterceptor.name)
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpCtx = context.switchToHttp()
    const { url, body, query, method } = httpCtx.getRequest()
    const { statusCode } = httpCtx.getResponse()
    const logContext = context.getClass().name

    const msg = `${method} ${url} ${statusCode} ${JSON.stringify(query)} ${JSON.stringify(body)}`

    return next.handle().pipe(
      tap(() => this.logger.log(msg, logContext))
    )
  }
}
