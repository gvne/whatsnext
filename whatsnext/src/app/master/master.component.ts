import { Component, OnInit, Input } from '@angular/core';

import { PlaylistService } from '../playlist.service';
import { storageKeys } from '../constants';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {
  private videoId: string;
  player: YT.Player;

  constructor(
    private playlistService: PlaylistService
  ) { }

  ngOnInit() { }

  createPlaylist() {
    this.playlistService.createPlaylist().subscribe(
      playlist => {
        this.startCurrentVideo();
      }
    );
  }

  private startCurrentVideo() {
    let currentVideo = this.playlistService.getCurrentVideo();
    console.log("Trying to start current video..." + currentVideo);
    // if no current video
    if (!currentVideo) {
      // retry in a second
      setTimeout(() => { this.startCurrentVideo(); }, 1000);
      return;
    }
    this.startVideo(currentVideo.youtube_id);
  }

  requestNext() {
    this.playlistService.moveToNextVideo().subscribe(
      song => { this.startVideo(song.youtube_id); }
    );
  }

  // -------------------------------
  // YoutubePlayer functions
  // -------------------------------
  startVideo(videoId) {
    console.log("Starting video " + videoId);
    if (this.videoId === videoId) {
      // no need to update if the current id hasn't changed
      return;
    }

    if (!this.player) {
      // if the player isn't initialzed yet
      console.log("Player isn't properly initialized. Waiting 1 second")
      // retry in one second !
      setTimeout(() => { this.startVideo(videoId); }, 1000);
      return;
    }

    // update !
    this.videoId = videoId;
    this.player.loadVideoById(this.videoId);
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
