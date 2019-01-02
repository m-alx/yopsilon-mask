import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import * as YN from 'yopsilon-mask';

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

  ip_options: YN.MaskOptions = new YN.MaskOptions(" ", false);

  initMaskOptions() {
    //this.intl.setCurrentLocale("ru-RU");
    this.ip_options.appendPlaceholders = true;
    this.ip_options.placeholder = " ";
  }

  constructor(
    private intl: YN.Internationalization,
    private localeRu: YN.LocaleRu//,
    //private mask: YN.Mask
  ) {
    YN.Mask.defaultOptions.appendPlaceholders = true;
    YN.Mask.sectionTypes.push(
      { selectors: ["A"], digits: true, alpha: true, regExp: /[a-b]/i },
    );
    this.initMaskOptions();
  }
}
