import { v4 as uuidv4 } from 'uuid'
import { Injectable, NotFoundException } from '@nestjs/common'

import { CreateTrackDto } from './dto/create-track.dto'
import { UpdateTrackDto } from './dto/update-track.dto'
import { TrackDto } from './dto/track.dto'

import { ErrorMessage } from '../types'

@Injectable()
export class TrackService {
  private readonly tracks: TrackDto[] = []

  async create(track: CreateTrackDto) {
    const item = {
      ...track,
      id: uuidv4(),
    }
    this.tracks.push(item)
    return item
  }

  async getAllTracks() {
    return this.tracks
  }

  async getTrackById(id: string): Promise<TrackDto | undefined> {
    return this.tracks.find(item => item.id === id)
  }

  async update(id: string, dto: UpdateTrackDto) {
    const entry = await this.getTrackById(id)
    if (!entry) {
      throw new NotFoundException(ErrorMessage.TrackNotExist)
    }
    entry.name = dto.name
    entry.duration = dto.duration
    entry.artistId = dto.artistId
    entry.albumId = dto.albumId
    return entry
  }

  async remove(id: string) {
    const index = this.tracks.findIndex(item => item.id === id)
    if (index < 0) {
      throw new NotFoundException(ErrorMessage.TrackNotExist)
     }
    this.tracks.splice(index, 1)
    return id
  }
}
