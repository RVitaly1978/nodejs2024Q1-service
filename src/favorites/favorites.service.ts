import { Injectable, UnprocessableEntityException, NotFoundException, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { FavoritesDto } from './dto/favorites.dto'
import { FavoritesResponseDto } from './dto/favorites-response.dto'

import { TrackService } from '../track/track.service'
import { AlbumService } from '../album/album.service'
import { ArtistService } from '../artist/artist.service'

import { ErrorMessage } from '../types'

@Injectable()
export class FavoritesService implements OnModuleInit {
  private readonly favorites: FavoritesDto = {
    artists: [],
    albums: [],
    tracks: [],
  }
  private artistService: ArtistService
  private albumService: AlbumService
  private trackService: TrackService

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.artistService = this.moduleRef.get(ArtistService, { strict: false })
    this.albumService = this.moduleRef.get(AlbumService, { strict: false })
    this.trackService = this.moduleRef.get(TrackService, { strict: false })
  }

  async getFavorites() {
    const [artists, albums, tracks] = await Promise.all([
      this.artistService.getArtistsByIds(this.favorites.artists),
      this.albumService.getAlbumsByIds(this.favorites.albums),
      this.trackService.getTracksByIds(this.favorites.tracks),
    ])
    return {
      artists,
      albums,
      tracks,
    } as FavoritesResponseDto
  }

  async addTrack(id: string) {
    const entry = await this.trackService.getTrackById(id)
    if (!entry) {
      throw new UnprocessableEntityException(ErrorMessage.TrackNotExist)
    }
    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id)
    }
  }

  async removeTrack(id: string, throwException: boolean = true) {
    const index = this.favorites.tracks.findIndex(item => item === id)
    if (index < 0) {
      if (!throwException) { return }
      throw new NotFoundException(ErrorMessage.TrackNotInFavorites)
    }
    this.favorites.tracks.splice(index, 1)
  }

  async addAlbum(id: string) {
    const entry = await this.albumService.getAlbumById(id)
    if (!entry) {
      throw new UnprocessableEntityException(ErrorMessage.AlbumNotExist)
    }
    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id)
    }
  }

  async removeAlbum(id: string, throwException: boolean = true) {
    const index = this.favorites.albums.findIndex(item => item === id)
    if (index < 0) {
      if (!throwException) { return }
      throw new NotFoundException(ErrorMessage.AlbumNotInFavorites)
    }
    this.favorites.albums.splice(index, 1)
  }

  async addArtist(id: string) {
    const entry = await this.artistService.getArtistById(id)
    if (!entry) {
      throw new UnprocessableEntityException(ErrorMessage.ArtistNotExist)
    }
    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id)
    }
  }

  async removeArtist(id: string, throwException: boolean = true) {
    const index = this.favorites.artists.findIndex(item => item === id)
    if (index < 0) {
      if (!throwException) { return }
      throw new NotFoundException(ErrorMessage.ArtistNotInFavorites)
    }
    this.favorites.artists.splice(index, 1)
  }
}
