import { Controller, Post, Body, Request, HttpCode, HttpStatus, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBody, ApiOperation, ApiForbiddenResponse, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { CreateUserDto } from '../user/dto/create-user.dto'

import { Public } from './decorators/public'
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'

import { JWTTokenPayload, ErrorMessage } from '../types'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Signup user', description: 'Signup a new user' })
  @ApiForbiddenResponse({ description: ErrorMessage.UserAlreadyExist })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestBodyDescription })
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    return await this.authService.create(dto)
  }

  @ApiOperation({ summary: 'Login user', description: 'Login an existed user' })
  @ApiBody({ type: LoginDto })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestBodyDescription })
  @ApiForbiddenResponse({ description: ErrorMessage.ForbiddenDescription })
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() { user }: { user: JWTTokenPayload }) {
    return await this.authService.getTokens(user)
  }

  @ApiOperation({ summary: 'Refresh JWT tokens', description: 'Refresh JWT tokens' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiUnauthorizedResponse({ description: ErrorMessage.UnauthorizedRefreshTokenDescription })
  @ApiForbiddenResponse({ description: ErrorMessage.ForbiddenRefreshTokenDescription })
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Request() { user }: { user: JWTTokenPayload }) {
    return await this.authService.getTokens(user)
  }
}
