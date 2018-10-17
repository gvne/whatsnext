import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
import { PlaylistService } from './playlist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'whatsnext';

  constructor(
    private authService: AuthService,
    private playlistService: PlaylistService,
  ) {}

  ngOnInit() {
    this.authService.getOAuthToken().subscribe(
      token => {
        console.log("Token obtained !!");
        console.log(token);
      },
      error => {
        console.log("Couldn't get token...");
      }
    );
  }

  logout() {
    this.authService.logout();
  }
}
