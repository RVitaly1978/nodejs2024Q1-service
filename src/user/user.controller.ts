import { Controller, UseInterceptors, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, HttpCode, HttpStatus, ClassSerializerInterceptor } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiForbiddenResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger'

import { UserService } from './user.service'
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
    return await this.userService.getAllUsers()
  }

  @ApiOperation({ summary: 'Create user', description: 'Creates a new user' })
  @ApiForbiddenResponse({ description: ErrorMessage.UserAlreadyExist })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestBodyDescription })
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto)
  }

  @ApiOperation({ summary: 'Get single user by id', description: 'Get single user by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.UserNotExist })
  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.getUserById(id)
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
    return await this.userService.update(id, dto)
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
