import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { UserModule } from './user/user.module'
import { ArtistModule } from './artist/artist.module'
import { TrackModule } from './track/track.module'
import { AlbumModule } from './album/album.module'
import { FavoritesModule } from './favorites/favorites.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavoritesModule,
  ],
})
export class AppModule {}
