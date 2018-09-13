import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { Playlist, Song } from '../objects';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {
  private error_message: string;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
  }

  private createLobby() {
    let future = this.http.post<Playlist>(API_URL + "/playlist", null);
    future.subscribe(
      playlist => {
        this.router.navigateByUrl('/master/' + playlist.id);
      }
      error => {
        this.error_message = "Couldn't create a new lobby. Please try again later";
        setTimeout(() => { this.error_message = null; }, 5000);
      }
    );
  }

}
