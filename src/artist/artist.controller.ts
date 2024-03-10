import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ArtistService } from './artist.service'
import { CreateArtistDto } from './dto/create-artist.dto'
import { UpdateArtistDto } from './dto/update-artist.dto'

import { ErrorMessage } from '../types'

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  async getAllArtists() {
    return (await this.artistService.getAllArtists())
  }

  @Post()
  async create(@Body() dto: CreateArtistDto) {
    return (await this.artistService.create(dto))
  }

  @Get(':id')
  async getArtistById(@Param('id', ParseUUIDPipe) id: string) {
    const entry = await this.artistService.getArtistById(id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.ArtistNotExist)
    }
    return entry
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateArtistDto,
  ) {
    return (await this.artistService.update(id, dto))
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.artistService.remove(id)
  }
}
