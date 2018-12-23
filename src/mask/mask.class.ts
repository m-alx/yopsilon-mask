// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yn

import { Internationalization } from "../internationalization/internationalization.class";
import { MaskSectionValue } from "./mask-section-value.class";
import { MaskSectionType } from "./mask-section-type.class";
import { MaskSection,
         MaskSectionKeyResult, MaskSectionAction } from "./mask-section.class";
import { MaskOptions } from "./mask-options.class";

// Маска
// @dynamic
export class Mask {

  // Настройки
  private _options: MaskOptions = null;

  public set options(o: MaskOptions) {
    this._options = o;
    this.sections.forEach(s => s.options = o);
  }

  // Настройки по умолчанию
  public static readonly defaultOptions: MaskOptions = new MaskOptions();

  public get options() {
    return this._options == null ? Mask.defaultOptions : this._options;
  }

  // Одиночные символы
  private readonly singles: string = "*aAnN#0";

  // Разделители
  public static readonly delimiterChars: string[] = [" ", ".", ",", "(", ")", "/", "|", "-", ":", "+", "'"];

  // Типы секций. Можете добавлять..
  public static readonly sectionTypes: MaskSectionType[] = [

    // Всё, что касается времени
    { selectors: ["HH"], digits: true, alpha: false, min: 0, max: 23 },
    { selectors: ["h"], digits: true, alpha: false, min: 1, max: 12 },
    { selectors: ["hh"], digits: true, alpha: false, min: 1, max: 12 },
    { selectors: ["mi", "MI"], digits: true, alpha: false, min: 0, max: 59 },
    { selectors: ["ss", "SS"], digits: true, alpha: false, min: 0, max: 59 },
    { selectors: ["TT", "AM", "PM"], digits: false, alpha: true, variants: ["AM", "PM"] },
    { selectors: ["tt", "am", "pm"], digits: false, alpha: true, variants: ["am", "pm"] },

    // Всё, что касается даты
    { selectors: ["dd", "DD"], digits: true, alpha: false, min: 1, max: 31 },
    { selectors: ["mm", "MM"], digits: true, alpha: false, min: 1, max: 12 },
    { selectors: ["mmm"], digits: true, alpha: false },
    { selectors: ["MMM"], digits: true, alpha: false },
    { selectors: ["yy", "YY"], digits: true, alpha: false, min: 0, max: 99 },
    { selectors: ["yyyy", "YYYY"], digits: true, alpha: false, min: 0, max: 9999 },

    // Байт - от 0 до 255 - для айпи-адреса или маски подсети
    { selectors: ["b"], digits: true, alpha: false, min: 0, max: 255 },

    // Всё, что угодно
    { selectors: ["*"], digits: true, alpha: true },

    // Буква
    { selectors: ["l", "L"], digits: false, alpha: true },

    // Цифра
    { selectors: ["n", "N"], digits: true, alpha: false },

    // Формат числовой
    { selectors: ["#"], digits: true, alpha: false, min: 0, max: 9 },
    { selectors: ["0"], digits: true, alpha: false, min: 0, max: 9 },
  ];

  // Список секций маски
  public sections: Array<MaskSection> = [];

  // Маска
  private _mask: string;
  public set mask(v: string) {
    this.parse(v);
  }

  public get mask(): string {
    return this._mask;
  }

  public static selectSection(s: string): MaskSectionType {
    return Mask.sectionTypes.find(i => (i.selectors.find(sel => sel == s) != null));
  }

  private addEmptySection(delimiter: string) {
    this.sections.push(new MaskSection(this.intl, this.options, "", delimiter));
  }

  // Добавление секции в список
  private addSection(section: string, delimiter: string) {
    let sType = Mask.selectSection(section);

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

    let s = new MaskSection(this.intl, this.options, section, delimiter, sType);

    // Так-то вообще, если разделитель длиннее одного символа,
    // нам нужно добавить пустые секции для всех символов кроме первого.
    // Но пока не будем здесь усложнять...
    s.delimiter = delimiter;
    this.sections.push(s);
  }

