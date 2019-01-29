// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { InternationalizationService } from "../internationalization/internationalization.service";
import { NumberFormat } from "./number-format.class";

export class NumberParserFormatter {

  public static roundTo(v: number, decimals: number): number {
    return Math.round(v * Math.pow(10, decimals)) * Math.pow(10, -decimals);
  }

  public static format(value: number, format: string, separators: Array<string>): string {

    let fmt: NumberFormat = NumberFormat.parseFormat(format);

    if(fmt == null)
      throw new Error("Invalid format");

    if(fmt.specifier.toLowerCase() == "e") {
      // Exponential
    }

    let sgn = Math.sign(value) < 0 ? "-" : "";

    if(fmt.signum && sgn == "")
      sgn = "+";

    let num = NumberParserFormatter.roundTo(Math.abs(value), fmt.fractionMax).toFixed(fmt.fractionMax);
    let parts = num.split(".");

    let sInt = parts[0];
    let sFraction = parts.length > 0 ? parts[1] : "";

    // Remove trailing zeros
    while(sFraction.length > fmt.fractionMin && sFraction.substring(sFraction.length - 1) == "0")
      sFraction = sFraction.substring(0, sFraction.length - 1);

    // Add leading zeros
    while(sInt.length < fmt.integerMin)
      sInt = "0" + sInt;

    if(separators.length > 1) // Thousand separator
      for(let i = 3; i < sInt.length; i += 4)
        sInt = sInt.substring(0, sInt.length - i) + separators[1] + sInt.substring(sInt.length - i);

    return fmt.prefix + sgn + sInt + separators[0] + sFraction + fmt.postfix;
  }

  // Parse number
  public static parse(txt: string, format: string, separators: Array<string>,
    selStart: number = 0, selEnd: number = 0): any {

    if(txt == "")
      return { value: null, selStart: 0, selEnd: 0 };

    if(format != "") {
      let fmt: NumberFormat = NumberFormat.parseFormat(format);

      if(fmt == null)
        throw new Error("Invalid format");

      let pl = fmt.postfix.length;
      if(txt.substring(txt.length - pl, txt.length) == fmt.postfix) {
        txt = txt.substring(0, txt.length - pl);
        selStart = selStart > txt.length ? txt.length : selStart;
        selEnd = selEnd > txt.length ? txt.length : selEnd;
      }

      pl = fmt.prefix.length;
      if(txt.substring(0, pl) == fmt.prefix) {
        txt = txt.substring(pl, txt.length);
        selStart -= pl;
        selEnd -= pl;
      }
    }

    let sgn = 1;
    let exponentialParts = txt.split(/[eE]/);

    let significand: string = exponentialParts[0];
    let orderOfMagnitude: number = exponentialParts.length > 1 ? (+exponentialParts[1]) : 0;

    if(significand.length > 0 && significand[0] == "-") {
      sgn = -1;
      significand = significand.substring(1, txt.length);
    }

    let parts = significand.split(separators[0]);
    let thousandSeparator = separators.length > 1 ? separators[1] : "";
    let groups = thousandSeparator != "" ? parts[0].split(thousandSeparator) : [parts[0]];

    // Вычитаем из позиции курсора количество разделителей тысяч, которые наскреблись до курсора..
    let pos = groups[0].length;
    // Первую группу пропускаем
    for(let i = 1; i < groups.length; i++) {

      if(selStart > pos)
        selStart -= thousandSeparator.length;
      if(selEnd > pos)
        selEnd -= thousandSeparator.length;

      pos += groups[i].length + thousandSeparator.length;
    }

    let int: number = +groups.join("");
    let fraction: number = parts.length > 1 ? (+parts[1]) * Math.pow(10, -parts[1].length) : 0;
    let resValue: number = sgn * (int + fraction) * Math.pow(10, orderOfMagnitude);

    return { value: resValue, selStart: selStart, selEnd: selEnd };
  }

}
