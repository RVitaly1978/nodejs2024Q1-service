import { IsString, IsUUID, IsInt, IsPositive, IsNotEmpty, ValidateIf } from 'class-validator'

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  year: number

  @ValidateIf((_, value) => value !== null)
  @IsUUID()
  @IsNotEmpty()
  artistId: string | null
}
