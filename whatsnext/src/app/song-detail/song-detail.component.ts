import { Component, OnChanges, Input } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Song } from '../objects';
import { YOUTUBE_VIDEO_DETAIL_ENDPOINT } from '../constants';
import { YOUTUBE_API_KEY } from '../keys';

export interface VideoThumbnail {
  url: string,
  height: number,
  width: number
};
export interface VideoLocalized {
  title: string;
  description: string;
}
export interface VideoThumbnails {
  default: VideoThumbnail;
}
export interface VideoSnippet {
  localized: VideoLocalized;
  thumbnails: VideoThumbnails;
}
export interface VideoDetail {
  snippet: VideoSnippet;
}
export interface VideoDetailList {
  items: Array<VideoDetail>;
}


@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.css']
})
export class SongDetailComponent implements OnChanges {
  @Input() song: Song = null;

  private title: string = "title";
  private description: string = null;
  private thumbnail: VideoThumbnail = null;

  constructor(
    private http: HttpClient
  ) { }

  ngOnChanges() {
    let queryParameters = new HttpParams()
      .set("key", YOUTUBE_API_KEY)
      .set("part", "snippet")
      .set("id", this.song.youtube_id);

    this.http.get<VideoDetailList>(
      YOUTUBE_VIDEO_DETAIL_ENDPOINT,
      { params: queryParameters })
    .subscribe(
        result => {
          // nothing could be retreived
          if (!result.items) {
            return;
          }
          let content = result.items[0].snippet;
          this.title = content.localized.title;
          this.description = content.localized.description;
          this.thumbnail = content.thumbnails.default;
        }
    );
  }


}
