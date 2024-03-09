import { v4 as uuidv4 } from 'uuid'
import { Injectable, NotFoundException } from '@nestjs/common'

import { AlbumDto } from './dto/album.dto'
import { CreateAlbumDto } from './dto/create-album.dto'
import { UpdateAlbumDto } from './dto/update-album.dto'

import { ErrorMessage } from '../types'

@Injectable()
export class AlbumService {
  private readonly albums: AlbumDto[] = []

  async create(album: CreateAlbumDto) {
    const item = {
      ...album,
      id: uuidv4(),
    }
    this.albums.push(item)
    return item
  }

  async getAllAlbums() {
    return this.albums
  }

  async getAlbumById(id: string): Promise<AlbumDto | undefined> {
    return this.albums.find(item => item.id === id)
  }

  async update(id: string, dto: UpdateAlbumDto) {
    const entry = await this.getAlbumById(id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.AlbumNotExist)
    }
    entry.name = dto.name
    entry.year = dto.year
    entry.artistId = dto.artistId
    return entry
  }

  async remove(id: string) { // TODO: track.albumId = null
    const index = this.albums.findIndex(item => item.id === id)
    if (index < 0) {
      throw new NotFoundException(ErrorMessage.AlbumNotExist)
     }
    this.albums.splice(index, 1)
    return id
  }
}
