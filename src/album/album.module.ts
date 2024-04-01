import { Module } from '@nestjs/common'

import { AlbumController } from './album.controller'
import { AlbumService } from './album.service'
import { PrismaModule } from '../prisma/prisma.module'
import { ArtistModule } from '../artist/artist.module'

@Module({
  imports: [PrismaModule, ArtistModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
