import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class TokensResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMzY4MTc3Zi1mNTg1LTRkYzgtYjcwYS1hMjhjYWQyNDVhZGYiLCJsb2dpbiI6InZpdGFseSIsImlhdCI6MTcxMTgwMDg1NywiZXhwIjoxNzExODA0NDU3fQ.J66D_Sq4c-Dq7WEqolyUoJOm3xyYvIqvPIDdck_Hw7I' })
  @IsString()
  @IsNotEmpty()
  accessToken: string

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMzY4MTc3Zi1mNTg1LTRkYzgtYjcwYS1hMjhjYWQyNDVhZGYiLCJsb2dpbiI6InZpdGFseSIsImlhdCI6MTcxMTgwMDg1NywiZXhwIjoxNzExODA0NDU3fQ.J66D_Sq4c-Dq7WEqolyUoJOm3xyYvIqvPIDdck_Hw7I' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}
