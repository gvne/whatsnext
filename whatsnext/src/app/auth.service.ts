import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationStart, DefaultUrlSerializer, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import * as jwt_decode from "jwt-decode";

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
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {}

  getOAuthToken(): Observable<OAuthToken> {
    // try to read the token from localStorage
    let token = this.readOAuthToken();
    if (token) {
      return token;
    }

    // initialize an Observable<Observable<OAuthToken>>
    // try reading the queryParams
    return this.getQueryToken().pipe(
      switchMap (
        // once obained, if we have a code, try to exchange it for a token.
        // if we don't, redirect to the login page
        queryParams => {
          if (!('code' in queryParams)) {
            this.redirectToLoginPage();
          }
          return this.getOAuthTokenFromCode(queryParams['code']).pipe(
            // once we obtain the auth token from the code, we save it
            // in our members
            map(
              token => {
                this.writeOAuthToken(token);
                return token;
              }
            )
          );
        }
      )
    );
  }

  getUserID(): Observable<string> {
    return this.getOAuthToken().pipe(
      map(
        token => {
          let jwtToken = jwt_decode(token.access_token);
          return jwtToken.sub;
        }
      )
    );
  }

  logout() {
    this.writeOAuthToken(null);
    // TODO: reload the page ?
  }

  private writeOAuthToken(token: OAuthToken) {
    if (!token) {
      localStorage.removeItem(storageKeys.authToken);
      return;
    }
    localStorage.setItem(storageKeys.authToken, JSON.stringify(token));
  }

  private readOAuthToken(): Observable<OAuthToken> {
    let tokenJSON = localStorage.getItem(storageKeys.authToken);
    if (tokenJSON) {
      let token = JSON.parse(tokenJSON);
      return this.refreshToken(token);
    }
    return null;
  }

  private refreshToken(token: OAuthToken): Observable<OAuthToken> {
    let jwtToken = jwt_decode(token.access_token);
    var currentTime = Date.now() / 1000;
    // in case we don't need to refresh it, just return it as an observable
    if (jwtToken.exp >= currentTime) {
      return new Observable((observer) => {
        observer.next(token);
        observer.complete();
        return () => {};
      });
    }

    // else we need to try refreshing it
    console.log("Refreshing the token...");
    const httpOptions = {
      headers: this.makeAuthenticationHeaders()
    };
    // the refreshed token comes back with no refresh_token. We don't want to
    // save it then. just return the observable
    return this.http.post<OAuthToken>(
      authConfig.tokenEndpoint,
      "grant_type=refresh_token" +
      "&refresh_token=" + token.refresh_token,
      httpOptions
    );
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

  private makeAuthenticationHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': "Basic " + btoa(AUTH_CLIENT_ID + ":" + AUTH_CLIENT_SECRET),
      'content-type': 'application/x-www-form-urlencoded'
    });
  }
  private getOAuthTokenFromCode(code: string): Observable<OAuthToken> {
    const httpOptions = {
      headers: this.makeAuthenticationHeaders()
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
