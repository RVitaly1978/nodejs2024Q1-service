import { ArtistDto as Artist } from '../../artist/dto/artist.dto'
import { AlbumDto as Album } from '../../album/dto/album.dto'
import { TrackDto as Track } from '../../track/dto/track.dto'

export class FavoritesResponseDto {
  artists: Artist[]
  albums: Album[]
  tracks: Track[]
}
