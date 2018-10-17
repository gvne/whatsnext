import { Component, OnInit, Input } from '@angular/core';
import { PlaylistService } from '../playlist.service';

import { Playlist } from '../objects';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  @Input() playlist: Playlist = null;

  constructor(
    private playlistService: PlaylistService
  ) { }

  ngOnInit() {
  }

}
