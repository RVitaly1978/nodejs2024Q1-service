import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger'

import { ArtistService } from './artist.service'
import { CreateArtistDto } from './dto/create-artist.dto'
import { UpdateArtistDto } from './dto/update-artist.dto'

import { ErrorMessage } from '../types'

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @ApiOperation({ summary: 'Get all artists', description: 'Gets all artists' })
  @Get()
  async getAllArtists() {
    return await this.artistService.getAllArtists()
  }

  @ApiOperation({ summary: 'Add new artist', description: 'Add new artist' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestBodyDescription })
  @Post()
  async create(@Body() dto: CreateArtistDto) {
    return await this.artistService.create(dto)
  }

  @ApiOperation({ summary: 'Get single artist by id', description: 'Get single artist by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.ArtistNotExist })
  @Get(':id')
  async getArtistById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.artistService.getArtistById(id)
  }

  @ApiOperation({ summary: 'Update artist information', description: 'Update artist information by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.ArtistNotExist })
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateArtistDto,
  ) {
    return await this.artistService.update(id, dto)
  }

  @ApiOperation({ summary: 'Delete artist', description: 'Delete artist from library' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.ArtistNotExist })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.artistService.remove(id)
  }
}
