import { IsString, IsUUID, IsInt, IsPositive, IsNotEmpty, ValidateIf } from 'class-validator'

export class UpdateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  year: number

  @ValidateIf((_, value) => value !== null)
  @IsUUID()
  @IsNotEmpty()
  artistId: string | null
}
