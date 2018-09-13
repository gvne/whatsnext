export interface Song {
  id: string;
  youtube_id: string;
}

export interface Playlist {
  id: string;
  owner: string;
  songs: Array<Song>;
  current_song: Song;
}
