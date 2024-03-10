import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AlbumService } from './album.service'
import { CreateAlbumDto } from './dto/create-album.dto'
import { UpdateAlbumDto } from './dto/update-album.dto'

import { ErrorMessage } from '../types'

@ApiTags('Album')
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
  async getAlbumById(@Param('id', ParseUUIDPipe) id: string) {
    const entry = await this.albumService.getAlbumById(id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.AlbumNotExist)
    }
    return entry
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAlbumDto,
  ) {
    return (await this.albumService.update(id, dto))
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.albumService.remove(id)
  }
}
