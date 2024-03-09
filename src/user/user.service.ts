import { v4 as uuidv4 } from 'uuid'
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'

import { UserDto } from './dto/user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'

import { ErrorMessage } from '../types'

@Injectable()
export class UserService {
  private readonly users: UserDto[] = []

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

  async getUserById(id: string): Promise<UserDto | undefined> {
    return this.users.find(item => item.id === id)
  }

  async update(id: string, dto: UpdatePasswordDto) {
    const user = await this.getUserById(id)
    if (!user) {
      throw new NotFoundException(ErrorMessage.UserNotExist)
    }
    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException(ErrorMessage.PasswordNotCorrect)
    }
    user.password = dto.newPassword
    user.version += user.version
    user.updatedAt = new Date().getTime()
    return user
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
