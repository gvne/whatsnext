import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface Thumbnail {
  url: string,
  height: number,
  width: number
};

export interface Snippet {
  title: string,
  description: string
};

@Component({
  selector: 'app-youtube-video-detail',
  templateUrl: './youtube-video-detail.component.html',
  styleUrls: ['./youtube-video-detail.component.css']
})
export class YoutubeVideoDetailComponent implements OnInit {
  @Input() video: Object = null;
  @Output() selected = new EventEmitter<string>();

  private thumbnail: Thumbnail;
  private id: string;
  private snippet: Snippet;

  constructor() { }

  ngOnInit() {
    this.thumbnail = this.video["snippet"]["thumbnails"]["default"];
    this.id = this.video["id"]["videoId"];
    this.snippet = this.video["snippet"];
  }

  clicked() {
    this.selected.emit(this.id);
  }
}
