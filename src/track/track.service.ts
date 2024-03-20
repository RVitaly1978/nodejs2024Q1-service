import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'

import { CreateTrackDto } from './dto/create-track.dto'
import { UpdateTrackDto } from './dto/update-track.dto'
import { Track } from './entities/track.entity'

import { PrismaService } from '../prisma/prisma.service'

import { ErrorMessage } from '../types'

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTrackDto): Promise<Track> {
    await this.checkArtistAndAlbumExist(data.artistId, data.albumId)
    return await this.prisma.track.create({ data })
  }

  async getAllTracks(): Promise<Track[]> {
    return await this.prisma.track.findMany()
  }

  async getTrackById(id: string): Promise<Track> {
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
    if (artistId || albumId) {
      const res = await Promise.all([
        artistId && this.prisma.artist.findUnique({ where: { id: artistId } }),
        albumId && this.prisma.album.findUnique({ where: { id: albumId } }),
      ].filter(Boolean))
      if (artistId && !res[0]) {
        throw new BadRequestException(ErrorMessage.ArtistNotExist)
      }
      if (albumId && ((!artistId && !res[0]) || (artistId && !res[1]))) {
        throw new BadRequestException(ErrorMessage.AlbumNotExist)
      }
    }
  }
}
