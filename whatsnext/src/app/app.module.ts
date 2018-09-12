import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { MasterComponent } from './master/master.component';
import { AppRoutingModule } from './/app-routing.module';

import { WINDOW_PROVIDERS } from './window.provider';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    MasterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    WINDOW_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
