// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Injectable } from '@angular/core';

import { Internationalization } from "../internationalization/internationalization.class";
import { Locale } from "../internationalization/locale.class";

import { MaskSectionValue } from "./mask-section-value.class";
import { MaskSectionType } from "./mask-section-type.class";
import { MaskSection,
         MaskSectionKeyResult, MaskSectionAction } from "./mask-section.class";
import { MaskSettings } from "./mask-settings.class";
 
// Маска
// @dynamic
@Injectable()
export class Mask {

  // Настройки
  private _settings: MaskSettings = null;

  public set settings(o: MaskSettings) {
    this._settings = o;
    this.sections.forEach(s => s.settings = o);
    this.updateMask();
  }

  // Настройки по умолчанию
  public static readonly defaultSettings: MaskSettings = new MaskSettings("_");

  public get settings() {
    return this._settings == null ? Mask.defaultSettings : this._settings;
  }

  // Sections with section chars
  private readonly singles: string = "*aAnN#0";

  // Delimiters
  public static readonly delimiterChars: string[] = [" ", ".", ",", "(", ")", "/", "|", "-", ":", "+", "'"];

  // Predefined section types
  public static readonly sectionTypes: MaskSectionType[] = [

    // Time components
    { selectors: ["HH"], digits: true, alpha: false, min: 0, max: 23, datePart: "H" },
    { selectors: ["h"], digits: true, alpha: false, min: 1, max: 12, datePart: "h" },
    { selectors: ["hh"], digits: true, alpha: false, min: 1, max: 12, datePart: "h" },
    { selectors: ["mi", "MI"], digits: true, alpha: false, min: 0, max: 59, datePart: "mi" },
    { selectors: ["ss", "SS"], digits: true, alpha: false, min: 0, max: 59, datePart: "ss" },
    { selectors: ["TT", "AM", "PM"], digits: false, alpha: true, options: ["AM", "PM"], datePart: "tt" },
    { selectors: ["tt", "am", "pm"], digits: false, alpha: true, options: ["am", "pm"], datePart: "tt" },
    { selectors: ["fff"], digits: true, alpha: false, datePart: "ms" }, // Milliseconds

    // Date components
    { selectors: ["dd", "DD"], digits: true, alpha: false, min: 1, max: 31, datePart: "d" },
    { selectors: ["mm", "MM"], digits: true, alpha: false, min: 1, max: 12, datePart: "m" },
    { selectors: ["mmm"], digits: false, alpha: true, datePart: "m" },
    { selectors: ["MMM"], digits: false, alpha: true, datePart: "m" },
    { selectors: ["yy", "YY"], digits: true, alpha: false, min: 0, max: 99, datePart: "yy" },
    { selectors: ["yyyy", "YYYY"], digits: true, alpha: false, min: 0, max: 9999, datePart: "yyyy" },

    // Byte (from 0 to 255) - for ip-address or network mask
    { selectors: ["b"], digits: true, alpha: false, min: 0, max: 255 },

    // Plus/minus
    { selectors: ["~"], digits: true, alpha: true, options: ["-", "+"] },

    // Any char
    { selectors: ["*"], digits: true, alpha: true },

    // Letters
    { selectors: ["l", "L"], digits: false, alpha: true },

    // Digits
    { selectors: ["n", "N"], digits: true, alpha: false },

    // Numeric format
    { selectors: ["#"], digits: true, alpha: false, min: 0, max: 9 },
    { selectors: ["0"], digits: true, alpha: false, min: 0, max: 9 },
  ];

  // Список секций маски
  public sections: Array<MaskSection> = [];

  // Маска
  private _mask: string;
  public set mask(v: string) {
    this._mask = v;
    this.updateMask();
  }

  public get mask(): string {
    return this._mask;
  }

