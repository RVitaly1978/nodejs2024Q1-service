import { Controller, UseInterceptors, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, HttpCode, HttpStatus, NotFoundException, ClassSerializerInterceptor } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiForbiddenResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger'

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

  @ApiOperation({ summary: 'Get all users', description: 'Gets all users' })
  @Get()
  async getAllUsers() {
    const entries = await this.userService.getAllUsers()
    return entries.map(entry => new User(entry))
  }

  @ApiOperation({ summary: 'Create user', description: 'Creates a new user' })
  @ApiForbiddenResponse({ description: ErrorMessage.UserAlreadyExist })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestBodyDescription })
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const entry = await this.userService.create(dto)
    return new User(entry)
  }

  @ApiOperation({ summary: 'Get single user by id', description: 'Get single user by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.UserNotExist })
  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const entry = await this.userService.getUserById(id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.UserNotExist)
    }
    return new User(entry)
  }

  @ApiOperation({ summary: 'Update a user\'s password', description: 'Updates a user\'s password by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiForbiddenResponse({ description: ErrorMessage.PasswordNotCorrect })
  @ApiNotFoundResponse({ description: ErrorMessage.UserNotExist })
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    const entry = await this.userService.update(id, dto)
    return new User(entry)
  }

  @ApiOperation({ summary: 'Delete user', description: 'Deletes user by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.UserNotExist })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.remove(id)
  }
}
