import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { PlaylistService } from '../playlist.service';
import { SearchService } from '../search.service';
import { storageKeys } from '../constants';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  private playlistIdForm: FormControl;
  private searchResult: Array<Object>;

  constructor(
    private playlistService: PlaylistService,
    private searchService: SearchService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.playlistIdForm =  new FormControl('');
  }

  joinPlaylist() {
    this.playlistService.connectToPlaylist(this.playlistIdForm.value);
  }

  appendVideo(videoId) {
    let future = this.playlistService.appendVideo(videoId);
    future.subscribe(
      playlist => {
        this.snackBar.open("Successfuly appended !");
      },
      error => {
        this.snackBar.open("Something went wrong...");
      }
    );
  }

  onSearch(query) {
    this.searchService.searchYoutube((query)).subscribe(
      results => { this.searchResult = results; }
    );
  }
}
