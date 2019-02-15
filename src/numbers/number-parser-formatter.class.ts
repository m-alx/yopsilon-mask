// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { InternationalizationService } from "../internationalization/internationalization.service";
import { NumberFormat } from "./number-format.class";

export class NumberParserFormatter {

  // Split string to prefix, number and postfix
  public static unclotheNumber(txt: string, fmt: NumberFormat): any {

    if(fmt == null)
        return { prefix: "", number: txt, postfix: ""};

    let number: string = txt;

    let prefix: string = "";
    let postfix: string = "";

    let postfixL = fmt.postfix.length;
    if(number.substring(number.length - postfixL, number.length) == fmt.postfix) {
      postfix = fmt.postfix;
      number = number.substring(0, number.length - postfixL);
    }

    let prefixL = fmt.prefix.length;
    if(number.substring(0, prefixL) == fmt.prefix) {
      prefix = fmt.prefix;
      number = number.substring(prefixL, number.length);
    }

    return {
      prefix: prefix,
      number: number,
      postfix: postfix
    }
  }

  // Split number to parts
  public static splitNumber(txt: string, separators: Array<string>): any {

    let sgn = "";

    let e = "";

    let ei = txt.search(/e/i);
    if(ei >= 0)
      e = txt[ei];

    let exponentialParts = txt.split(/e/i);

    let significand: string = exponentialParts[0];
    let orderOfMagnitude: string = exponentialParts.length > 1 ? exponentialParts[1] : "";

    if(significand.length > 0 && "-+".indexOf(significand[0]) >= 0) {
      sgn = significand[0];
      significand = significand.substring(1, txt.length);
    }

    let parts = significand.split(separators[0]);
    let decimalSeparator = ""; // Есть ли он?
    if(parts.length > 1)
      decimalSeparator = significand[parts[0].length];

    return {
      signum: sgn,
      integer: parts[0],
      decimalSeparator: decimalSeparator,
      fraction: parts.length > 1 ? parts[1] : "",
      e: e,
      orderOfMagnitude: orderOfMagnitude
    };
  }

  // Round number to given number of decimals
  public static roundTo(v: number, decimals: number): number {
    return Math.round(v * Math.pow(10, decimals)) * Math.pow(10, -decimals);
  }

