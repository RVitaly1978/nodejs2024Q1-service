import { Controller, UseInterceptors, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, NotFoundException, ClassSerializerInterceptor } from '@nestjs/common'

import { FindOneParams } from '../dto/find-one-params.dto'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'

import { ErrorMessage } from '../types'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers() {
    const items = await this.userService.getAllUsers()
    return items.map(item => new UserDto(item))
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const item = await this.userService.create(dto)
    return new UserDto(item)
  }

  @Get(':id')
  async getUserById(@Param() params: FindOneParams) {
    const item = await this.userService.getUserById(params.id)
    if (!item) {
      throw new NotFoundException(ErrorMessage.UserNotExist)
    }
    return new UserDto(item)
  }

  @Put(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() dto: UpdatePasswordDto,
  ) {
    const item = await this.userService.update(params.id, dto)
    return new UserDto(item)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() params: FindOneParams) {
    return (await this.userService.remove(params.id))
  }
}
