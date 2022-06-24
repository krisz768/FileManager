import { NgModule } from '@angular/core';
import { BrowserModule, Meta} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { LoadingScreenComponent } from './SubComponents/loading-screen/loading-screen.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoadingScreenComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatToolbarModule
  ],
  providers: [Meta],
  bootstrap: [AppComponent]
})
export class AppModule { }
