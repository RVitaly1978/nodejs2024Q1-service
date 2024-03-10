import { IsUUID, IsNotEmpty, IsString, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class Artist {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  id: string

  @ApiProperty({ example: 'Freddie Mercury' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean
}
