import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgModule } from '@angular/core';

import { YopsilonMaskModule } from 'yopsilon-mask';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, FormsModule, YopsilonMaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
