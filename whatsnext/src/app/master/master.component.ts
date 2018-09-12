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
  private playlistDoesNotExist: boolean;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    // every 5 seconds we query the API to update the interface
    this.updateInterface();
  }

  getClientURL() : string {
    return this.window.location.hostname + "/client/" + this.id;
  }

  updateInterface() {
    let future = this.http.get<Playlist>(API_URL + "/playlist/" + this.id);
    future.subscribe(
      playlist => {
        if (playlist.current_song) {
          updateCurrentVideo(playlist.current_song.id);
        }
        // restart another update in 10seconds
        setTimeout(() => { this.updateInterface(); }, 10000);
      }
      error => {
        if (error.status == 404) {
          this.playlistDoesNotExist = true;
        }
        // TODO: handle other errors
        // restart another update in 10seconds
        setTimeout(() => { this.updateInterface(); }, 10000);
      });
  }

  savePlayer(player) {
    this.player = player;
  }

  updateCurrentVideo(video_id) {
    // if the player isn't initialzed yet, just wait for the next update
    if (!this.player) {
      return;
    }
    // no need to update if the current id hasn't changed
    if (this.video_id === video_id) {
      return;
    }
    // update !
    this.video_id = video_id;
    this.player.loadVideoById(this.video_id);
    this.player.playVideo();
  }
}
