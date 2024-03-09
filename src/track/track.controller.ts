import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { FindOneParams } from '../dto/find-one-params.dto'
import { TrackService } from './track.service'
import { CreateTrackDto } from './dto/create-track.dto'
import { UpdateTrackDto } from './dto/update-track.dto'

import { ErrorMessage } from '../types'

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  async getAllTracks() {
    return (await this.trackService.getAllTracks())
  }

  @Post()
  async create(@Body() dto: CreateTrackDto) {
    return (await this.trackService.create(dto))
  }

  @Get(':id')
  async getTrackById(@Param() params: FindOneParams) {
    const entry = await this.trackService.getTrackById(params.id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.TrackNotExist)
    }
    return entry
  }

  @Put(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() dto: UpdateTrackDto,
  ) {
    return (await this.trackService.update(params.id, dto))
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() params: FindOneParams) {
    await this.trackService.remove(params.id)
  }
}
