import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgModule } from '@angular/core';

import { YopsilonMaskModule } from 'yopsilon-mask';

import { AppComponent } from './app.component';
import { MaskExampleComponent } from './mask-example/mask-example.component';

import { TestDirective } from './test-directive/test.directive';

@NgModule({
  declarations: [
    AppComponent, MaskExampleComponent, TestDirective
  ],
  imports: [
    BrowserModule, FormsModule, YopsilonMaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
