// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Pipe } from "@angular/core";

import { Mask } from "../mask.class";
import { MaskSection } from "../mask-section.class";
import { MaskSectionType } from "../mask-section-type.class";

// Parsing DateTime by Mask
@Pipe({
  name: "ynDateParser",
  pure: true
})
export class DateParserPipe {

    transform(mask: Mask, value: string): any {

      if(value == "")
        return null;

      let sectionPos = 0;
      let res = value;

      let d: number = 1;
      let m: number = 1;
      let y: number = 1970;

      let hh: number = 0;
      let mi: number = 0;
      let ss: number = 0;
      let ms: number = 0;

      let tt: string = "";

      for(let i = 0; i < mask.sections.length; i++) {

        let section: MaskSection = mask.sections[i];
        let datePart = section.sectionType.datePart;

        if(datePart == null) // Not datetime component
          continue;

        let v = section.extractSectionValue(res, sectionPos);
        sectionPos = v.nextSectionPos();

        // Get section value
        let s: string = v.sectionValue.value();

        let n: number;
        n = NaN;

        if(section.isNumeric()) {

          if(s.indexOf(mask.settings.placeholder) >= 0) // Contains placeholders
            return this.invalidDate();

          n = section.numericValue(s);

          if(n < section.sectionType.min || n > section.sectionType.max)
            return this.invalidDate();

        }
        else
          if(section.hasOptions()) {
            n = section.sectionType.options.indexOf(s);
            if(n < 0)
              return this.invalidDate();
            n++; // Index starts from 0
          }

        if(n == NaN)
          return this.invalidDate();

        // Time components...
        if(datePart == "H")
          hh = n;

        if(datePart == "h") {
          hh = n;
          if(hh == 12)
            hh = 0;
        }

        if(datePart == "tt")
          tt = s;

        if(datePart == "mi")
          mi = n;

        if(datePart == "ss")
          ss = n;

        if(datePart == "ms")
          ms = n;

        // Date components...
        if(datePart == "d")
          d = n;

        if(datePart == "m")
          m = n;

        if(datePart == "yy") {
          if(n < 30)
            y = 2000 + n;
          else
            y = 1900 + n;
        }

        if(datePart == "yyyy")
          y = n;
      }

      if(tt.toLowerCase() == "pm")
        hh += 12;

      // We should check number of days in month
      let maxDays: number = this.daysInMonth(y, m);
      if(d > maxDays)
        return this.invalidDate();

      return new Date(y, m - 1, d, hh, mi, ss, ms);
    }

    // Creating Invalid Date
    invalidDate() {
      return new Date('*');
    }

    daysInMonth (y: number, m: number): number {
      return new Date(y, m, 0).getDate();
    }
}
