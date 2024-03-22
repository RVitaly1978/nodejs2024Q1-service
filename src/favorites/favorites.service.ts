import { Injectable, UnprocessableEntityException, NotFoundException } from '@nestjs/common'

import { FavoritesResponse } from './entities/favorites-response.entity'

import { PrismaService } from '../prisma/prisma.service'
import { ArtistService } from '../artist/artist.service'
import { AlbumService } from '../album/album.service'
import { TrackService } from '../track/track.service'

import { ErrorMessage } from '../types'

@Injectable()
export class FavoritesService {
  constructor(
    private prisma: PrismaService,
    private artistService: ArtistService,
    private albumService: AlbumService,
    private trackService: TrackService,
  ) {}

  async getFavorites(): Promise<FavoritesResponse> {
    const [artists, albums, tracks] = await Promise.all([
      this.prisma.favoriteArtist.findMany({ select: { artist: true } }),
      this.prisma.favoriteAlbum.findMany({ select: { album: true } }),
      this.prisma.favoriteTrack.findMany({ select: { track: true } }),
    ])
    return {
      artists: artists.map(({ artist }) => artist),
      albums:  albums.map(({ album }) => album),
      tracks: tracks.map(({ track }) => track)
    }
  }

  async addTrack(trackId: string) {
    try {
      await this.trackService.getOne(trackId)
      await this.prisma.favoriteTrack.create({
        data: { trackId },
        select: { track: true },
      })
    } catch {
      throw new UnprocessableEntityException(ErrorMessage.TrackNotExist)
    }
  }

  async removeTrack(trackId: string) {
    try {
      await this.prisma.favoriteTrack.delete({ where: { trackId } })
    } catch {
      throw new NotFoundException(ErrorMessage.TrackNotInFavorites)
    }
  }

  async addAlbum(albumId: string) {
    try {
      await this.albumService.getOne(albumId)
      await this.prisma.favoriteAlbum.create({
        data: { albumId },
        select: { album: true },
      })
    } catch {
      throw new UnprocessableEntityException(ErrorMessage.AlbumNotExist)
    }
  }

  async removeAlbum(albumId: string) {
    try {
      await this.prisma.favoriteAlbum.delete({ where: { albumId } })
    } catch {
      throw new NotFoundException(ErrorMessage.AlbumNotInFavorites)
    }
  }

  async addArtist(artistId: string) {
    try {
      await this.artistService.getOne(artistId)
      await this.prisma.favoriteArtist.create({
        data: { artistId },
        select: { artist: true },
      })
    } catch {
      throw new UnprocessableEntityException(ErrorMessage.ArtistNotExist)
    }
  }

  async removeArtist(artistId: string) {
    try {
      await this.prisma.favoriteArtist.delete({ where: { artistId } })
    } catch {
      throw new NotFoundException(ErrorMessage.ArtistNotInFavorites)
    }
  }
}
