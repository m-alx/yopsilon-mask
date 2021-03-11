// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { NgModule, ModuleWithProviders } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { InternationalizationService } from "./internationalization/internationalization.service";

import { MaskBaseDirective } from "./mask/mask-base.directive";
import { MaskDirective } from "./mask/mask.directive";
import { MaskDateDirective } from "./mask/mask-date.directive";
import { MaskNumberDirective } from "./mask/mask-number.directive";

import { DateParserPipe } from "./dates/date-parser.pipe";
import { DateFormatterPipe } from "./dates/date-formatter.pipe";

@NgModule({
  imports: [FormsModule],
  declarations: [MaskBaseDirective, MaskDirective, MaskDateDirective, MaskNumberDirective, DateParserPipe, DateFormatterPipe],
  entryComponents: [],
  providers: [InternationalizationService],
  exports: [MaskDirective, MaskDateDirective, MaskNumberDirective, DateParserPipe, DateFormatterPipe]
})
export class YopsilonMaskModule {

  public static forRoot(): ModuleWithProviders<YopsilonMaskModule> {
      return {
        ngModule: YopsilonMaskModule,
        providers: [InternationalizationService]
      };
  }
}
