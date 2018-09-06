export interface Song {
  id: string;
  source: string;
}

export interface Playlist {
  id: string;
  owner: string;
  songs: Array<Song>;
  current_song: Song;
}
