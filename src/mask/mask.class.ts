// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { InternationalizationService } from '../internationalization/internationalization.service';
import { Locale } from '../internationalization/locale.class';

import { MaskSectionType } from './mask-section-type.class';
import { MaskSection, MaskResult, Action } from './mask-section.class';
import { MaskSettings } from './mask-settings.class';
import { Keys } from '../keys/keys.class';

// @dynamic
export class Mask {

  // Settings
  private _settings: MaskSettings = null;

  public set settings(o: MaskSettings) {
    this._settings = o;
    this.sections.forEach(s => s.settings = o);
    this.updateMask();
  }

  // Settings by default
  public static readonly defaultSettings: MaskSettings = new MaskSettings('_');

  public get settings() {
    return this._settings == null ? Mask.defaultSettings : this._settings;
  }

  // Sections with section chars
  private readonly singles: string = '*aAnN#0';

  // Delimiters
  public static readonly delimiterChars: string = ` .,()/|-:+ '`;

  // Predefined section types
  public static readonly sectionTypes: MaskSectionType[] = [

    // Time components
    { selectors: ['HH'], numeric: true, min: 0, max: 23, datePart: 'H' },
    { selectors: ['h'], numeric: true, min: 1, max: 12, datePart: 'h' },
    { selectors: ['hh'], numeric: true, min: 1, max: 12, datePart: 'h' },
    { selectors: ['mi', 'MI'], numeric: true, min: 0, max: 59, datePart: 'mi' },
    { selectors: ['ss', 'SS'], numeric: true, min: 0, max: 59, datePart: 'ss' },
    { selectors: ['TT', 'AM', 'PM'], numeric: false, options: ['AM', 'PM'], datePart: 'tt' },
    { selectors: ['tt', 'am', 'pm'], numeric: false, options: ['am', 'pm'], datePart: 'tt' },
    { selectors: ['fff'], numeric: true, datePart: 'ms' }, // Milliseconds

    // Date components
    { selectors: ['dd', 'DD'], numeric: true, min: 1, max: 31, datePart: 'd' },
    { selectors: ['mm', 'MM'], numeric: true, min: 1, max: 12, datePart: 'm' },
    { selectors: ['mmm'], numeric: false, datePart: 'm' },
    { selectors: ['MMM'], numeric: false, datePart: 'm' },
    { selectors: ['yy', 'YY'], numeric: true, min: 0, max: 99, datePart: 'yy' },
    { selectors: ['yyyy', 'YYYY'], numeric: true, min: 0, max: 9999, datePart: 'yyyy' },

    // Byte (from 0 to 255) - for ip-address or network mask
    { selectors: ['b'], numeric: true, min: 0, max: 255 },

    // Plus/minus
    { selectors: ['~'], numeric: false, regExp: /[-+]/ },

    // Letter or digit
    { selectors: ['*'], numeric: false, regExp: /[\d\w]/ },

    // Letters
    { selectors: ['l', 'L'], numeric: false, regExp: /\w/ },

    // Digits
    { selectors: ['n', 'N'], numeric: false, regExp: /\d/ },
  ];

  // The list of sections
  public sections: Array<MaskSection> = [];

  // Pattern of mask
  private _pattern: string;
  public set pattern(v: string) {
    this._pattern = v;
    this.updateMask();
  }

  public get pattern(): string {
    return this._pattern;
  }

  // Определяем тип секции по шаблону
  public selectSectionType(s: string): MaskSectionType {

    //  First, look in the settings // Сначала в настройках
    let res: MaskSectionType = this.settings.sectionTypes.find(i => (i.selectors.find(sel => sel == s) != null));
    if (res != null)
      return res;

    // Then, in predefined section types // Затем среди предустановленных
    return Mask.sectionTypes.find(i => (i.selectors.find(sel => sel == s) != null));
  }

  // Определяем, существуют ли типы секций, которые начинаются на заданный символ.
  private selectSectionTypeByFirstChar(char: string): MaskSectionType {

    // Сначала поищем в опциях
    let res: MaskSectionType = this.settings.sectionTypes.find(i => (i.selectors.find(sel => sel[0] == char) != null));
    if (res != null)
      return res;

    // Затем, среди стандартных
    return Mask.sectionTypes.find(i => (i.selectors.find(sel => sel[0] == char) != null));
  }

  // Добавляет в список секций пустую секцию, имеющую разделитель
  private addEmptySection(delimiter: string) {
    this.sections.push(new MaskSection(this.intl, this.settings, '', delimiter));
  }

