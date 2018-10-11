import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, DefaultUrlSerializer } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'whatsnext';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.login();
    }
  }

  login() {
    // queryParams always fires twice.
    // see https://github.com/angular/angular/issues/13804
    this.router.events.subscribe(
      event => {
        // Only run once through this. Any other event can be forgotten
        if (!(event instanceof NavigationStart)) {
          return;
        }

        // parse the event url
        let serializer = new DefaultUrlSerializer();
        let tree = serializer.parse(event.url);
        let queryParams = tree.queryParams;

        if ('code' in queryParams) {
          // if we have a code, exchange it
          this.authService.initializeOAuthToken(
           queryParams['code']
          ).subscribe(
            () => {},
            // On error, restart the flow
            error => { this.authService.redirectToLoginPage(); }
          );
        } else {
          // if not redirect to login page
          this.authService.redirectToLoginPage();
        }
      }
    );
  }
}
