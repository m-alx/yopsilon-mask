// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { NgModule, ModuleWithProviders } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";

import { Internationalization } from "./internationalization/internationalization.class";
import { LocaleRu } from "./internationalization/locales/ru-ru";
import { Mask } from "./mask/mask.class";
import { MaskOptions } from "./mask/mask-options.class";
import { MaskDirective } from "./mask/mask.directive";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [MaskDirective],
  entryComponents: [],
  providers: [Internationalization, LocaleRu, Mask],
  exports: [MaskDirective]
})
export class YopsilonMaskModule {

  public static forRoot(): ModuleWithProviders {
      return {
        ngModule: YopsilonMaskModule,
        providers: [Internationalization, LocaleRu, Mask]
      };
  }
}
