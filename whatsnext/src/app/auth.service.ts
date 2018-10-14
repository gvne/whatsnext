import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationStart, DefaultUrlSerializer, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// import * as jwt_decode from "jwt-decode";

import { authConfig, storageKeys } from './constants';
import { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET } from './keys';

export interface OAuthToken {
 access_token: string,
 refresh_token: string,
 id_token: string,
 token_type: string,
 expires_in: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: OAuthToken = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {}

  getOAuthToken(): Observable<OAuthToken> {
    // try to read the token from localStorage
    let tokenJSON = localStorage.getItem(storageKeys.authToken);
    if (tokenJSON) {
      return new Observable((observer) => {
        observer.next(JSON.parse(tokenJSON));
        observer.complete();
        return () => {};
      });
    }

    // initialize an Observable<Observable<OAuthToken>>
    let future = this.getQueryToken().pipe(
      map (
        queryParams => {
          if (!('code' in queryParams)) {
            this.redirectToLoginPage();
          }
          return this.getOAuthTokenFromCode(queryParams['code']);
        }
      )
    );

    // make an Observable<OAuthToken> from Observable<Observable<OAuthToken>>
    return new Observable((observer) => {
      future.subscribe(
        result => {
          result.subscribe(
            token => {
              this.setOAuthToken(token);
              observer.next(token);
              observer.complete();
            }
          );
        }
      );
      return () => {};
    });
  }

  private setOAuthToken(token) {
    localStorage.setItem(storageKeys.authToken, JSON.stringify(token));
    this.token = token;
  }

  private getQueryToken(): Observable<Params> {
    return new Observable((observer) => {
      // queryParams always fires twice.
      // see https://github.com/angular/angular/issues/13804
      this.router.events.subscribe(
        event => {
          // Only run once through this. Any other event can be forgotten
          if (!(event instanceof NavigationStart)) {
            return;
          }

          // parse the event URL
          let serializer = new DefaultUrlSerializer();
          let tree = serializer.parse(event.url);
          let queryParams = tree.queryParams;

          observer.next(queryParams);
          observer.complete();
        }
      );
      return () => {};
    });
  }

  private getRedirectURI() {
    return location.protocol + '//' + location.host + location.pathname;
  }

  private redirectToLoginPage() {
    this.document.location.href = authConfig.loginEndpoint +
                                  "?client_id=" + AUTH_CLIENT_ID +
                                  "&response_type=code" +
                                  "&redirect_uri=" + this.getRedirectURI()
  }

  private getOAuthTokenFromCode(code): Observable<OAuthToken> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Basic " + btoa(AUTH_CLIENT_ID + ":" + AUTH_CLIENT_SECRET),
        'content-type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.post<OAuthToken>(
      authConfig.tokenEndpoint,
      "grant_type=authorization_code" +
      "&code=" + code +
      "&redirect_uri=" + this.getRedirectURI() +
      "&client_id=" + AUTH_CLIENT_ID,
      httpOptions
    );
  }
}
