import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger'

import { AlbumService } from './album.service'
import { CreateAlbumDto } from './dto/create-album.dto'
import { UpdateAlbumDto } from './dto/update-album.dto'

import { ErrorMessage } from '../types'

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @ApiOperation({ summary: 'Get albums list', description: 'Gets all library albums list' })
  @Get()
  async getAllAlbums() {
    return await this.albumService.getAllAlbums()
  }

  @ApiOperation({ summary: 'Add new album', description: 'Add new album information' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestBodyDescription })
  @Post()
  async create(@Body() dto: CreateAlbumDto) {
    return await this.albumService.create(dto)
  }

  @ApiOperation({ summary: 'Get single album by id', description: 'Gets single album by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.AlbumNotExist })
  @Get(':id')
  async getAlbumById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.albumService.getAlbumById(id)
  }

  @ApiOperation({ summary: 'Update album information', description: 'Update library album information by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.AlbumNotExist })
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAlbumDto,
  ) {
    return await this.albumService.update(id, dto)
  }

  @ApiOperation({ summary: 'Delete album', description: 'Delete album from library' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.AlbumNotExist })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.albumService.remove(id)
  }
}
