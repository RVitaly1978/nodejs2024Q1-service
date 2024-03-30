import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'

import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'

import { PrismaService } from '../prisma/prisma.service'

import { ErrorMessage } from '../types'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create({ login, password }: CreateUserDto) {
    const isExist = await this.prisma.user.findFirst({ where: { login } })
    if (isExist) {
      throw new ForbiddenException(ErrorMessage.UserAlreadyExist)
    }
    const data = {
      login,
      password: await this.hashPassword(password),
    }
    const entry = await this.prisma.user.create({ data })
    return new User(entry)
  }

  async getAll() {
    const entries = await this.prisma.user.findMany()
    return entries.map((entry) => new User(entry))
  }

  async getOne(id: string) {
    const entry = await this.prisma.user.findUnique({ where: { id } })
    if (!entry) {
      throw new NotFoundException(ErrorMessage.UserNotExist)
    }
    return new User(entry)
  }

  async update(id: string, { oldPassword, newPassword }: UpdatePasswordDto) {
    const entry = await this.prisma.user.findUnique({ where: { id } })
    if (!entry) {
      throw new NotFoundException(ErrorMessage.UserNotExist)
    }
    const isValidPassword = await this.comparePasswords(oldPassword, entry.password)
    if (!isValidPassword) {
      throw new ForbiddenException(ErrorMessage.PasswordNotCorrect)
    }
    const password = await this.hashPassword(newPassword)
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        password,
        version: { increment: 1 },
      },
    })
    return new User(updated)
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } })
      return id
    } catch (err) {
      throw new NotFoundException(ErrorMessage.UserNotExist)
    }
  }

  async validate(login: string, password: string) {
    const entry = await this.prisma.user.findUnique({ where: { login } })
    if (!entry) {
      throw new ForbiddenException(ErrorMessage.UserNotExist)
    }
    const isValidPassword = await this.comparePasswords(password, entry.password)
    if (!isValidPassword) {
      throw new ForbiddenException(ErrorMessage.PasswordNotCorrect)
    }
    return new User(entry)
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(
      password,
      parseInt(this.configService.get('CRYPT_SALT', '10')),
    )
  }

  private async comparePasswords(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
  }
}
