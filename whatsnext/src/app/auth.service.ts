import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// import * as jwt_decode from "jwt-decode";

import { authConfig } from './constants';
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
  ) {
    let tokenJSON = localStorage.getItem("auth_token");
    if (tokenJSON) {
      this.token = JSON.parse(tokenJSON);
    }
  }

  getRedirectURI() {
    return location.protocol + '//' + location.host + location.pathname;
  }

  redirectToLoginPage() {
    this.document.location.href = authConfig.loginEndpoint +
                                  "?client_id=" + AUTH_CLIENT_ID +
                                  "&response_type=code" +
                                  "&redirect_uri=" + this.getRedirectURI()
  }

  getToken() : OAuthToken {
    return this.token;
  }

  isLoggedIn(): boolean {
    return this.token !== null;
  }

  // getUserID() : string {
  //   try{
  //     return jwt_decode(this.token.access_token).sub;
  //   }
  //   catch(Error){
  //     return null;
  //   }
  // }

  initializeOAuthToken(code): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Basic " + btoa(AUTH_CLIENT_ID + ":" + AUTH_CLIENT_SECRET),
        'content-type': 'application/x-www-form-urlencoded'
      })
    };

    let future = this.http.post<OAuthToken>(
      authConfig.tokenEndpoint,
      "grant_type=authorization_code" +
      "&code=" + code +
      "&redirect_uri=" + this.getRedirectURI() +
      "&client_id=" + AUTH_CLIENT_ID,
      httpOptions
    );

    return future.pipe(
      map(
        (token: OAuthToken) => {
          this.token = token;
          localStorage.setItem("auth_token", JSON.stringify(token));
        }
      )
    );
  }
}
