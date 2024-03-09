import { v4 as uuidv4 } from 'uuid'
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { ArtistDto } from './dto/artist.dto'
import { CreateArtistDto } from './dto/create-artist.dto'
import { UpdateArtistDto } from './dto/update-artist.dto'

import { TrackService } from '../track/track.service'
import { AlbumService } from '../album/album.service'
import { FavoritesService } from '../favorites/favorites.service'

import { ErrorMessage } from '../types'

@Injectable()
export class ArtistService implements OnModuleInit {
  private readonly artists: ArtistDto[] = []
  private albumService: AlbumService
  private trackService: TrackService
  private favoritesService: FavoritesService

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.albumService = this.moduleRef.get(AlbumService, { strict: false })
    this.trackService = this.moduleRef.get(TrackService, { strict: false })
    this.favoritesService = this.moduleRef.get(FavoritesService, { strict: false })
  }

  async create(artist: CreateArtistDto): Promise<ArtistDto> {
    const item = {
      ...artist,
      id: uuidv4(),
    }
    this.artists.push(item)
    return item
  }

  async getAllArtists() {
    return this.artists
  }

  async getArtistById(id: string): Promise<ArtistDto | undefined> {
    return this.artists.find(item => item.id === id)
  }

  async update(id: string, dto: UpdateArtistDto) {
    const entry = await this.getArtistById(id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.ArtistNotExist)
    }
    entry.name = dto.name
    entry.grammy = dto.grammy
    return entry
  }

  async remove(id: string) {
    const index = this.artists.findIndex(item => item.id === id)
    if (index < 0) {
      throw new NotFoundException(ErrorMessage.ArtistNotExist)
    }
    this.artists.splice(index, 1)
    await Promise.all([
      this.albumService.removeArtist(id),
      this.trackService.removeArtist(id),
      this.favoritesService.removeArtist(id, false),
    ])
    return id
  }

  async getArtistsByIds(ids: string[]) {
    return this.artists.filter(({ id }) => ids.includes(id))
  }
}
