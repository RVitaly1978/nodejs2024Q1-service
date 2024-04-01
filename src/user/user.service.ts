import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'

import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'

import { PrismaService } from '../prisma/prisma.service'

import { ErrorMessage } from '../types'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(user: CreateUserDto) {
    const isExist = await this.prisma.user.findUnique({ where: { login: user.login } })
    if (isExist) {
      throw new ForbiddenException(ErrorMessage.UserAlreadyExist)
    }
    const entry = await this.prisma.user.create({ data: user })
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

  async update(id: string, dto: UpdatePasswordDto) {
    const entry = await this.getOne(id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.UserNotExist)
    }
    if (entry.password !== dto.oldPassword) {
      throw new ForbiddenException(ErrorMessage.PasswordNotCorrect)
    }
    const updated = await this.prisma.user.update({
      where: { id },
      data: { password: dto.newPassword, version: entry.version + 1 },
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
}
