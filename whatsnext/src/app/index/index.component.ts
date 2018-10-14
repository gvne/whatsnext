import { Component, OnInit } from '@angular/core';

import { LobbyService } from '../lobby.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {
  // private createdLobbyId: string = null;
  private createdLobbyId: string = null;
  private joinedLobbyId: string = null;

  constructor(
    private lobbyService: LobbyService,
  ) {}

  ngOnInit() {
    if (localStorage.getItem('joinedLobbyId')) {
      this.joinLobby(localStorage.getItem('joinedLobbyId'));
    }
  }

  private createLobby() {
    let future = this.lobbyService.createLobby();
    future.subscribe(
      playlist => { this.createdLobbyId = playlist.id; },
      error => { }
    );
  }

  private joinLobby(lobbyId) {
    console.log(lobbyId);
    localStorage.setItem('joinedLobbyId', lobbyId);
    this.joinedLobbyId = lobbyId;
  }

}
