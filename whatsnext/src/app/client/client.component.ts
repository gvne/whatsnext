import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { API_URL } from '../constants';
import { Playlist, Song } from '../objects';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  private id: string;
  private video_id: string;
  private error_message: string;
  private success_message: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  appendVideo(video_id) {
    let future = this.http.post<Playlist>(
      API_URL + "/playlist/" + this.id + "/append",
      '{"youtube_id": "' + video_id + '"}'
    );

    future.subscribe(
      playlist => {
        this.success_message = "Successfuly appended !";
        setTimeout(() => { this.success_message = null; }, 5000);
      },
      error => {
        this.error_message = "Something went wrong...";
        setTimeout(() => { this.error_message = null; }, 5000);
      }
    );
  }
}
