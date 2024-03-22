import { IsUUID, IsNotEmpty, IsString, IsInt, IsPositive, ValidateIf } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class Track {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  id: string

  @ApiProperty({ example: 'The Show Must Go On' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ format: 'uuid', description: 'refers to Artist' })
  @ValidateIf((_, value) => value !== null)
  @IsUUID()
  @IsNotEmpty()
  artistId: string | null

  @ApiProperty({ format: 'uuid', description: 'refers to Album' })
  @ValidateIf((_, value) => value !== null)
  @IsUUID()
  @IsNotEmpty()
  albumId: string | null

  @ApiProperty({ example: 262, description: 'In seconds' })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  duration: number
}
