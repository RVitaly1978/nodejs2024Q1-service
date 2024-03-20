import { Injectable, NotFoundException } from '@nestjs/common'

import { Artist } from './entities/artist.entity'
import { CreateArtistDto } from './dto/create-artist.dto'
import { UpdateArtistDto } from './dto/update-artist.dto'

import { PrismaService } from '../prisma/prisma.service'

import { ErrorMessage } from '../types'

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateArtistDto): Promise<Artist> {
    return await this.prisma.artist.create({ data })
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

  async update(id: string, data: UpdateArtistDto): Promise<Artist> {
    try {
      return await this.prisma.artist.update({ where: { id }, data })
    } catch {
      throw new NotFoundException(ErrorMessage.ArtistNotExist)
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.artist.delete({ where: { id } })
      return id
    } catch (err) {
      throw new NotFoundException(ErrorMessage.ArtistNotExist)
    }
  }
}
