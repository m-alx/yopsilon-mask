// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Mask } from "../mask/mask.class";
import { MaskSection } from "../mask/mask-section.class";

// Parse and format DateTime
export class DateParserFormatter {
  // Creating Invalid Date
  public static invalidDate() {
    return new Date('*');
  }

  public static daysInMonth(y: number, m: number): number {
    return new Date(y, m, 0).getDate();
  }

  public static parse(value: string, mask: Mask, minY: number = 1950, maxY: number = 2050): any {
    if (value === '') {
      return null;
    }

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

    for (let i = 0; i < mask.sections.length; i++) {
      const section: MaskSection = mask.sections[i];
      const datePart = section.sectionType.datePart;

      if (!datePart) {
        // Not datetime component
        continue;
      }

      let v = section.extract(res, sectionPos);
      sectionPos = v.nextSectionPos();

      // Get section value
      let s: string = v.section.value();

      let n: number;
      n = NaN;

      if (section.isNumeric()) {
        if (s.indexOf(mask.settings.placeholder) >= 0) {
          // Contains placeholders
          return DateParserFormatter.invalidDate();
        }

        n = section.numericValue(section.removePlaceholders(s));

        if (n < section.sectionType.min || n > section.sectionType.max) {
          return DateParserFormatter.invalidDate();
        }
      } else {
        if (section.hasOptions()) {
          n = section.sectionType.options.indexOf(s);
          if (n < 0) {
            return DateParserFormatter.invalidDate();
          }
          n++; // Index starts from 0
        }
      }

      if (isNaN(n)) {
        return DateParserFormatter.invalidDate();
      }

      // Time components...
      if (datePart === "H") {
        hh = n;
      }

      if (datePart === "h") {
        hh = n;
        if (hh === 12) {
          hh = 0;
        }
      }

      if (datePart === "tt") {
        tt = s;
      }

      if (datePart === "mi") {
        mi = n;
      }

      if (datePart === "ss") {
        ss = n;
      }

      if (datePart === "ms") {
        ms = n;
      }

      // Date components...
      if (datePart === "d") {
        d = n;
      }

      if (datePart === "m") {
        m = n;
      }

      if (datePart === "yy") {
        y = n < 50 ? 2000 + n : 1900 + n;
      }

      if (datePart === "yyyy") {
        y = n;
      }
    }

    if (tt.toLowerCase() === "pm") {
      hh += 12;
    }

    // We should check number of days in month
    const maxDays: number = DateParserFormatter.daysInMonth(y, m);
    if (d > maxDays) {
      return DateParserFormatter.invalidDate();
    }

    const result = new Date(y, m - 1, d, hh, mi, ss, ms);
    result.setFullYear(y);
    return result;
  }

  public static format(date: any, mask: Mask): string {
    if (date === null || date === undefined || isNaN(date.getTime())) {
      return "";
    }

    let res: string = "";
    for (let i = 0; i < mask.sections.length; i++) {
      const section: MaskSection = mask.sections[i];
      const datePart = section.sectionType.datePart;

      let n: number = NaN;

      if (datePart === "yyyy") {
        n = date.getFullYear();
      }

      if (datePart === "yy") {
        n = date.getFullYear();
        if (n >= 2000) {
          n -= 2000;
        } else {
          n -= 1900;
        }
      }

      if (datePart === "m") {
        n = date.getMonth() + 1;
      }

      if (datePart === "d") {
        n = date.getDate();
      }

      if (datePart === "H") {
        n = date.getHours();
      }

      if (datePart === "h") {
        n = date.getHours();

        if (n === 0) {
          n = 12;
        } else {
          if (n > 12) {
            n -= 12;
          }
        }
      }

      if (datePart === "mi") {
        n = date.getMinutes();
      }

      if (datePart === "ss") {
        n = date.getSeconds();
      }

      if (datePart === "ms") {
        n = date.getMilliseconds();
      }

      if (datePart === "tt") {
        n = date.getHours() >= 12 ? 2 : 1;
      }

      let s: string = "";

      if (section.hasOptions()) {
        s = section.sectionType.options[n - 1];
      } else {
        s = section.autoCorrectVal(n + "");
      }

      res += s + section.delimiter;
    }

    return res;
  }
}
