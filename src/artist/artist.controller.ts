import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common'

import { FindOneParams } from '../dto/find-one-params.dto'
import { ArtistService } from './artist.service'
import { CreateArtistDto } from './dto/create-artist.dto'
import { UpdateArtistDto } from './dto/update-artist.dto'

import { ErrorMessage } from '../types'

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
  async getArtistById(@Param() params: FindOneParams) {
    const entry = await this.artistService.getArtistById(params.id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.ArtistNotExist)
    }
    return entry
  }

  @Put(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() dto: UpdateArtistDto,
  ) {
    return (await this.artistService.update(params.id, dto))
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() params: FindOneParams) {
    return (await this.artistService.remove(params.id))
  }
}
