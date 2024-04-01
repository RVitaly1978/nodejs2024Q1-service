import { Module } from '@nestjs/common'

import { TrackController } from './track.controller'
import { TrackService } from './track.service'
import { PrismaModule } from '../prisma/prisma.module'
import { ArtistModule } from '../artist/artist.module'
import { AlbumModule } from '../album/album.module'

@Module({
  imports: [PrismaModule, ArtistModule, AlbumModule],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
