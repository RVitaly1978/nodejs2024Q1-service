import { Module } from '@nestjs/common'
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'

import { UserModule } from './user/user.module'
import { ArtistModule } from './artist/artist.module'
import { TrackModule } from './track/track.module'
import { AlbumModule } from './album/album.module'
import { FavoritesModule } from './favorites/favorites.module'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { AppLoggerModule } from './logger/appLogger.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { LoggingInterceptor } from './interceptors/logging.interceptor'
import { AppExceptionsFilter } from './filters/appExceptions.filter'

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
    AppLoggerModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: AppExceptionsFilter },
  ],
})
export class AppModule {}
