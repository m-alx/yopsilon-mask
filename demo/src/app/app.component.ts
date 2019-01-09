import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import * as YN from 'yopsilon-mask';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DEMO PAGE';

  btnClick(e) {
    this.intl.setLocale("ru-RU");
  }

  constructor(
    private intl: YN.Internationalization,
    private localeRu: YN.LocaleRu
  ) {
    // ...
  }
}
