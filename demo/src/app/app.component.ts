import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import * as YN from 'yopsilon-mask';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DEMO PAGE';

  // В идеале символ плэйсхолдера не должен пересекаться с символами
  // разделителей (см. статическое свойство Mask.delimiterChars)
  whiteSpace = "\u2000";

  get placeholder(): string {
    return YN.Mask.defaultOptions.placeholder;
  }

  set placeholder(s: string) {
    YN.Mask.defaultOptions.placeholder = s;
  }

  //
  get appendPlaceholders(): boolean {
    return YN.Mask.defaultOptions.appendPlaceholders;
  }

  set appendPlaceholders(v: boolean) {
    YN.Mask.defaultOptions.appendPlaceholders = v;
  }

  //
  get replaceMode(): boolean {
    return YN.Mask.defaultOptions.replaceMode;
  }

  set replaceMode(v: boolean) {
    YN.Mask.defaultOptions.replaceMode = v;
  }


  constructor(
    // С помощью синглтона Internationalization можно менять текущую локализацию
    private intl: YN.Internationalization,

    // При объявлении зависимости локализации сами добавляются в
    // список синглтона Internationalization
    // и могут быть активированы указанием свойства currentLocale:
    //    intl.currentLocale = "ru-RU";
    private localeFr: YN.LocaleFr,
    private localeDe: YN.LocaleDe,
    private localeRu: YN.LocaleRu
  ) {
    // ...
  }
}
