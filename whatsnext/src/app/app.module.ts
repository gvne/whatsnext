import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';

import { YoutubePlayerModule } from 'ngx-youtube-player';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { MasterComponent } from './master/master.component';
import { AppRoutingModule } from './/app-routing.module';

import { WINDOW_PROVIDERS } from './window.provider';
import { ClientComponent } from './client/client.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    MasterComponent,
    ClientComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    YoutubePlayerModule
  ],
  providers: [
    WINDOW_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
