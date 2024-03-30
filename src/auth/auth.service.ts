import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { UserService } from '../user/user.service'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { TokensResponse } from './dto/tokens-response.dto'

import { JWTTokenPayload } from '../types'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async create(dto: CreateUserDto) {
    return await this.userService.create(dto)
  }

  async validateUser(login: string, password: string) {
    try {
      return await this.userService.validate(login, password)
    } catch {
      return null
    }
  }

  async getTokens({ id, login }: JWTTokenPayload): Promise<TokensResponse> {
    const payload = { userId: id, login }
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET_REFRESH_KEY', 'refreshTokenSecret'),
        expiresIn: this.configService.get('TOKEN_REFRESH_EXPIRE_TIME', '24h'),
      })
    ])
    return { accessToken, refreshToken }
  }
}
