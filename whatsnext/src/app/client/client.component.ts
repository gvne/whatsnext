import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { LobbyService } from '../lobby.service';
import { SearchService } from '../search.service';
import { storageKeys } from '../constants';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  private lobbyId: string = null;

  private successMessage: string;
  private errorMessage: string;

  private lobbyIdForm: FormControl;
  private searchResult: Array<Object>;

  constructor(
    private lobbyService: LobbyService,
    private searchService: SearchService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.lobbyIdForm =  new FormControl('');

    // use the previously set lobby Id
    let previousLobbyId = localStorage.getItem(storageKeys.clientLobbyId);
    if (previousLobbyId) {
      this.lobbyId = previousLobbyId;
      this.lobbyIdForm.setValue(this.lobbyId);
    }
  }

  joinLobby() {
    localStorage.setItem(storageKeys.clientLobbyId, this.lobbyIdForm.value);
    this.lobbyId = this.lobbyIdForm.value;
  }

  appendVideo(videoId) {
    if (!this.lobbyId) {
      return;
    }
    let future = this.lobbyService.appendVideoById(this.lobbyId, videoId);
    future.subscribe(
      playlist => {
        this.snackBar.open("Successfuly appended !");
        setTimeout(() => { this.successMessage = null; }, 5000);
      },
      error => {
        this.snackBar.open("Something went wrong...");
        setTimeout(() => { this.errorMessage = null; }, 5000);
      }
    );
  }

  onSearch(query) {
    this.searchService.searchYoutube((query)).subscribe(
      results => { this.searchResult = results; }
    );
  }
}
