import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgModule } from '@angular/core';

import { YopsilonMaskModule } from 'yopsilon-mask';

import { AppComponent } from './app.component';
import { FormFieldComponent } from './form-field/form-field.component';

import { TestDirective } from './test-directive/test.directive';

import { DateExampleComponent } from "./examples/date-example.component";
import { Date2ExampleComponent } from "./examples/date2-example.component";
import { TimeExampleComponent } from "./examples/time-example.component";
import { Time12ExampleComponent } from "./examples/time12-example.component";
import { PhoneExampleComponent } from "./examples/phone-example.component";
import { IpExampleComponent } from "./examples/ip-example.component";
import { CreditCardExampleComponent } from "./examples/credit-card-example.component";
import { CanadianPostalCodeExampleComponent } from "./examples/canadian-postal-code-example.component";

@NgModule({
  declarations: [
    AppComponent, FormFieldComponent, TestDirective,
    DateExampleComponent,
    Date2ExampleComponent,
    TimeExampleComponent,
    Time12ExampleComponent,
    PhoneExampleComponent,
    IpExampleComponent,
    CreditCardExampleComponent,
    CanadianPostalCodeExampleComponent
  ],
  imports: [
    BrowserModule, FormsModule, YopsilonMaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
