import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common'

import { FindOneParams } from '../dto/find-one-params.dto'
import { AlbumService } from './album.service'
import { CreateAlbumDto } from './dto/create-album.dto'
import { UpdateAlbumDto } from './dto/update-album.dto'

import { ErrorMessage } from '../types'

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  async getAllAlbums() {
    return (await this.albumService.getAllAlbums())
  }

  @Post()
  async create(@Body() dto: CreateAlbumDto) {
    return (await this.albumService.create(dto))
  }

  @Get(':id')
  async getAlbumById(@Param() params: FindOneParams) {
    const entry = await this.albumService.getAlbumById(params.id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.AlbumNotExist)
    }
    return entry
  }

  @Put(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() dto: UpdateAlbumDto,
  ) {
    return (await this.albumService.update(params.id, dto))
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() params: FindOneParams) {
    return (await this.albumService.remove(params.id))
  }
}
