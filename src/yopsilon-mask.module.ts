// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { NgModule, ModuleWithProviders } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";

import { Internationalization } from "./internationalization/internationalization.class";
import { LocaleRu } from "./internationalization/locales/ru-ru";

import { MaskDirective } from "./mask/mask.directive";
import { MaskDateDirective } from "./mask/mask-date.directive";

import { DateParserPipe } from "./mask/date-parser.pipe";
import { DateFormatterPipe } from "./mask/date-formatter.pipe";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [MaskDirective, MaskDateDirective, DateParserPipe, DateFormatterPipe],
  entryComponents: [],
  providers: [Internationalization, LocaleRu],
  exports: [MaskDirective, MaskDateDirective, DateParserPipe, DateFormatterPipe]
})
export class YopsilonMaskModule {

  public static forRoot(): ModuleWithProviders {
      return {
        ngModule: YopsilonMaskModule,
        providers: [Internationalization, LocaleRu]
      };
  }
}
