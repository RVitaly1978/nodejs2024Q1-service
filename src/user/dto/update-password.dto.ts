import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePasswordDto {
  @ApiProperty({ description: 'The user\'s old password' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string

  @ApiProperty({ description: 'The user\'s new password' })
  @IsString()
  @IsNotEmpty()
  newPassword: string
}
