import { Component, OnInit, Input } from '@angular/core';

import { LobbyService } from '../lobby.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {
  @Input() lobbyId: string;

  private videoId: string;
  private playlistExists: boolean = true;
  player: YT.Player;

  constructor(
    private lobbyService: LobbyService
  ) { }

  ngOnInit() {
    // every 5 seconds we query the API to update the interface
    this.updateInterface();
  }

  updateInterface() {
    console.log("updating the interface !");
    let future = this.lobbyService.getCurrentVideo(this.lobbyId);
    future.subscribe(
      song => {
        this.setCurrentSong(song);
        this.scheduleNextUpdate();
      },
      error => {
        this.requestNext();
        this.scheduleNextUpdate();
      }
    );
  }

  scheduleNextUpdate() {
    setTimeout(() => { this.updateInterface(); }, 10000);
  }

  setCurrentSong(song) {
    if (this.videoId !== song.youtube_id) {
      // if the current video changed, update it
      this.startVideo(song.youtube_id);
    } else if (this.player.getPlayerState() === YT.PlayerState.ENDED) {
      // If current video is still the same but the player has ended, we are in
      // the case of the end of a song. We will ask for another one until one
      // is available.
      this.requestNext();
    }
  }

  requestNext() {
    // post to the next enpoint and set the current video from obtained result
    this.lobbyService.moveToNext(this.lobbyId).subscribe(
      song => {},
      error => {}
    );
  }

  // -------------------------------
  // YoutubePlayer functions
  // -------------------------------
  startVideo(videoId) {
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
