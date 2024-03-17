import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'

import { Album } from './entities/album.entity'
import { CreateAlbumDto } from './dto/create-album.dto'
import { UpdateAlbumDto } from './dto/update-album.dto'

import { PrismaService } from '../prisma/prisma.service'

import { ErrorMessage } from '../types'

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(album: CreateAlbumDto): Promise<Album> {
    await this.checkArtistExist(album.artistId)
    return await this.prisma.album.create({ data: album })
  }

  async getAllAlbums(): Promise<Album[]> {
    return await this.prisma.album.findMany()
  }

  async getAlbumById(id: string): Promise<Album> {
    const entry = await this.prisma.album.findUnique({ where: { id } })
    if (!entry) {
      throw new NotFoundException(ErrorMessage.AlbumNotExist)
    }
    return entry
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    const entry = await this.getAlbumById(id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.AlbumNotExist)
    }
    return await this.prisma.album.update({
      where: { id },
      data: dto,
    })
  }

  async remove(id: string) {
    try {
      await this.prisma.album.delete({ where: { id } })
      await this.updateRelations(id)
      return id
    } catch (err) {
      throw new NotFoundException(ErrorMessage.AlbumNotExist)
    }
  }

  async updateRelations(id: string) {
    await Promise.all([
      this.prisma.track.updateMany({
        where: { albumId: id },
        data: { albumId: null },
      }),
      this.removeAlbumFromFavorites(id),
    ])
  }

  async removeAlbumFromFavorites(id: string) {
    const favorites = await this.prisma.favorites.findFirst()
    const index = favorites.albums.indexOf(id)
    if (index > -1) {
      favorites.albums.splice(index, 1)
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          albums: { set: favorites.albums },
        },
      })
    }
  }

  async checkArtistExist(id: string) {
    if (id) {
      const entry = await this.prisma.artist.findUnique({ where: { id } })
      if (!entry) {
        throw new BadRequestException(ErrorMessage.ArtistNotExist)
      }
    }
  }
}
