// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { NgModule, ModuleWithProviders } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";

import { Internationalization } from "./internationalization/internationalization.class";
import { LocaleRu } from "./internationalization/locales/ru-ru";
import { LocaleDe } from "./internationalization/locales/de-de";
import { LocaleFr } from "./internationalization/locales/fr-fr";

import { Mask } from "./mask/mask.class";

import { MaskDirective } from "./mask/mask.directive";
import { MaskDateDirective } from "./mask/mask-date.directive";

import { DateParserPipe } from "./mask/pipes/date-parser.pipe";
import { DateFormatterPipe } from "./mask/pipes/date-formatter.pipe";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [MaskDirective, MaskDateDirective, DateParserPipe, DateFormatterPipe],
  entryComponents: [],
  providers: [Mask, Internationalization, LocaleRu, LocaleDe, LocaleFr],
  exports: [MaskDirective, MaskDateDirective, DateParserPipe, DateFormatterPipe]
})
export class YopsilonMaskModule {

  public static forRoot(): ModuleWithProviders {
      return {
        ngModule: YopsilonMaskModule,
        providers: [Internationalization, LocaleRu, Mask]
      };
  }
}
