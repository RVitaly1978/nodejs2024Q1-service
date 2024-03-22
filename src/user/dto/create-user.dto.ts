import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ description: 'The user\'s login' })
  @IsString()
  @IsNotEmpty()
  login: string

  @ApiProperty({ description: 'The user\'s password' })
  @IsString()
  @IsNotEmpty()
  password: string
}
