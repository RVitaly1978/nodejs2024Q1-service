export enum ErrorMessage {
  UserNotExist = 'User not found.',
  UserAlreadyExist = 'A user with the requested login already exists.',
  PasswordNotCorrect = 'Password is not correct.',

  ArtistNotExist = 'Artist does not exist.',
  ArtistNotInFavorites = 'Artist not in favorites.',

  AlbumNotExist = 'Album does not exist.',
  AlbumNotInFavorites = 'Album not in favorites.',

  TrackNotExist = 'Track does not exist.',
  TrackNotInFavorites = 'Track not in favorites.',

  BadRequestParamDescription = 'Bad request. user id is invalid (not uuid)',
  BadRequestBodyDescription = 'Bad request. body does not contain required fields',
}

export enum SuccessMessage {
  AddTrackToFavorites = 'Track added to favorites.',
  AddAlbumToFavorites = 'Album added to favorites.',
  AddArtistToFavorites = 'Artist added to favorites.',
}
