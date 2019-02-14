import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";

import { LocaleDe } from "./locales/de-de";
import { LocaleEs } from "./locales/es-es";
import { LocaleFr } from "./locales/fr-fr";
import { LocalePt } from "./locales/pt-pt";
import { LocaleRu } from "./locales/ru-ru";
import { LocaleChinese } from "./locales/zh-cn";

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
    return YN.Mask.defaultSettings.placeholder;
  }

  set placeholder(s: string) {
    YN.Mask.defaultSettings.placeholder = s;
  }

  //
  get appendPlaceholders(): boolean {
    return YN.Mask.defaultSettings.appendPlaceholders;
  }

  set appendPlaceholders(v: boolean) {
    YN.Mask.defaultSettings.appendPlaceholders = v;
  }

  //
  get replaceMode(): boolean {
    return YN.Mask.defaultSettings.replaceMode;
  }

  set replaceMode(v: boolean) {
    YN.Mask.defaultSettings.replaceMode = v;
  }

  constructor(
    // С помощью синглтона Internationalization можно менять текущую локализацию
    public intl: YN.InternationalizationService,

    // При объявлении зависимости локализации сами добавляются в
    // список синглтона Internationalization
    // и могут быть активированы указанием свойства currentLocale:
    //    intl.currentLocale = "ru-RU";
    private localeEs: LocaleEs,
    private localeFr: LocaleFr,
    private localeDe: LocaleDe,
    private localePt: LocalePt,
    private localeRu: LocaleRu,
    private localeChinese: LocaleChinese,
  ) {
    // ...
  }
}
