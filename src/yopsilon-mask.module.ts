// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";

import { Internationalization } from "./internationalization/internationalization.class";
import { LocaleRu } from "./internationalization/locales/ru-RU";
import { Mask } from "./mask/mask.class";
import { MaskOptions } from "./mask/mask-options.class";
import { MaskDirective } from "./mask/mask.directive";

@NgModule({
  imports: [BrowserModule, FormsModule],
  providers: [Internationalization, LocaleRu],
  declarations: [MaskDirective],
  entryComponents: [],
  exports: [MaskDirective]
})
export class YopsilonMaskModule { }
