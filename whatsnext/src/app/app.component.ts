import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'whatsnext';

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.getOAuthToken().subscribe(
      token => { console.log(token);},
      error => { console.log("Failed"); }
    );
  }
}
