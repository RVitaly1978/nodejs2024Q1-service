import { IsString, IsUUID, IsInt, IsPositive, IsNotEmpty, ValidateIf } from 'class-validator'

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @ValidateIf((_, value) => value !== null)
  @IsUUID()
  @IsNotEmpty()
  artistId: string | null

  @ValidateIf((_, value) => value !== null)
  @IsUUID()
  @IsNotEmpty()
  albumId: string | null

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  duration: number
}