  // Format number with given format and separators
  public static format(value: number, format: string | NumberFormat, separators: Array<string>): string {

    let fmt: NumberFormat;
    if (format && typeof format == "string") {
      fmt = NumberFormat.parseFormat(format);
      if(fmt == null)
        throw new Error("Invalid format");
    } else
      fmt = <NumberFormat>format;

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
  public static parse(txt: string, format: string, separators: Array<string>): any {

    let fmt: NumberFormat = NumberFormat.parseFormat(format);
    let parts = NumberParserFormatter.unclotheNumber(txt, fmt);

    if(parts.number == "")
      return null;

    let number = NumberParserFormatter.splitNumber(parts.number, separators);

    let thousandSeparator = separators.length > 1 ? separators[1] : "";
    let groups = thousandSeparator != "" ? number.integer.split(thousandSeparator) : number.integer;

    let sgn = 1;
    if(number.signum == "-")
      sgn = -1;

    let int: number = +groups.join("");
    let fraction: number = number.fraction.length != "" ? (+number.fraction) * Math.pow(10, -number.fraction.length) : 0;
    let resValue: number = sgn * (int + fraction) * Math.pow(10, number.orderOfMagnitude);

    return resValue;
  }

  public static canAcceptKey(txt: string, char: string, format: string, separators: Array<string>,
    selStart: number, selEnd: number = -1,
    convertToFormat: boolean = false): boolean {

    // Можем принять цифру, если она после знака или знака нет
    let fmt: NumberFormat = NumberFormat.parseFormat(format);

    let parts = NumberParserFormatter.unclotheNumber(txt, fmt);
    let number = NumberParserFormatter.splitNumber(parts.number, separators);

    let numStart = parts.prefix.length;
    let numEnd = parts.prefix.length + parts.number.length;

    let intStart = numStart + number.signum.length;
    let intEnd = intStart + number.integer.length;
    let fractionStart =  intEnd + number.decimalSeparator.length;

    let eStart = fractionStart + number.fraction.length;

    if(char == "Delete") {
      // Нельзя удалить десятичный разделитель
      if(convertToFormat && selStart == selEnd && selStart == fractionStart - 1)
        return false;

      return true;
    }

    if(char == "Backspace") {

      // Запрет применения, если последний ноль забирается...
      if(convertToFormat && number.integer == "0"
          && selStart == (numStart + number.signum.length)
          && selEnd == (numStart + number.signum.length + 1)
        )
        return false;

      if(convertToFormat && number.integer == "0" && selStart == selEnd && selStart == (numStart + number.signum.length + 1))
        return false;

      // Запрет применения, если удаляется десятичный разделитель
      if(convertToFormat && selStart == selEnd && selStart == fractionStart)
        return false;

      return true;
    }

    // Знак
    if("+-".indexOf(char) >= 0) {
      // Можно применить только в двух случаях

      // 1. Знака не было и мы в начале строки
      if(number.signum == "" && selStart == numStart)
        return true;

      // 2. После E
      if(number.e != "") {
        let omStart = eStart + number.e.length;
        if(selStart == omStart)
          return true;
      }
    }

    // Формат подразумевает экспоненциальную форму
    if(char.toLowerCase() == "e" && fmt.specifier.toLowerCase() == "e") {
      if(selStart == eStart)
        return true;
    }

    // Десятичный разделитель
    if(separators.length > 0 && char == separators[0]) {

      // Только если заменяем разделитель
      let dmStart = numStart + number.signum.length + number.integer.length;
      if(selStart == dmStart)
        return true;

      // Нету еще разделителя
      if(number.decimalSeparator == "")
        return true;
    }

    // Цифра
    if("0123456789".indexOf(char) >= 0) {

      // Нельзя  до минуса
      if(number.signum != "" && selStart <= numStart)
        return false;

      // И до префикса
      if(selStart < numStart)
        return false;

      // Исчерпано количество знаков целой части
      if(selStart >= intStart && selStart <= intEnd
          && number.integer.split(separators[1]).join("").length >= fmt.integerMax)
        return false;

      // Исчерпано количество знаков после запятой
      if(selStart == eStart && number.fraction.length >= fmt.fractionMax)
        return false;

      return true;
    }

    return false;
  }

  // Переформатирование числового значения
  public static reformat(txt: string, format: string, separators: Array<string>,
    selStart: number, selEnd: number,
    convertToFormat: boolean = false): any {

    if(txt == "")
      return { value: "", selStart: 0, selEnd: 0, canInput: true };

    let fmt: NumberFormat = NumberFormat.parseFormat(format);

    let parts = NumberParserFormatter.unclotheNumber(txt, fmt);
    let number = NumberParserFormatter.splitNumber(parts.number, separators);

    let decimalSeparator = separators[0];
    let thousandSeparator = separators[1];

    let newSelStart = selStart - parts.prefix.length - number.signum.length;
    let newSelEnd = selEnd - parts.prefix.length - number.signum.length;

    // ЦЕЛАЯ ЧАСТЬ
    // Убираем лидирующие нули
    while(number.integer.length > 1 && number.integer[0] == "0") {
      number.integer = number.integer.substring(1);
      if(newSelStart > 0)
        newSelStart--;
      if(newSelEnd > 0)
        newSelEnd--;
    }

    // Список групп
    let groups = number.integer.split(thousandSeparator);

    // Вычитаем из позиции курсора количество разделителей тысяч, которые наскреблись до курсора..
    let pos = groups[0].length;

    // Первую группу пропускаем
    for(let i = 1; i < groups.length; i++) {

      if(newSelStart > pos)
        newSelStart -= thousandSeparator.length;
      if(newSelEnd > pos)
        newSelEnd -= thousandSeparator.length;

      pos += groups[i].length + thousandSeparator.length;
    }

    // Составляем целую часть из групп
    number.integer = groups.join("");

    for(let i = 3; i < number.integer.length; i += 4) {

      // Необходимо добавить курсору немного позиции, если он стоит дальше этого разделителя...
      if(newSelStart > (number.integer.length - i))
        newSelStart += thousandSeparator.length;

      if(newSelEnd > (number.integer.length - i))
        newSelEnd += thousandSeparator.length;

      number.integer = number.integer.substring(0, number.integer.length - i) +
                       thousandSeparator +
                       number.integer.substring(number.integer.length - i);
    }

    // Добавляем лидирующие нули
    if(!convertToFormat && number.integer == "" && number.fraction != "") {
      number.integer = "0";
      newSelStart++;
      newSelEnd++;
    }

    if(convertToFormat && fmt != null && (number.signum !="" || number.integer != "" || number.fraction != ""))
      while(number.integer.length < fmt.integerMin) {
        number.integer = "0" + number.integer;
        newSelEnd++;
      }

    // ДРОБНАЯ ЧАСТЬ
    // Добавляем до минимума
    if(convertToFormat && fmt != null && (number.integer != "" || number.signum != ""))
      while(number.fraction.length < fmt.fractionMin)
        number.fraction += "0";

    // Убираем лишние знаки
    number.fraction = number.fraction.substring(0, fmt.fractionMax);

    // ИТОГОВОЕ ЗНАЧЕНИЕ
    let resValue = fmt.prefix;
    newSelStart += resValue.length;
    newSelEnd += resValue.length;

    if(number.signum != "") {
      resValue += number.signum;
      newSelStart += number.signum.length;
      newSelEnd += number.signum.length;
    }

    resValue += number.integer;

    if(convertToFormat) {
      if(number.fraction != "")
        resValue += separators[0] + number.fraction;
    }
    else {
      // Не нужно приводить к формату... Добавляем разделитель только если он был в исходном значении
      if(txt.indexOf(separators[0]) >= 0)
        resValue += separators[0] + number.fraction;
    }

    if(fmt.specifier.toLowerCase() == "e") {
      resValue += number.e;
      resValue += number.orderOfMagnitude;
    }

    resValue += fmt.postfix;

    // Возвращаем
    let result = { value: resValue, selStart: newSelStart, selEnd: newSelEnd};
    return result;
  }
}
