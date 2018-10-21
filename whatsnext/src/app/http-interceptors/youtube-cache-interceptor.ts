import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpCacheService } from '../http-cache.service';
import { YOUTUBE_VIDEO_DETAIL_ENDPOINT } from '../constants';

// We will cache only the queries to detail endpoint of the youtube API
// we do this quite often as we need to get details each time the playlist
// is updated
@Injectable()
export class YoutubeCacheInterceptor implements HttpInterceptor {
  constructor(
    private httpCacheService: HttpCacheService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    if (req.url === YOUTUBE_VIDEO_DETAIL_ENDPOINT) {
      // handle youtube detail api
      let cachedResponse = this.httpCacheService.get(req);
      if (cachedResponse) {
        return of(cachedResponse);
      }
      // this will send the request and store its result to cache
      return this.sendRequest(req, next);
    }
    // if not trying to find video detail, just return the regular request
    return next.handle(req);
  }

  private sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.httpCacheService.put(req, event);
        }
      })
    );
  }
}