  public selectSectionType(s: string): MaskSectionType {

    // Сначала поищем в опциях
    let res: MaskSectionType = this.settings.sectionTypes.find(i => (i.selectors.find(sel => sel == s) != null));
    if(res != null)
      return res;

    // Затем, среди стандартных
    return Mask.sectionTypes.find(i => (i.selectors.find(sel => sel == s) != null));
  }

  private selectSectionTypeByFirstChar(char: string): MaskSectionType {

    // Сначала поищем в опциях
    let res: MaskSectionType = this.settings.sectionTypes.find(i => (i.selectors.find(sel => sel[0] == char) != null));
    if(res != null)
      return res;

    // Затем, среди стандартных
    return Mask.sectionTypes.find(i => (i.selectors.find(sel => sel[0] == char) != null));
  }

  // Добавляет в список секций пустую секцию, имеющую разделитель
  private addEmptySection(delimiter: string) {
    this.sections.push(new MaskSection(this.intl, this.settings, "", delimiter));
  }

  // Добавление секции в список
  private addSection(section: string, delimiter: string) {
    let sType = this.selectSectionType(section);

    if(!sType) {
      // Если секция не распознана - считаем это фиксированным текстом
      // и для каждого символа создаем пустую секцию с разделителем - этим
      // символом. Тогда маска будет принимать только их и переходить к
      // следующей секции
      for(let i = 0; i < section.length; i++)
        this.addEmptySection(section[i]);

      // Про разделители тоже нужно не забыть
      for(let i = 0; i < delimiter.length; i++)
        this.addEmptySection(delimiter[i]);

      return;
    }

    let s = new MaskSection(this.intl, this.settings, section, delimiter, sType);

    // Так-то вообще, если разделитель длиннее одного символа,
    // нам нужно добавить пустые секции для всех символов кроме первого.
    // Но пока не будем здесь усложнять...
    s.delimiter = delimiter;
    this.sections.push(s);
  }

  pureValue(value: string): string {
    // Для преобразования из одного шаблона в другой.
    // Годится только для шаблонов, в котором все секции имеют фиксированную длину

    if(value == null)
      return value;

    let sectionPos = 0;
    let res = "";
    this.sections.forEach(section => {
      let v = section.extractSectionValue(value, sectionPos);
      res += section.removePlaceholders(v.sectionValue.value());
      sectionPos = v.nextSectionPos();
    });

    return res;
  }

  applyPureValue(value: string): string {
    //
    if(value == null)
      return value;

    let sectionPos = 0;
    let res = "";
    let i = 0;
    this.sections.forEach(section => {
      let l = section.section.length;
      let s = value.substring(i, i + l);
      res += s;
      i += l;
      if(value.length >= i)
        res += section.delimiter;
    });

    if(this.settings.appendPlaceholders)
      res = this.appendPlaceholders(res);

    return res;
  }

  // Разбиваем строку маски на секции между разделителями
  updateMask(): void {

    this.sections = [];

    let s: string;

    // Выбор формата на по локализации
    switch(this._mask) {

      case "date": {
        s = this.intl.locale.dateFormat;
        break;
      }

      case "time":
      case "timeHM": {
        s = this.intl.locale.timeHMFormat;
        break;
      }

      case "timeHMS": {
        s = this.intl.locale.timeHMSFormat;
        break;
      }

      case "dateTime":
      case "dateTimeHM": {
        s = this.intl.locale.dateTimeHMFormat;
        break;
      }

      case "dateTimeHMS": {
        s = this.intl.locale.dateTimeHMSFormat;
        break;
      }

      default: s = this._mask;
    }

    if(!s || s.length==0)
      return;

    let delimiter: string = "";

    let i = 0;
    while( i < s.length) {

      let c = s[i];
      let sType = null;
      let part = "";

      if(this.singles.indexOf(c) >= 0) {
        part = c;
        sType = this.selectSectionType(c);
      }
      else
        for(let j = s.length; j >= i; j--) {
          part = s.substring(i, j);
          sType = this.selectSectionType(part);
          if(sType)
            break;
        }

      if(sType) {
        // Нужно добить разделителем
        i += part.length;
        let del = "";
        while(Mask.delimiterChars.find(del => del == s[i])) {
          del += s[i];
          i++;
        }

        if(del == "") // Не найден разделитель
        {
          if(i < s.length && this.selectSectionTypeByFirstChar(s[i]) == null) { // Если на текущий символ не найдется секции..
            del = s[i];                               // ..то это тоже разделитель
            i++;
          }
        }

        this.addSection(part, del);
        continue;
      }

      this.addSection("", c);
      i++;
    }
  }

