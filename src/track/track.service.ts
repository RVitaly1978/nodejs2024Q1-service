import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'

import { CreateTrackDto } from './dto/create-track.dto'
import { UpdateTrackDto } from './dto/update-track.dto'
import { Track } from './entities/track.entity'

import { PrismaService } from '../prisma/prisma.service'
import { ArtistService } from '../artist/artist.service'
import { AlbumService } from '../album/album.service'

import { ErrorMessage } from '../types'

@Injectable()
export class TrackService {
  constructor(
    private prisma: PrismaService,
    private artistService: ArtistService,
    private albumService: AlbumService,
  ) {}

  async create(data: CreateTrackDto): Promise<Track> {
    await this.checkArtistAndAlbumExist(data.artistId, data.albumId)
    return await this.prisma.track.create({ data })
  }

  async getAll(): Promise<Track[]> {
    return await this.prisma.track.findMany()
  }

  async getOne(id: string): Promise<Track> {
    const entry = await this.prisma.track.findUnique({ where: { id } })
    if (!entry) {
      throw new NotFoundException(ErrorMessage.TrackNotExist)
    }
    return entry
  }

  async update(id: string, data: UpdateTrackDto): Promise<Track> {
    try {
      return await this.prisma.track.update({ where: { id }, data })
    } catch {
      throw new NotFoundException(ErrorMessage.TrackNotExist)
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.track.delete({ where: { id } })
      return id
    } catch (err) {
      throw new NotFoundException(ErrorMessage.TrackNotExist)
    }
  }

  async checkArtistAndAlbumExist(artistId: string, albumId: string) {
    await Promise.all([
      this.checkArtistExist(artistId),
      this.checkAlbumExist(albumId),
    ])
  }

  async checkArtistExist(id: string | null) {
    if (id) {
      try {
        await this.artistService.getOne(id)
      } catch {
        throw new BadRequestException(ErrorMessage.ArtistNotExist)
      }
    }
  }

  async checkAlbumExist(id: string | null) {
    if (id) {
      try {
        await this.albumService.getOne(id)
      } catch {
        throw new BadRequestException(ErrorMessage.AlbumNotExist)
      }
    }
  }
}
