// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Pipe } from "@angular/core";

import { Mask } from "../mask.class";
import { MaskSection } from "../mask-section.class";
import { MaskSectionType } from "../mask-section-type.class";

// Парсинг даты по  заданной маске
@Pipe({
  name: "ynDateFormatter",
  pure: true
})
export class DateFormatterPipe {

    transform(mask: Mask, date: any): string {

      if(date == null || date == undefined || date.getTime() == NaN)
        return "";

      let res: string = "";
      for(let i = 0; i < mask.sections.length; i++) {

        let section: MaskSection = mask.sections[i];
        let datePart = section.sectionType.datePart;

        let n: number = NaN;

        if(datePart == "yyyy")
          n = date.getFullYear();

        if(datePart == "yy") {
          n = date.getFullYear();
          if( n >= 2000)
            n-=2000;
          else
            n-=1900;
        }

        if(datePart == "m")
          n = date.getMonth() + 1;

        if(datePart == "d")
          n = date.getDate();

        if(datePart == "H")
          n = date.getHours();

        if(datePart == "h") {
          n = date.getHours();

          if(n == 0)
            n = 12;
          else
            if(n > 12)
              n -= 12;
        }

        if(datePart == "mi")
          n = date.getMinutes();

        if(datePart == "ss")
          n = date.getSeconds();

        if(datePart == "ms")
          n = date.getMilliseconds();

        if(datePart == "tt")
          n = date.getHours() >= 12 ? 2 : 1;

        let s: string = "";

        if(section.hasOptions())
          s = section.sectionType.options[n - 1];
        else
          s = section.autoCorrectValue(n + "");

        res += s + section.delimiter;
      }

      return res;
    }
}
