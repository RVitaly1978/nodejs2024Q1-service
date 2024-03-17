import { Injectable, UnprocessableEntityException, NotFoundException } from '@nestjs/common'

import { FavoritesResponse } from './entities/favorites-response.entity'

import { PrismaService } from '../prisma/prisma.service'

import { ErrorMessage, FavoritesDb } from '../types'

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getFavoritesIds(): Promise<FavoritesDb> {
    return await this.prisma.favorites.findFirst()
  }

  async getFavorites(): Promise<FavoritesResponse> {
    const favorites = await this.getFavoritesIds()
    const [artists, albums, tracks] = await Promise.all([
      this.prisma.artist.findMany({
        where: { id: { in: favorites.artists } },
      }),
      this.prisma.album.findMany({
        where: { id: { in: favorites.albums } },
      }),
      this.prisma.track.findMany({
        where: { id: { in: favorites.tracks } },
      }),
    ])
    return { artists, albums, tracks }
  }

  async addTrack(id: string) {
    const entry = await this.prisma.track.findUnique({ where: { id } })
    if (!entry) {
      throw new UnprocessableEntityException(ErrorMessage.TrackNotExist)
    }
    const favorites = await this.getFavoritesIds()
    if (!favorites.tracks.includes(id)) {
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          tracks: { push: id },
        },
      })
    }
  }

  async removeTrack(id: string) {
    const favorites = await this.getFavoritesIds()
    const index = favorites.tracks.indexOf(id)
    if (index < 0) {
      throw new NotFoundException(ErrorMessage.TrackNotInFavorites)
    }
    favorites.tracks.splice(index, 1)
    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        tracks: { set: favorites.tracks },
      },
    })
  }

  async addAlbum(id: string) {
    const entry = await this.prisma.album.findUnique({ where: { id } })
    if (!entry) {
      throw new UnprocessableEntityException(ErrorMessage.AlbumNotExist)
    }
    const favorites = await this.getFavoritesIds()
    if (!favorites.albums.includes(id)) {
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          albums: { push: id },
        },
      })
    }
  }

  async removeAlbum(id: string) {
    const favorites = await this.getFavoritesIds()
    const index = favorites.albums.indexOf(id)
    if (index < 0) {
      throw new NotFoundException(ErrorMessage.AlbumNotInFavorites)
    }
    favorites.albums.splice(index, 1)
    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        albums: { set: favorites.albums },
      },
    })
  }

  async addArtist(id: string) {
    const entry = await this.prisma.artist.findUnique({ where: { id } })
    if (!entry) {
      throw new UnprocessableEntityException(ErrorMessage.ArtistNotExist)
    }
    const favorites = await this.getFavoritesIds()
    if (!favorites.artists.includes(id)) {
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          artists: { push: id },
        },
      })
    }
  }

  async removeArtist(id: string) {
    const favorites = await this.getFavoritesIds()
    const index = favorites.artists.indexOf(id)
    if (index < 0) {
      throw new NotFoundException(ErrorMessage.ArtistNotInFavorites)
    }
    favorites.artists.splice(index, 1)
    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        artists: { set: favorites.artists },
      },
    })
  }
}
