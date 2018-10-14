import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";

import { YoutubePlayerModule } from 'ngx-youtube-player';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { MasterComponent } from './master/master.component';
import { ClientComponent } from './client/client.component';
import { SearchbarComponent } from './searchbar/searchbar.component';

import { AppRoutingModule } from './app-routing.module';

import { WINDOW_PROVIDERS } from './window.provider';
import { YoutubeVideoDetailComponent } from './youtube-video-detail/youtube-video-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    MasterComponent,
    ClientComponent,
    SearchbarComponent,
    YoutubeVideoDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AppRoutingModule,
    YoutubePlayerModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
  ],
  providers: [
    WINDOW_PROVIDERS,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
