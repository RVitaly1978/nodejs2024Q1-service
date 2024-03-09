import { Controller, Get, Post, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common'

import { FindOneParams } from '../dto/find-one-params.dto'
import { FavoritesService } from './favorites.service'

import { SuccessMessage } from '../types'

@Controller('favs')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  async getAllFavorites() {
    return (await this.favoritesService.getFavorites())
  }

  @Post('track/:id')
  async addTrack(@Param() params: FindOneParams) {
    await this.favoritesService.addTrack(params.id)
    return SuccessMessage.AddTrackToFavorites
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param() params: FindOneParams) {
    await this.favoritesService.removeTrack(params.id)
  }

  @Post('album/:id')
  async addAlbum(@Param() params: FindOneParams) {
    await this.favoritesService.addAlbum(params.id)
    return SuccessMessage.AddAlbumToFavorites
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param() params: FindOneParams) {
    await this.favoritesService.removeAlbum(params.id)
  }

  @Post('artist/:id')
  async addArtist(@Param() params: FindOneParams) {
    await this.favoritesService.addArtist(params.id)
    return SuccessMessage.AddArtistToFavorites
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param() params: FindOneParams) {
    await this.favoritesService.removeArtist(params.id)
  }
}
