import { Controller, Get, Post, Delete, Param, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { FavoritesService } from './favorites.service'

import { SuccessMessage } from '../types'

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  async getAllFavorites() {
    return (await this.favoritesService.getFavorites())
  }

  @Post('track/:id')
  async addTrack(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.addTrack(id)
    return {
      statusCode: HttpStatus.CREATED,
      message: SuccessMessage.AddTrackToFavorites,
    }
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.removeTrack(id)
  }

  @Post('album/:id')
  async addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.addAlbum(id)
    return {
      statusCode: HttpStatus.CREATED,
      message: SuccessMessage.AddAlbumToFavorites,
    }
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.removeAlbum(id)
  }

  @Post('artist/:id')
  async addArtist(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.addArtist(id)
    return {
      statusCode: HttpStatus.CREATED,
      message: SuccessMessage.AddArtistToFavorites,
    }
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.removeArtist(id)
  }
}
