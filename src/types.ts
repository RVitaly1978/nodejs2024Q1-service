export enum ErrorMessage {
  UserNotExist = 'User not found.',
  UserAlreadyExist = 'A user with the requested login already exists.',
  PasswordNotCorrect = 'Password is not correct.',

  ArtistNotExist = 'Artist not found.',
  ArtistNotInFavorites = 'Artist not in favorites.',

  AlbumNotExist = 'Album not found.',
  AlbumNotInFavorites = 'Album not in favorites.',

  TrackNotExist = 'Track not found.',
  TrackNotInFavorites = 'Track not in favorites.',

  BadRequestParamDescription = 'Bad request. Param **id** is invalid (not uuid)',
  BadRequestBodyDescription = 'Bad request. **body** does not contain required fields',

  UnauthorizedDescription = 'Unauthorized. Credentials is not valid.',
  ForbiddenDescription = 'Forbidden. Credentials is not valid.',

  UnauthorizedRefreshTokenDescription = 'Unauthorized. There is no refreshToken in body.',
  ForbiddenRefreshTokenDescription = 'Forbidden. Refresh token is invalid or expired.',

  InternalServerError = 'Internal server error.'
}

export enum SuccessMessage {
  AddTrackToFavorites = 'Track added to favorites.',
  AddAlbumToFavorites = 'Album added to favorites.',
  AddArtistToFavorites = 'Artist added to favorites.',
}

export type UserDb = {
  id: string
  login: string
  password: string
  version: number
  createdAt: Date
  updatedAt: Date
}

export type JWTTokenPayload = {
  id: string
  login: string
}
