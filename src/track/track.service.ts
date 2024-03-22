import { v4 as uuidv4 } from 'uuid'
import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { CreateTrackDto } from './dto/create-track.dto'
import { UpdateTrackDto } from './dto/update-track.dto'
import { Track } from './entities/track.entity'

import { ArtistService } from '../artist/artist.service'
import { AlbumService } from '../album/album.service'
import { FavoritesService } from '../favorites/favorites.service'

import { ErrorMessage } from '../types'

@Injectable()
export class TrackService implements OnModuleInit {
  private readonly tracks: Track[] = []
  private artistService: ArtistService
  private albumService: AlbumService
  private favoritesService: FavoritesService

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.artistService = this.moduleRef.get(ArtistService, { strict: false })
    this.albumService = this.moduleRef.get(AlbumService, { strict: false })
    this.favoritesService = this.moduleRef.get(FavoritesService, { strict: false })
  }

  async create(track: CreateTrackDto) {
    if (track.artistId || track.albumId) {
      const res = await Promise.all([
        track.artistId && this.artistService.getArtistById(track.artistId),
        track.albumId && this.albumService.getAlbumById(track.albumId),
      ].filter(Boolean))
      if (track.artistId && !res[0]) {
        throw new BadRequestException(ErrorMessage.ArtistNotExist)
      }
      if (track.albumId && ((!track.artistId && !res[0]) || (track.artistId && !res[1]))) {
        throw new BadRequestException(ErrorMessage.AlbumNotExist)
      }
    }
    const item = {
      ...track,
      id: uuidv4(),
    }
    this.tracks.push(item)
    return item
  }

  async getAllTracks() {
    return this.tracks
  }

  async getTrackById(id: string): Promise<Track | undefined> {
    return this.tracks.find((item) => item.id === id)
  }

  async update(id: string, dto: UpdateTrackDto) {
    const entry = await this.getTrackById(id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.TrackNotExist)
    }
    entry.name = dto.name
    entry.duration = dto.duration
    entry.artistId = dto.artistId
    entry.albumId = dto.albumId
    return entry
  }

  async remove(id: string) {
    const index = this.tracks.findIndex((item) => item.id === id)
    if (index < 0) {
      throw new NotFoundException(ErrorMessage.TrackNotExist)
    }
    this.tracks.splice(index, 1)
    await this.favoritesService.removeTrack(id, false)
    return id
  }

  async removeAlbum(id: string) {
    const entries = this.tracks.filter((item) => item.albumId === id)
    entries.forEach((item) => {
      item.albumId = null
    })
  }

  async removeArtist(id: string) {
    const entries = this.tracks.filter((item) => item.artistId === id)
    entries.forEach((item) => {
      item.artistId = null
    })
  }

  async getTracksByIds(ids: string[]) {
    return this.tracks.filter(({ id }) => ids.includes(id))
  }
}
