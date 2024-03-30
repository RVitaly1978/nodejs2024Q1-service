import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'

import { UserModule } from './user/user.module'
import { ArtistModule } from './artist/artist.module'
import { TrackModule } from './track/track.module'
import { AlbumModule } from './album/album.module'
import { FavoritesModule } from './favorites/favorites.module'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavoritesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
