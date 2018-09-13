import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { WINDOW } from '../window.provider';
import { API_URL } from '../constants';
import { Playlist, Song } from '../objects';


@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {
  player: YT.Player;
  private id: string;
  private video_id: string;
  private playlist_exists: boolean;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.playlist_exists = true;
    // every 5 seconds we query the API to update the interface
    this.updateInterface();
  }

  updateInterface() {
    console.log("Updating !");
    let future = this.http.get<Playlist>(API_URL + "/playlist/" + this.id);
    future.subscribe(
      playlist => {
        this.playlist_exists = true;
        // We obtained a playlist.
        if (playlist.current_song) {
          if (this.video_id !== playlist.current_song.youtube_id) {
            // Update the current song to the one obtained from the API if any
            this.setCurrentVideo(playlist.current_song.youtube_id);
          } else if (this.player.getPlayerState() === YT.PlayerState.ENDED) {
            // If current video is still the same and player has ended,
            // try to move to next song
            this.requestNext();
          }
        } else {
          // move to next song if we don't have any current song and the songs
          // list isn't empty
          if (playlist.songs && playlist.songs.length !== 0) {
            this.requestNext();
          }
        }
      },
      error => {
        if (error.status == 404) {
          this.playlist_exists = false;
        }
        // TODO: handle other errors
      },
      () => {
        // even if we get an error, we will retry in 10 seconds
        setTimeout(() => { this.updateInterface(); }, 10000);
      }
    );
  }

  requestNext() {
    // post to the next enpoint and set the current video from obtained result
    let future = this.http.post<Playlist>(
      API_URL + "/playlist/" + this.id + "/next", null);
    future.subscribe(
      playlist => {
        this.setCurrentVideo(playlist.current_song.youtube_id);
      }
    );
  }

  // -------------------------------
  // YoutubePlayer functions
  // -------------------------------
  setCurrentVideo(video_id) {
    // no need to update if the current id hasn't changed
    if (this.video_id === video_id) {
      return;
    }
    // if the player isn't initialzed yet
    if (!this.player) {
      console.log("Player isn't properly initialized. Waiting 1 second")
      // retry in one second !
      setTimeout(() => { this.setCurrentVideo(video_id); }, 1000);
      return;
    }
    // update !
    this.video_id = video_id;
    this.player.loadVideoById(this.video_id);
    this.player.playVideo();
  }

  savePlayer(player) {
    this.player = player;
  }

  onStateChange(event) {
    // event.data gives YT.PlayerState
    switch(event.data) {
      case YT.PlayerState.ENDED: {
        // Player ends means we need to move to the next song
        this.requestNext();
        break;
      }
      case YT.PlayerState.PLAYING: {
        break;
      }
      case YT.PlayerState.PAUSED: {
        break;
      }
      case YT.PlayerState.BUFFERING: {
        break;
      }
      case YT.PlayerState.CUED: {
        break;
      }
      default: {
        break;
      }
    }
  }
  // -------------------------------


}
