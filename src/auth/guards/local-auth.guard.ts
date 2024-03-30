import { ExecutionContext, Injectable, BadRequestException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

import { LoginDto } from '../dto/login.dto'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()

    // transform the request object to class instance
    const body = plainToClass(LoginDto, request.body)

    // get a list of errors
    const errors = await validate(body)

    // extract error messages from the errors array
    const errorMessages = errors.flatMap(({ constraints }) =>
      Object.values(constraints),
    )

    if (errorMessages.length > 0) {
      throw new BadRequestException(errorMessages)
    }

    return super.canActivate(context) as boolean | Promise<boolean>
  }
}
