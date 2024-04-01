import { ExecutionContext, UnauthorizedException, ForbiddenException, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

import { RefreshTokenDto } from '../dto/refresh-token.dto'
import { ErrorMessage } from '../../types'

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()

    // transform the request object to class instance
    const body = plainToClass(RefreshTokenDto, request.body)

    // get a list of errors
    const errors = await validate(body)

    // extract error messages from the errors array
    const errorMessages = errors.flatMap(({ constraints }) =>
      Object.values(constraints),
    )

    if (errorMessages.length) {
      throw new UnauthorizedException(errorMessages)
    }

    return super.canActivate(context) as boolean | Promise<boolean>
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (!user) {
      throw new ForbiddenException(ErrorMessage.ForbiddenRefreshTokenDescription)
    }
    return super.handleRequest(err, user, info, context, status)
  }
}
