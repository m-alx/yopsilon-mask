// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Pipe } from "@angular/core";

import { InternationalizationService } from "../internationalization/internationalization.service";

import { Mask } from "../mask/mask.class";
import { DateParserFormatter } from "./date-parser-formatter.class";

// Parsing DateTime by Mask
@Pipe({
  name: "ynDateParser",
  pure: false
})
export class DateParserPipe {

    transform(value: string, pattern: string): any {

      let mask: Mask = new Mask(this.intl);
      mask.pattern = pattern;

      return DateParserFormatter.parse(value, mask);
    }

    constructor(private intl: InternationalizationService) {
      //
    }
}
