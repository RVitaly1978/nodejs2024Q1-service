import { Controller, Get, Post, Delete, Param, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger'

import { FavoritesService } from './favorites.service'

import { SuccessMessage, ErrorMessage } from '../types'

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @ApiOperation({ summary: 'Get all favorites', description: 'Gets all favorites artists, albums and tracks' })
  @Get()
  async getAllFavorites() {
    return (await this.favoritesService.getFavorites())
  }

  @ApiOperation({ summary: 'Add track to the favorites', description: 'Add track to the favorites' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiUnprocessableEntityResponse({ description: ErrorMessage.TrackNotExist })
  @Post('track/:id')
  async addTrack(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.addTrack(id)
    return {
      statusCode: HttpStatus.CREATED,
      message: SuccessMessage.AddTrackToFavorites,
    }
  }

  @ApiOperation({ summary: 'Delete track from favorites', description: 'Delete track from favorites' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.TrackNotInFavorites })
  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.removeTrack(id)
  }

  @ApiOperation({ summary: 'Add album to the favorites', description: 'Add album to the favorites' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiUnprocessableEntityResponse({ description: ErrorMessage.AlbumNotExist })
  @Post('album/:id')
  async addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.addAlbum(id)
    return {
      statusCode: HttpStatus.CREATED,
      message: SuccessMessage.AddAlbumToFavorites,
    }
  }

  @ApiOperation({ summary: 'Delete album from favorites', description: 'Delete album from favorites' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.AlbumNotInFavorites })
  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.removeAlbum(id)
  }

  @ApiOperation({ summary: 'Add artist to the favorites', description: 'Add artist to the favorites' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiUnprocessableEntityResponse({ description: ErrorMessage.ArtistNotExist })
  @Post('artist/:id')
  async addArtist(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.addArtist(id)
    return {
      statusCode: HttpStatus.CREATED,
      message: SuccessMessage.AddArtistToFavorites,
    }
  }

  @ApiOperation({ summary: 'Delete artist from favorites', description: 'Delete artist from favorites' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBadRequestResponse({ description: ErrorMessage.BadRequestParamDescription })
  @ApiNotFoundResponse({ description: ErrorMessage.ArtistNotInFavorites })
  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.removeArtist(id)
  }
}
