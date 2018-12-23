import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  testValue1: string = '';
  testValue2: string = '';
  testValue3: string = '';
  testValue4: string = '';
  testValue5: string = '';
  testValue6: string = '';
  testValue7: string = '';

  constructor() {

    /*
    let intl = new Internationalization();
    let m = new Mask(intl);
    m.mask = "dd.MM.yyyy";
    */
  }
}
