import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'

import { Album } from './entities/album.entity'
import { CreateAlbumDto } from './dto/create-album.dto'
import { UpdateAlbumDto } from './dto/update-album.dto'

import { PrismaService } from '../prisma/prisma.service'

import { ErrorMessage } from '../types'

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAlbumDto): Promise<Album> {
    await this.checkArtistExist(data.artistId)
    return await this.prisma.album.create({ data })
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

  async update(id: string, data: UpdateAlbumDto): Promise<Album> {
    try {
      return await this.prisma.album.update({ where: { id }, data })
    } catch {
      throw new NotFoundException(ErrorMessage.AlbumNotExist)
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.album.delete({ where: { id } })
      return id
    } catch (err) {
      throw new NotFoundException(ErrorMessage.AlbumNotExist)
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
