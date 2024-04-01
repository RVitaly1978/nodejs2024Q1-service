import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger'

import { TrackService } from './track.service'
import { CreateTrackDto } from './dto/create-track.dto'
import { UpdateTrackDto } from './dto/update-track.dto'

import { ErrorMessage } from '../types'

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @ApiOperation({ summary: 'Get tracks list', description: 'Gets all library tracks list' })
  @Get()
  async getAll() {
    return await this.trackService.getAll()
  }

  @ApiOperation({ summary: 'Add new track', description: 'Add new track information' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestBodyDescription })
  @Post()
  async create(@Body() dto: CreateTrackDto) {
    return await this.trackService.create(dto)
  }

  @ApiOperation({ summary: 'Get single track by id', description: 'Get single track by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.TrackNotExist })
  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.trackService.getOne(id)
  }

  @ApiOperation({ summary: 'Update track information', description: 'Update library track information by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.TrackNotExist })
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTrackDto,
  ) {
    return await this.trackService.update(id, dto)
  }

  @ApiOperation({ summary: 'Delete track', description: 'Delete track from library' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.TrackNotExist })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.trackService.remove(id)
  }
}
