import { IsString, IsBoolean, IsNotEmpty } from 'class-validator'

export class UpdateArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean
}
