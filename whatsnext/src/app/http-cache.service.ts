import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService  {
  cache = new Map();

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const cached = this.cache.get(req.urlWithParams);
    if (!cached) {
      return undefined;
    }
    return cached;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    this.cache.set(req.urlWithParams, response);
  }
}
