import { Exclude } from 'class-transformer'
import { IsUUID, IsNotEmpty, IsString, IsInt } from 'class-validator'
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger'

import { UserDb } from '../../types'

export class User {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  id: string

  @ApiProperty({ example: 'TestUser' })
  @IsString()
  @IsNotEmpty()
  login: string

  @ApiHideProperty()
  @Exclude()
  password: string

  @ApiProperty({ example: 1, description: 'increments on update' })
  @IsInt()
  @IsNotEmpty()
  version: number

  @ApiProperty({ example: 1655000000, description: 'timestamp of creation' })
  @IsInt()
  @IsNotEmpty()
  createdAt: number

  @ApiProperty({ example: 1655000000, description: 'timestamp of last update' })
  @IsInt()
  @IsNotEmpty()
  updatedAt: number

  constructor(partial: Partial<UserDb>) {
    Object.assign(this, {
      ...partial,
      createdAt: new Date(partial.createdAt).getTime(),
      updatedAt: new Date(partial.updatedAt).getTime(),
    })
  }
}
