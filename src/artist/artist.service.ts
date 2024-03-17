import { Injectable, NotFoundException } from '@nestjs/common'

import { Artist } from './entities/artist.entity'
import { CreateArtistDto } from './dto/create-artist.dto'
import { UpdateArtistDto } from './dto/update-artist.dto'

import { PrismaService } from '../prisma/prisma.service'

import { ErrorMessage } from '../types'

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(artist: CreateArtistDto): Promise<Artist> {
    return await this.prisma.artist.create({ data: artist })
  }

  async getAllArtists(): Promise<Artist[]> {
    return await this.prisma.artist.findMany()
  }

  async getArtistById(id: string): Promise<Artist> {
    const entry = await this.prisma.artist.findUnique({ where: { id } })
    if (!entry) {
      throw new NotFoundException(ErrorMessage.ArtistNotExist)
    }
    return entry
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    const entry = await this.getArtistById(id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.ArtistNotExist)
    }
    return await this.prisma.artist.update({
      where: { id },
      data: dto,
    })
  }

  async remove(id: string) {
    try {
      await this.prisma.artist.delete({ where: { id } })
      await this.updateRelations(id)
      return id
    } catch (err) {
      throw new NotFoundException(ErrorMessage.ArtistNotExist)
    }
  }

  async updateRelations(id: string) {
    await Promise.all([
      this.prisma.album.updateMany({
        where: { artistId: id },
        data: { artistId: null },
      }),
      this.prisma.track.updateMany({
        where: { artistId: id },
        data: { artistId: null },
      }),
      this.removeArtistFromFavorites(id)
    ])
  }

  async removeArtistFromFavorites(id: string) {
    const favorites = await this.prisma.favorites.findFirst()
    const index = favorites.artists.indexOf(id)
    if (index > -1) {
      favorites.artists.splice(index, 1)
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          artists: { set: favorites.artists },
        },
      })
    }
  }
}
