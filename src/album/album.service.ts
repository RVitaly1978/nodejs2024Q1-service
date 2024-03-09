import { v4 as uuidv4 } from 'uuid'
import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { Album } from './entities/album.entity'
import { CreateAlbumDto } from './dto/create-album.dto'
import { UpdateAlbumDto } from './dto/update-album.dto'

import { ArtistService } from '../artist/artist.service'
import { TrackService } from '../track/track.service'
import { FavoritesService } from '../favorites/favorites.service'

import { ErrorMessage } from '../types'

@Injectable()
export class AlbumService implements OnModuleInit {
  private readonly albums: Album[] = []
  private artistService: ArtistService
  private trackService: TrackService
  private favoritesService: FavoritesService

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.artistService = this.moduleRef.get(ArtistService, { strict: false })
    this.trackService = this.moduleRef.get(TrackService, { strict: false })
    this.favoritesService = this.moduleRef.get(FavoritesService, { strict: false })
  }

  async create(album: CreateAlbumDto) {
    if (album.artistId) {
      const entry = await this.artistService.getArtistById(album.artistId)
      if (!entry) {
        throw new BadRequestException(ErrorMessage.ArtistNotExist)
      }
    }
    const item = {
      ...album,
      id: uuidv4(),
    }
    this.albums.push(item)
    return item
  }

  async getAllAlbums() {
    return this.albums
  }

  async getAlbumById(id: string): Promise<Album | undefined> {
    return this.albums.find(item => item.id === id)
  }

  async update(id: string, dto: UpdateAlbumDto) {
    const entry = await this.getAlbumById(id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.AlbumNotExist)
    }
    entry.name = dto.name
    entry.year = dto.year
    entry.artistId = dto.artistId
    return entry
  }

  async remove(id: string) {
    const index = this.albums.findIndex(item => item.id === id)
    if (index < 0) {
      throw new NotFoundException(ErrorMessage.AlbumNotExist)
    }
    this.albums.splice(index, 1)
    await Promise.all([
      this.trackService.removeAlbum(id),
      this.favoritesService.removeAlbum(id, false),
    ])
    return id
  }

  async removeArtist(id: string) {
    const entries = this.albums.filter(item => item.artistId === id)
    entries.forEach(item => {
      item.artistId = null
    })
  }

  async getAlbumsByIds(ids: string[]) {
    return this.albums.filter(({ id }) => ids.includes(id))
  }
}