  // Добавляем плэйсхолдеры к значению
  protected appendPlaceholders(value: string): string {

    let sectionStart = 0;
    let i = 0;
    while(i < this.sections.length) {
      let section = this.sections[i];
      let v = section.extractSectionValue(value, sectionStart);

      while(v.sectionValue.length < section.length)
        v.sectionValue.append(this.settings.placeholder);

      v.delimiter = section.delimiter;

      // Обновляем значение и позицию следующей секции
      value = v.value();
      sectionStart = v.nextSectionPos();
      i++;
    }
    return value;
  }

  // Форматирование строки по маске
  // Пустая строка будет означать инвалидность
  public checkMask(value: string): boolean  {

    if(value == null)
      return false;

    let sectionPos = 0;
    let res = value;
    for(let i = 0; i < this.sections.length; i++) {
      let section = this.sections[i];
      let v = section.extractSectionValue(res, sectionPos);

      if(v.delimiter != section.delimiter)
        return false;

      let s = v.sectionValue.value();

      let s_autocorrected = section.autoCorrectValue(s);

      if(s != s_autocorrected) {
        if(section.isNumeric())
        {
          let n = section.numericValue(s_autocorrected);
          if(isNaN(n))
            return false;

          if((n + "").trim().length < section.length)
            return false;

        } else
          return false;
      }

      if(s.length > section.maxLength)
        return false;

      if(s.length < section.length)
        return false;

      if(i == this.sections.length - 1 && v.afterValue != "")
        return false;

      sectionPos = v.nextSectionPos();
    }

    return true;
  }

  // Форматирование строки по маске
  // Пустая строка будет означать инвалидность
  public applyMask(value: string, autoCorrect: boolean = true): string  {

    let sectionPos = 0;
    let res = value;
    for(let i = 0; i < this.sections.length; i++) {
      let section = this.sections[i];
      let v = section.extractSectionValue(res, sectionPos);
      if(v.sectionValue.value() == "" && v.delimiter == "" && v.afterValue == "")
        break;

      v.delimiter = section.delimiter;
      let sv = section.removePlaceholders(v.sectionValue.value());
      if(autoCorrect)
        sv = section.autoCorrectValue(sv);

      res = v.update(sv, 0);
      sectionPos = v.nextSectionPos();
    }

    res = res.substring(0, sectionPos);
    return res;
  }

  public applyKeyForNumeric(value: string, key: string, selStart: number, selEnd: number = 0) {
    // Для числового значения мы просто вставляем символ в нужное место..
    // И форматируем по маске от десятичного разделителя, если он есть.

    // Если превышено максимальное
  }

