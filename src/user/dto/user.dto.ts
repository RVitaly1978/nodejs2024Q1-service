import { Exclude } from 'class-transformer'

export class UserDto {
  id: string // uuid v4

  login: string

  @Exclude()
  password: string

  version: number // integer number, increments on update

  createdAt: number // timestamp of creation

  updatedAt: number // timestamp of last update

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial)
  }
}
