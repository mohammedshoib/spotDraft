import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PlanetComponent } from './planet/planet.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PlanetComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    VirtualScrollerModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
