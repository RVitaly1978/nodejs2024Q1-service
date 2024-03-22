import { IsUUID, IsNotEmpty, IsString, IsInt, IsPositive, ValidateIf } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class Album {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  id: string

  @ApiProperty({ example: 'Innuendo' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 1991 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  year: number

  @ApiProperty({ format: 'uuid', description: 'refers to Artist' })
  @ValidateIf((_, value) => value !== null)
  @IsUUID()
  @IsNotEmpty()
  artistId: string | null
}
