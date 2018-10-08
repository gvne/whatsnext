import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { API_URL } from './constants';
import { Playlist, Song } from './objects';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {
  constructor(
    private http: HttpClient
  ) { }

  createLobby(): Observable<Playlist> {
    return this.http.post<Playlist>(API_URL + "/playlist", null);
  }

  getCurrentVideo(lobbyId): Observable<Song> {
    let future = this.http.get<Playlist>(API_URL + "/playlist/" + lobbyId);
    return future.pipe(
      map((playlist: Playlist) => {
        if (playlist.current_song) {
          return playlist.current_song;
        }
        throw 'No current song found';
      })
    );
  }

  moveToNext(lobbyId): Observable<Song> {
    let future = this.http.post<Playlist>(
      API_URL + "/playlist/" + lobbyId + "/next", null);
    return future.pipe(
      map((playlist: Playlist) => {
        if (playlist.current_song) {
          return playlist.current_song;
        }
        throw 'No current song found';
      })
    );
  }

  appendVideoById(lobbyId, videoId): Observable<Playlist> {
    return this.http.post<Playlist>(
      API_URL + "/playlist/" + lobbyId + "/append",
      '{"youtube_id": "' + videoId + '"}'
    );
  }
}
