// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Pipe } from "@angular/core";

import { InternationalizationService } from "../internationalization/internationalization.service";

import { Mask } from "../mask/mask.class";
import { DateParserFormatter } from "./date-parser-formatter.class";

// Formatting DateTime by pattern
@Pipe({
  name: "ynDateFormatter",
  pure: true
})
export class DateFormatterPipe {
  transform(date: any, pattern: string): string {
    let mask: Mask = new Mask(this.intl);
    mask.pattern = pattern;

    return DateParserFormatter.format(date, mask);
  }

  constructor(private intl: InternationalizationService) {
    //
  }
}
