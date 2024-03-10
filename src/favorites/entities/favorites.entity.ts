import { ApiProperty } from '@nestjs/swagger'

export class Favorites {
  @ApiProperty({ description: 'Favorite artists ids' })
  artists: string[]

  @ApiProperty({ description: 'Favorite albums ids' })
  albums: string[]

  @ApiProperty({ description: 'Favorite tracks ids' })
  tracks: string[]
}
