import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpClientJsonpModule,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  SEARCH_AUTOCOMPLETE_API_URL,
  YOUTUBE_API_SEARCH_ENDPOINT,
  YOUTUBE_API_KEY
} from './constants';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http: HttpClient
  ) { }

  autocompleteSearchQuery(queryString): Observable<string[]> {
    let url = SEARCH_AUTOCOMPLETE_API_URL +
              "?hl=en" +
              "&ds=yt" +
              "&xhr=t" +
              "&client=youtube" +
              "&q=" + queryString;
    return this.http.jsonp(url, "callback")
      .pipe(
        map(response => {
          let retval: string[] = [];
          response[1].forEach(
            suggestion => {
              retval.push(suggestion[0]);
            }
          );
          return retval;
        })
      );
  }

  searchYoutube(queryString) {
    let queryParameters = new HttpParams()
      .set("key", YOUTUBE_API_KEY)
      .set("part", "snippet")
      .set("type", "video")
      // restrict to music see https://developers.google.com/youtube/v3/docs/videoCategories
      .set("videoCategoryId", "10")
      // only video that can be played outside of youtube
      .set("videoSyndicated", "true")
      .set("q", queryString);

    return this.http.get(YOUTUBE_API_SEARCH_ENDPOINT + "?" + queryParameters.toString())
      .pipe(
        map (
          result => {
            return result["items"];
          }
        )
      );
  }
}
