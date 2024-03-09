import { Controller, UseInterceptors, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, NotFoundException, ClassSerializerInterceptor } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { FindOneParams } from '../dto/find-one-params.dto'
import { UserService } from './user.service'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'

import { ErrorMessage } from '../types'

@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers() {
    const entries = await this.userService.getAllUsers()
    return entries.map(entry => new User(entry))
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const entry = await this.userService.create(dto)
    return new User(entry)
  }

  @Get(':id')
  async getUserById(@Param() params: FindOneParams) {
    const entry = await this.userService.getUserById(params.id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.UserNotExist)
    }
    return new User(entry)
  }

  @Put(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() dto: UpdatePasswordDto,
  ) {
    const entry = await this.userService.update(params.id, dto)
    return new User(entry)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() params: FindOneParams) {
    await this.userService.remove(params.id)
  }
}
