import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { Playlist, Song } from '../objects';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
  }

  private createLobby() {
    this.http.post<Playlist>(API_URL + "/playlist", null).subscribe(playlist => {
      console.log(playlist);
    });
  }

}
