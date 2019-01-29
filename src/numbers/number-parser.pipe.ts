// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Pipe } from "@angular/core";

import { InternationalizationService } from "../internationalization/internationalization.service";
import { NumberFormat } from "./number-format.class";

// Parsing number
@Pipe({
  name: "ynNumberParser",
  pure: false // Зависит от Internationalization
})
export class NumberParserPipe {

    transform(txt: string, format: string, selStart: number = 0, selLength: number = 0): any {

      if(txt == "")
        return null;

      let fmt: NumberFormat = NumberFormat.parseFormat(format);

      // if()

      return 0; // new Date(y, m - 1, d, hh, mi, ss, ms);
    }

    constructor(private intl: InternationalizationService) {
      console.log(intl.locale);
    }
}
