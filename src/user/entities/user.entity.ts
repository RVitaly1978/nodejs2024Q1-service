import { Exclude } from 'class-transformer'
import { ApiHideProperty } from '@nestjs/swagger'

export class User {
  id: string // uuid v4

  login: string

  @ApiHideProperty()
  @Exclude()
  password: string

  version: number // integer number, increments on update

  createdAt: number // timestamp of creation

  updatedAt: number // timestamp of last update

  constructor(partial: Partial<User>) {
    Object.assign(this, partial)
  }
}
