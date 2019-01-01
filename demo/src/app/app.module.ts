import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgModule } from '@angular/core';

import { YopsilonMaskModule } from 'yopsilon-mask';

import { AppComponent } from './app.component';
import { MaskExampleComponent } from './mask-example/mask-example.component';


@NgModule({
  declarations: [
    AppComponent, MaskExampleComponent
  ],
  imports: [
    BrowserModule, FormsModule, YopsilonMaskModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
