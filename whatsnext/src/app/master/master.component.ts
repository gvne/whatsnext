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
  id: string;
  playlistDoesNotExist: boolean;

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
        console.log(playlist);
      }
      error => {
        if (error.status == 404) {
          this.playlistDoesNotExist = true;
        }
      });
  }
}
