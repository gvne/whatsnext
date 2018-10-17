import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { switchMap, map } from 'rxjs/operators';
import { Observable, interval } from 'rxjs';

import { Playlist, Song } from './objects';
import { API_URL } from './constants';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private playlistId: string = null;
  playlist: Playlist = null;


  private refreshRateSeconds = 5000;

  constructor(
    private http: HttpClient
  ) {}

// ----------------------------------------------------------------------------
// Update Loop

  private updateLoopIsRunning: boolean = false;
  // function that will be called on update loop stop completion
  private stopUpdateLoopCompletionHandler: () => any = function() {};

  // Update the current reference to the playlist
  // This function is called by the update loop
  private update() {
    console.log("Updating current playlist ...");
    if (!this.playlistId) {
      return;
    }
    this.http.get<Playlist>(API_URL + "/playlist/" + this.playlistId).subscribe(
      playlist => {
        this.playlist = playlist;
      }
    );
  }

  // This function represents the update loop. It schedule itself to be re-run
  // once complete (and the loop is still running)
  private updateLoop() {
    this.update();

    if (!this.updateLoopIsRunning) {
      this.stopUpdateLoopCompletionHandler();
      return;
    }
    setTimeout(() => { this.updateLoop(); }, this.refreshRateSeconds);
  }

  private startUpdateLoop() {
    // don't start twice if already running
    if (this.updateLoopIsRunning) {
      return;
    }
    this.updateLoopIsRunning = true;
    this.updateLoop();
  }


  private stopUpdateLoop(): Observable<void> {
    return new Observable((observer) => {
      if (!this.updateLoopIsRunning) {
        observer.next();
        observer.complete();
      } else {
        // stop the update loop and trigger the observer completion when
        // the completion handler is called
        this.stopUpdateLoopCompletionHandler = function() {
          observer.next();
          observer.complete();
          this.stopUpdateLoopCompletionHandler = {};
        };
        this.updateLoopIsRunning = false;
      }
      return () => {};
    });
  }
// ----------------------------------------------------------------------------

  createPlaylist(): Observable<Playlist> {
    return this.stopUpdateLoop().pipe(
      switchMap(
        // When update loop is stopped
        () => {
          return this.http.post<Playlist>(API_URL + "/playlist", null).pipe(
            map(
              // when the playlist is created
              playlist => {
                this.connectToPlaylist(playlist.id);
                this.playlist = playlist;
                return playlist;
              }
            )
          )
        }
      )
    );
  }

  connectToPlaylist(playlistId) {
    this.playlistId = playlistId;
    // start the update loop
    this.startUpdateLoop();
  }

  appendVideo(videoId): Observable<Playlist> {
    return this.http.post<Playlist>(
      API_URL + "/playlist/" + this.playlistId + "/append",
      '{"youtube_id": "' + videoId + '"}'
    )
    .pipe(
      map(
        playlist => {
          this.playlist = playlist;
          return playlist;
        }
      )
    )
  }

  getCurrentVideo(): Song {
    return this.playlist.current_song;
  }

  moveToNextVideo(): Observable<Song> {
    // if we are currently at the end of the playlist
    if (this.currentSongIsLast()) {
      console.log("Current song is last...");
      // try again in a second
      return interval(1000).pipe(
        switchMap( () => { return this.moveToNextVideo(); } )
      )
    }

    return this.http.post<Playlist>(
      API_URL + "/playlist/" + this.playlistId + "/next", null)
    .pipe(
      map(
        playlist => {
          this.playlist = playlist;
          return playlist.current_song;
        }
      )
    );
  }

  // give the information whether the current video (returned by
  // getCurrentVideo) is the last in the list.
  private currentSongIsLast(): boolean {
    let songs =  this.playlist.songs;
    return songs[songs.length - 1].id === this.playlist.current_song.id;
  }
}
