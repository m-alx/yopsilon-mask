import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import * as YN from 'yopsilon-mask';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  testDate1: any = new Date(1979, 11, 13);

  testValue1: string = '';
  testValue2: string = '';
  testValue3: string = '';
  testValue4: string = '';
  testValue5: string = '';
  testValue6: string = '';
  testValue7: string = '';

  ip_options: YN.MaskOptions = new YN.MaskOptions(" ", false);

  onchange(e) {
    console.log(e);
  }

  initMaskOptions() {
    //this.intl.setCurrentLocale("ru-RU");
    this.ip_options.appendPlaceholders = false;
    this.ip_options.placeholder = " ";
  }

  constructor(
    private intl: YN.Internationalization,
    private localeRu: YN.LocaleRu//,
    //private mask: YN.Mask
  ) {
    YN.Mask.defaultOptions.appendPlaceholders = true;
    YN.Mask.sectionTypes.push(
      { selectors: ["A"], digits: true, alpha: true, regExp: /[a-c]/i },
    );
    this.initMaskOptions();
  }
}
