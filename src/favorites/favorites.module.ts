import { Module } from '@nestjs/common'

import { FavoritesController } from './favorites.controller'
import { FavoritesService } from './favorites.service'
import { PrismaModule } from '../prisma/prisma.module'
import { ArtistModule } from '../artist/artist.module'
import { AlbumModule } from '../album/album.module'
import { TrackModule } from '../track/track.module'

@Module({
  imports: [PrismaModule, ArtistModule, AlbumModule, TrackModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