  // Разбиваем строку маски на секции между разделителями
  private parse(s: string): void {

    this._mask = s;

    this.sections = [];

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
        sType = Mask.selectSection(c);
      }
      else
        for(let j = s.length; j >= i; j--) {
          part = s.substring(i, j);
          sType = Mask.selectSection(part);
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
        v.sectionValue.append(this.options.placeholder);

      // Обновляем значение и позицию следующей секции
      value = v.value();
      sectionStart = v.nextSectionPos();
      i++;
    }
    return value;
  }

  // Форматирование строки по маске
  // Пустая строка будет означать инвалидность
  public applyMask(value: string): string  {
    let sectionPos = 0;
    let res = value;
    for(let i = 0; i < this.sections.length; i++) {
      let section = this.sections[i];
      let v = section.extractSectionValue(res, sectionPos);
      if(v.sectionValue.value() == "" && v.delimiter == "" && v.afterValue == "")
        break;

      v.delimiter = section.delimiter;
      let sv = section.autoCorrectValue(v.sectionValue.value());

      res = v.update(sv, 0);
      sectionPos = v.nextSectionPos();
    }

    res = res.substring(0, sectionPos);
    return res;
  }

  // Применяем заданный символ к заданному значению в заданном месте
  public applyKeyAtPos(value: string, key: string, selStart: number, selEnd: number = 0): any {

    let selLength = selEnd - selStart;

    let sectionStart = 0;
    let section = null;
    let prev_section = null;
    let prev_sectionStart = 0;
    let acceptDelimiterChars = true;

    for(let i = 0; i < this.sections.length; i++) {

      section = this.sections[i];

      let res: MaskSectionKeyResult = section.applyKey(value, key, sectionStart,
                                                       selStart,
                                                       selLength,
                                                       acceptDelimiterChars,
                                                       i == this.sections.length - 1);

      if(res.action == MaskSectionAction.APPLY) // Готово!
        return res;

      if(res.action == MaskSectionAction.NONE) // Нельзя ничего применить
        return null;

      if(res.action == MaskSectionAction.GO_BACK_AND_DELETE && prev_section != null) {
        // Идем в конец левой секции
        // И применяем Delete
        res = prev_section.selectLast(res.newValue, prev_sectionStart, true);
        res = prev_section.applyKey(res.newValue, "Delete", prev_sectionStart, res.newSelStart, res.newSelLength);
        return res;
      }

      if(res.action == MaskSectionAction.GO_BACK_AND_BACKSPACE && prev_section != null) {
        // Идем в конец левой секции
        // И применяем Delete
        res = prev_section.selectLast(res.newValue, prev_sectionStart);
        res = prev_section.applyKey(res.newValue, "Delete", prev_sectionStart, res.newSelStart, res.newSelLength);
        return res;
      }


      if(res.action == MaskSectionAction.GO_BACK && prev_section != null) {
        // Идем в конец левой секции
        return prev_section.selectLast(res.newValue, prev_sectionStart);
      }

      if(res.action == MaskSectionAction.GO_FWD) {
        if(i < this.sections.length - 1) {
          // Идем в начало следующей секции
          let next_section = this.sections[i + 1];
          return next_section.selectFirst(res.newValue, res.nextSectionPos);
        } else {
          // Секция последняя. Скорректируем значение.
          return section.autoCorrect(res.newValue, sectionStart, res.newSelStart, res.newSelLength);
        }
      }

      if(res.action == MaskSectionAction.SKIP) {
        // Переходим к следующей секции

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
        if(section.section == "" && value != res.newValue)
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


  constructor(protected intl: Internationalization) {
    // Здесь нужно подписаться на смену локализации и поменять наименования месяцев
    Mask.selectSection("mmm").variants = this.intl.shortMonthNames.map(el => { return el.toLowerCase(); });
    Mask.selectSection("MMM").variants = this.intl.shortMonthNames.map(el => { return el.toUpperCase(); });
  }
}
