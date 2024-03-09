import { v4 as uuidv4 } from 'uuid'
import { Injectable, NotFoundException } from '@nestjs/common'

import { ArtistDto } from './dto/artist.dto'
import { CreateArtistDto } from './dto/create-artist.dto'
import { UpdateArtistDto } from './dto/update-artist.dto'

import { ErrorMessage } from '../types'

@Injectable()
export class ArtistService {
  private readonly artists: ArtistDto[] = []

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

  async remove(id: string) { // TODO: album.artistId to null, track.artistId to null
    const index = this.artists.findIndex(item => item.id === id)
    if (index < 0) {
      throw new NotFoundException(ErrorMessage.ArtistNotExist)
     }
    this.artists.splice(index, 1)
    return id
  }
}
