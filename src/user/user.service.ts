import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'

import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'

import { PrismaService } from '../prisma/prisma.service'

import { ErrorMessage, UserDb } from '../types'

const getTypedUser = (user: UserDb): User => ({
  ...user,
  createdAt: new Date(user.createdAt).getTime(),
  updatedAt: new Date(user.updatedAt).getTime(),
})

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(user: CreateUserDto) {
    const isExist = await this.prisma.user.findUnique({ where: { login: user.login } })
    if (isExist) {
      throw new ForbiddenException(ErrorMessage.UserAlreadyExist)
    }
    const entry = await this.prisma.user.create({ data: user })
    return getTypedUser(entry)
  }

  async getAllUsers() {
    const entries = await this.prisma.user.findMany()
    return entries.map(getTypedUser)
  }

  async getUserById(id: string) {
    const entry = await this.prisma.user.findUnique({ where: { id } })
    if (!entry) {
      throw new NotFoundException(ErrorMessage.UserNotExist)
    }
    return getTypedUser(entry)
  }

  async update(id: string, dto: UpdatePasswordDto) {
    const entry = await this.getUserById(id)
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
    return getTypedUser(updated)
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
