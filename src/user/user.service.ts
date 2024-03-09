import { v4 as uuidv4 } from 'uuid'
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'

import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'

import { ErrorMessage } from '../types'

@Injectable()
export class UserService {
  private readonly users: User[] = []

  async create(user: CreateUserDto) {
    const isExist = this.users.find(item => item.login === user.login)
    if (isExist) {
      throw new ForbiddenException(ErrorMessage.UserAlreadyExist)
    }
    const item = {
      ...user,
      id: uuidv4(),
      version: 1,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    }
    this.users.push(item)
    return item
  }

  async getAllUsers() {
    return this.users
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.find(item => item.id === id)
  }

  async update(id: string, dto: UpdatePasswordDto) {
    const entry = await this.getUserById(id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.UserNotExist)
    }
    if (entry.password !== dto.oldPassword) {
      throw new ForbiddenException(ErrorMessage.PasswordNotCorrect)
    }
    entry.password = dto.newPassword
    entry.version += entry.version
    entry.updatedAt = new Date().getTime()
    return entry
  }

  async remove(id: string) {
    const index = this.users.findIndex(item => item.id === id)
    if (index < 0) {
      throw new NotFoundException(ErrorMessage.UserNotExist)
    }
    this.users.splice(index, 1)
    return id
  }
}