  // Добавление секции в список
  private addSection(section: string, delimiter: string) {
    let sType = this.selectSectionType(section);

    if (!sType) {
      // Если секция не распознана - считаем это фиксированным текстом
      // и для каждого символа создаем пустую секцию с разделителем - этим
      // символом. Тогда маска будет принимать только их и переходить к
      // следующей секции
      for (let i = 0; i < section.length; i++)
        this.addEmptySection(section[i]);

      // Про разделители тоже нужно не забыть
      for (let i = 0; i < delimiter.length; i++)
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

  // Получаем чистое значение без разделителей
  // Для преобразования из одного шаблона в другой.
  // Годится только для шаблонов, в котором все секции имеют фиксированную длину
  pureValue(value: string): string {

    if (value == null)
      return value;

    let sectionPos = 0;
    let res = '';
    this.sections.forEach(section => {
      let v = section.extract(value, sectionPos);
      res += section.removePlaceholders(v.section.value());
      sectionPos = v.nextSectionPos();
    });

    return res;
  }

  // Применяем чистое значение к шаблону и возвращаем форматированное значение
  applyPureValue(value: string): string {
    //
    if (value == null)
      return value;

    let sectionPos = 0;
    let res = '';
    let i = 0;
    this.sections.forEach(section => {
      let l = section.section.length;
      let s = value.substring(i, i + l);
      res += s;
      i += l;
      if (value.length >= i)
        res += section.delimiter;
    });

    if (this.settings.appendPlaceholders)
      res = this.appendPlaceholders(res);

    return res;
  }

  // Разбиваем строку маски на секции между разделителями
  updateMask(): void {

    this.sections = [];

    let s: string;

    // Выбор формата на по локализации
    switch(this._pattern) {

      case 'date': {
        s = this.intl.locale.dateFormat;
        break;
      }

      case 'time':
      case 'timeHM': {
        s = this.intl.locale.timeHMFormat;
        break;
      }

      case 'timeHMS': {
        s = this.intl.locale.timeHMSFormat;
        break;
      }

      case 'dateTime':
      case 'dateTimeHM': {
        s = this.intl.locale.dateTimeHMFormat;
        break;
      }

      case 'dateTimeHMS': {
        s = this.intl.locale.dateTimeHMSFormat;
        break;
      }

      default: s = this._pattern;
    }

    if (!s || s.length === 0) {
      return;
    }

    let delimiter: string = '';

    let i = 0;
    while ( i < s.length) {

      let c = s[i];
      let sType = null;
      let part = '';

      if (this.singles.indexOf(c) >= 0) {
        part = c;
        sType = this.selectSectionType(c);
      }
      else
        for (let j = s.length; j >= i; j--) {
          part = s.substring(i, j);
          sType = this.selectSectionType(part);
          if (sType)
            break;
        }

      if (sType) {
        // Нужно добить разделителем
        i += part.length;
        let del = '';
        while (Mask.delimiterChars.indexOf(s[i]) >= 0) {
          del += s[i];
          i++;
        }

        if (del == '') // Не найден разделитель
        {
          if (i < s.length && this.selectSectionTypeByFirstChar(s[i]) == null) { // Если на текущий символ не найдется секции..
            del = s[i];                               // ..то это тоже разделитель
            i++;
          }
        }

        this.addSection(part, del);
        continue;
      }

      this.addSection('', c);
      i++;
    }
  }

  // Добавляем плэйсхолдеры к значению
  protected appendPlaceholders(value: string): string {

    let sectionStart = 0;
    let i = 0;
    while (i < this.sections.length) {
      let section = this.sections[i];
      let v = section.extract(value, sectionStart);

      while (v.section.length < section.length)
        v.section.append(this.settings.placeholder);

      v.delimiter = section.delimiter;

      // Обновляем значение и позицию следующей секции
      value = v.value();
      sectionStart = v.nextSectionPos();
      i++;
    }
    return value;
  }

  public checkMask(value: string): boolean {
    if (value === null) {
      return false;
    }
    if (value === '' && this.pattern !== '') {
      return false;
    }
    return this.applyMask(value) !== '';
  }

  // Форматирование строки по маске
  // Пустая строка будет означать инвалидность
  public applyMask(value: string, autoCorrect: boolean = true): string  {

    let sectionPos = 0;
    let res = value;

    for (let i = 0; i < this.sections.length; i++) {
      let section = this.sections[i];
      let v = section.extract(res, sectionPos);

      v.delimiter = section.delimiter;

      let sv = v.section.value();

      sv = section.removePlaceholders(sv);

      if (section.isNumeric())
      {
        // Invalid number value
        const n = section.numericValue(sv);
        if (isNaN(n) || sv === '') {
          return '';
        }
      }

      if (sv.length < section.length) {
        if (section.sectionType && section.sectionType.datePart) {
          let dp = section.sectionType.datePart;
          if (dp === 'yyyy' && sv.length !== 2) {  
              // For year we can accept value with 2 digits
            return '';
          }
        } else {
          return '';
        }
      }

      if (autoCorrect) {
        sv = section.autoCorrectVal(sv);
      }

      res = v.update(sv, 0);
      sectionPos = v.nextSectionPos();
    }

    res = res.substring(0, sectionPos);
    return res;
  }

  // Применяем заданный символ к заданному значению в заданном месте
  public applyKeyAtPos(value: string, key: number, char: string, selStart: number, selEnd: number = 0): any {

    let selLength = selEnd - selStart;

    let sectionStart = 0;
    let section = null;
    let prev_section = null;
    let prev_sectionStart = 0;
    let acceptDelimiterChars = true;

    // Добавляем плэйсхолдеры перед обработкой. Чтобы обработчик мог их учитывать
    // при расчете следующей позиции курсора
    if (this.settings.appendPlaceholders)
      value = this.appendPlaceholders(value);

    for (let i = 0; i < this.sections.length; i++) {

      section = this.sections[i];

      // Обработка пользовательского действия
      let res: MaskResult = section.applyKey(value, key, char,
                                                       sectionStart,
                                                       selStart,
                                                       selLength,
                                                       acceptDelimiterChars,
                                                       i == this.sections.length - 1);

      // Нельзя ничего применить
      if (res.action == Action.NONE)
       return null;

      // Добавляем еще раз плэйсхолдеры
      if (this.settings.appendPlaceholders)
        res.newValue = this.appendPlaceholders(res.newValue);

      // Готово!
      if (res.action == Action.APPLY)
        return res;

      // Идем в конец предыдущей секции
      // И применяем Delete
      if (res.action == Action.GO_BACK_AND_DELETE && prev_section != null) {
        res = prev_section.selectLast(res.newValue, prev_sectionStart, true);
        res = prev_section.applyKey(res.newValue, Keys.DELETE, '', prev_sectionStart, res.selStart, res.selLength);
        return res;
      }

      // Идем в конец предыдущей секции
      if (res.action == Action.GO_BACK && prev_section != null) {
        return prev_section.selectLast(res.newValue, prev_sectionStart);
      }

      // Идем в начало следующей секции
      if (res.action == Action.GO_FWD) {
        if (i < this.sections.length - 1) {
          let next_section = this.sections[i + 1];
          let valueWithDefaultVariant = next_section.setDefaultVariant(res.newValue, res.nextSectionPos);
          return next_section.selectFirst(valueWithDefaultVariant, res.nextSectionPos);
        } else {
          // The last section. Correct value.
          return section.autoCorrect(res.newValue, sectionStart, res.selStart, res.selLength);
        }
      }

      // Skipped section
      if (res.action == Action.SKIP) {

        // Запомним положение текущей секции и саму секцию для возврата по BACKSPACE
        // и стрелке влево
        if (section != null && section.section != '') {
          // Это условие для того, чтобы нельзя было вернуться на секции
          // без значащих символов
          prev_section = section;
          prev_sectionStart = sectionStart;
        }

        // Больше не будем принимать символы разделителей, т.к.
        // мы его отвергли в одной из предыдущей секций
        // Example - +7 921 911 11 11 - в начале строки жмем 7, но + его не принял
        // Тогда это будет значащий символ уже
        if (section.section == '' && selStart < res.nextSectionPos)
          acceptDelimiterChars = false;

        // Даже если мы передали управление следующей секции, значение может
        // измениться - могут быть добавлены разделители или скорректированы значения
        value = res.newValue;
        selStart = res.selStart;
        sectionStart = res.nextSectionPos;

        continue;
      }

      // Value is finished
      if (sectionStart > value.length) {
        return null;
      }
    }

    return null;
  }

  private setLocale(locale: Locale) {
    // Set short month names
    this.selectSectionType('mmm').options = this.intl.shortMonthNames.map(el => { return el.toLowerCase(); });
    this.selectSectionType('MMM').options = this.intl.shortMonthNames.map(el => { return el.toUpperCase(); });
  }

  public static maskWithPattern(intl: InternationalizationService, pattern: string): Mask {
    const mask = new Mask(intl);
    mask.pattern = pattern;
    return mask;
  }

  constructor(protected intl: InternationalizationService) {
    // Subscribe for localization change event. We have to update month names.
    this.intl.onLocaleChange.subscribe((locale: any) => {
      this.setLocale(locale);
    });
  }
}
