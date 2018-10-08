import { Component, OnInit, Input } from '@angular/core';

import { LobbyService } from '../lobby.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  @Input() lobbyId: string = null;

  private successMessage: string;
  private errorMessage: string;

  constructor(
    private lobbyService: LobbyService
  ) { }

  ngOnInit() {
  }

  appendVideo(videoId) {
    let future = this.lobbyService.appendVideoById(this.lobbyId, videoId);
    future.subscribe(
      playlist => {
        this.successMessage = "Successfuly appended !";
        setTimeout(() => { this.successMessage = null; }, 5000);
      },
      error => {
        this.errorMessage = "Something went wrong...";
        setTimeout(() => { this.errorMessage = null; }, 5000);
      }
    );
  }
}