  // Применяем заданный символ к заданному значению в заданном месте
  public applyKeyAtPos(value: string, key: string, selStart: number, selEnd: number = 0): any {

    let selLength = selEnd - selStart;

    let sectionStart = 0;
    let section = null;
    let prev_section = null;
    let prev_sectionStart = 0;
    let acceptDelimiterChars = true;

    // Добавляем плэйсхолдеры перед обработкой. Чтобы обработчик мог их учитывать
    // при расчете следующей позиции курсора
    if(this.settings.appendPlaceholders)
      value = this.appendPlaceholders(value);

    for(let i = 0; i < this.sections.length; i++) {

      section = this.sections[i];

      // Обработка пользовательского действия
      let res: MaskSectionKeyResult = section.applyKey(value, key, sectionStart,
                                                       selStart,
                                                       selLength,
                                                       acceptDelimiterChars,
                                                       i == this.sections.length - 1);

      // Нельзя ничего применить
      if(res.action == MaskSectionAction.NONE)
       return null;

      // Добавляем еще раз плэйсхолдеры
      if(this.settings.appendPlaceholders)
        res.newValue = this.appendPlaceholders(res.newValue);

      // Готово!
      if(res.action == MaskSectionAction.APPLY)
        return res;

      // Идем в конец предыдущей секции
      // И применяем Delete
      if(res.action == MaskSectionAction.GO_BACK_AND_DELETE && prev_section != null) {
        res = prev_section.selectLast(res.newValue, prev_sectionStart, true);
        res = prev_section.applyKey(res.newValue, "Delete", prev_sectionStart, res.newSelStart, res.newSelLength);
        return res;
      }

      // Идем в конец предыдущей секции
      // И тоже применяем Delete
      if(res.action == MaskSectionAction.GO_BACK_AND_BACKSPACE && prev_section != null) {
        res = prev_section.selectLast(res.newValue, prev_sectionStart);
        res = prev_section.applyKey(res.newValue, "Delete", prev_sectionStart, res.newSelStart, res.newSelLength);
        return res;
      }

      // Идем в конец предыдущей секции
      if(res.action == MaskSectionAction.GO_BACK && prev_section != null)
        return prev_section.selectLast(res.newValue, prev_sectionStart);

      // Идем в начало следующей секции
      if(res.action == MaskSectionAction.GO_FWD) {
        if(i < this.sections.length - 1) {
          let next_section = this.sections[i + 1];
          let valueWithDefaultVariant = next_section.setDefaultVariant(res.newValue, res.nextSectionPos);
          return next_section.selectFirst(valueWithDefaultVariant, res.nextSectionPos);
        } else {
          // Секция последняя. Скорректируем значение.
          return section.autoCorrect(res.newValue, sectionStart, res.newSelStart, res.newSelLength);
        }
      }

      // К этой секции ничего не применилось. Переходим к следующей секции..
      if(res.action == MaskSectionAction.SKIP) {

        // Запомним положение текущей секции и саму секцию для возврата по BACKSPACE
        // и стрелке влево
        if(section != null && section.section != "") {
          // Это условие для того, чтобы нельзя было вернуться на секции
          // без значащих символов
          prev_section = section;
          prev_sectionStart = sectionStart;
        }

        // Больше не будем принимать символы разделителей, т.к.
        // мы его отвергли в одной из предыдущей секций
        // Пример - +7 921 911 11 11 - в начале строки жмем 7, но + его не принял
        // Тогда это будет значащий символ уже
        if(section.section == "" && /*value != res.newValue &&*/ selStart < res.nextSectionPos)
          acceptDelimiterChars = false;

        // Даже если мы передали управление следующей секции, значение может
        // измениться - могут быть добавлены разделители или скорректированы значения
        value = res.newValue;
        selStart = res.newSelStart;
        sectionStart = res.nextSectionPos;

        continue;
      }

      // Значение кончилось...
      if(sectionStart > value.length)
        return null;
    }

    return null;
  }

  private setLocale(locale: Locale) {
    // Устанавливаем короткие названия месяцев
    this.selectSectionType("mmm").options = this.intl.shortMonthNames.map(el => { return el.toLowerCase(); });
    this.selectSectionType("MMM").options = this.intl.shortMonthNames.map(el => { return el.toUpperCase(); });
  }

  constructor(protected intl: Internationalization) {
    // Здесь нужно подписаться на смену локализации и поменять наименования месяцев
    this.intl.onLocaleChange.subscribe(locale => {
      this.setLocale(locale);
    });
  }
}
