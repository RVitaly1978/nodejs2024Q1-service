import { Controller, UseInterceptors, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, HttpCode, HttpStatus, NotFoundException, ClassSerializerInterceptor } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

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
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const entry = await this.userService.getUserById(id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.UserNotExist)
    }
    return new User(entry)
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    const entry = await this.userService.update(id, dto)
    return new User(entry)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.remove(id)
  }
}
