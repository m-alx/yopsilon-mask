// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Internationalization } from "../internationalization/internationalization.class";
import { MaskSectionType } from "./mask-section-type.class";
import { MaskOptions } from "./mask-options.class";

import { MaskSectionValue } from "./mask-section-value.class";
import { MaskValue } from "./mask-value.class";

// Действия, которые может инициировать секция
export class MaskSectionAction {

  static NONE = new MaskSectionAction("NONE");
  static APPLY = new MaskSectionAction("APPLY");
  static SKIP = new MaskSectionAction("SKIP");
  static GO_FWD = new MaskSectionAction("GO_FWD");
  static GO_BACK = new MaskSectionAction("GO_BACK");
  static GO_BACK_AND_DELETE = new MaskSectionAction("GO_BACK_AND_DELETE");
  static GO_BACK_AND_BACKSPACE = new MaskSectionAction("GO_BACK_AND_BACKSPACE");

  constructor(public name: string) { }
}

export class MaskSectionKeyResult {

  public inSection: boolean;
  public newSelStart: number;
  public newSelLength: number;

  constructor(
      public newValue: string,
      public action: MaskSectionAction,
      public nextSectionPos: number
  ) { }
}

// Секция маски
export class MaskSection {

  // Конструктор класса
  constructor(
    public intl: Internationalization,
    public options: MaskOptions,
    public section: string, // Общее значение маски
    public delimiter: string,
    public sectionType: MaskSectionType = null
    ) {
      //
  }

  // Длина секции
  public get length(): number {
    return this.section.length;
  }

  // Наибольшая длина
  public get maxLength(): number {

    if(this.hasVariants()) {
      let ml: number = 0;
      this.sectionType.variants.forEach(v => {
        if(v.length > ml)
          ml = v.length;
      });
      return ml;
    }

    if(this.sectionType && this.sectionType.max && ("" + this.sectionType.max).length > this.section.length)
      return ("" + this.sectionType.max).length;
    else
      return this.section.length;
  }

  private isEmpty(): boolean {
    return this.section == "";
  }

  public hasVariants(): boolean {
    return this.sectionType != null && this.sectionType.variants != null && this.sectionType.variants.length > 0;
  }

  public hasRegExp(): boolean {
    return this.sectionType != null && this.sectionType.regExp != null;
  }

  public isNumeric(): boolean {
    return this.sectionType && this.sectionType.digits && !this.sectionType.alpha;
  }

  public numericValue(value: string): number {
    return +value;
  }

  public checkMinMax(n: number): number {

    if(!this.sectionType)
      return n;

    if(this.sectionType.min != undefined && n < this.sectionType.min)
        n = this.sectionType.min;

    if(this.sectionType.max != undefined && n > this.sectionType.max)
        n = this.sectionType.max;

    return n;
  }

  // Очистка строки от плэйсхолдеров
  removePlaceholders(txt: string): string {
    return txt.split(this.options.placeholder).join("");
  }

  // Следующее значение секции при нажатии стрелки вверх
  private incValue(value: string): string {

    // Следующий вариант
    if(this.hasVariants()) {
      let i = this.sectionType.variants.indexOf(value);
      return i < this.sectionType.variants.length - 1 ? this.sectionType.variants[i + 1] : this.sectionType.variants[0];
    }

    // Следующее числовое значение
    if(this.isNumeric() && this.sectionType.max != undefined) {
      let n = this.numericValue(value);
      if(isNaN(n))
        n = this.sectionType.min == undefined ? 0 : this.sectionType.min;
      else
        n++;

      let res = "" + this.checkMinMax(n);
      while(res.length < this.length)
          res = "0" + res;

      return res;
    }

    // Не нашлось - возвращаем текущее значение
    return value;
  }

  // Предыдущее значение секции при нажатии стрелки вниз
  private decValue(value: string): string {

    // Предыдущий вариант
    if(this.hasVariants()) {
      let i = this.sectionType.variants.indexOf(value);
      return i > 0 ? this.sectionType.variants[i - 1] : this.sectionType.variants[this.sectionType.variants.length - 1];
    }

    // Предыдущее числовое значение
    if(this.isNumeric() && this.sectionType.min != undefined) {
      let n = this.numericValue(value);
      if(isNaN(n))
        n = this.sectionType.min == undefined ? 0 : this.sectionType.max;
      else
        n--;

      let res = "" + this.checkMinMax(n);
      while(res.length < this.length)
          res = "0" + res;

      return res;
    }

    // Не нашлось - возвращаем текущее значение
    return value;
  }

  // Автоматическая корректировка значения секции
  public autoCorrectValue(s: string): string {

    if(!this.sectionType)
      return s;

    if(this.hasVariants()) {
      let variant = this.sectionType.variants.find(v => v.toLowerCase() == s.toLowerCase());
      if(!variant)
        s = this.sectionType.variants.length > 0 ? this.sectionType.variants[0] : "";
      return s;
    }

    //let res: string = this.removePlaceholders(s);
    //if(res != s)
      //return s;
    let res = s;

    let n: number = this.numericValue(res);

    if(this.isNumeric()) {

      let n = this.numericValue(res);

      // Ожидается числовое значение
      if(isNaN(n))
        n = this.sectionType.min == undefined ? 0 : this.sectionType.min;

      // Число распознано. Проверяем минимальное и максимальное значения.
      // Но только если включена опция автокорректировки.
      // Иначе вернется просто чистое числовое значение нужной длины.
      if(this.options.autoCorrect)
        n = this.checkMinMax(n);

      res = "" + n;
      while(res.length < this.length)
          res = "0" + res;
    }

    while(res.length < this.length)
      res += this.options.placeholder;

    return res;
  }

  // С помощью этого метода секция извлекает свое значение из общего значения
  public extractSectionValue(
    maskValue: string, // Общее значение маски
    sectionPos: number,   // Индекс первого символа секции в значении
    selStart: number = 0,
    selLength: number = 0
  ): MaskValue
  {
    let res = new MaskValue();

    let len = this.length;
    let i2 = sectionPos + len;

    // Переменная ширина все портит...
    if(this.length < this.maxLength) {
      // ...поэтому здесь должен быть небольшой блок, который смотрит сколько до разделителя или до конца строки,
      // но не больше чем MaxLength
      let i = sectionPos;
      while(i < maskValue.length && i < (sectionPos + this.maxLength)) {
        if(this.delimiter != "" && maskValue[i] == this.delimiter[0])
          break;
        i++;
      }
      i2 = i;
      len = i2 - sectionPos;
    }

    // Разделителя может не быть...
    let delimiterStart = i2;
    let delimiterEnd = delimiterStart;

    if(this.delimiter != "") {
      while(delimiterEnd < maskValue.length) {
        let c = maskValue[delimiterEnd];
        if(c == this.delimiter[delimiterEnd - delimiterStart])
          delimiterEnd++;
        else
          break;
      }
    }

    if(i2 > maskValue.length)
      i2 = maskValue.length;
    if(delimiterEnd > maskValue.length)
      delimiterEnd = maskValue.length;

    let sectionValue = maskValue.substring(sectionPos, i2);

    if(sectionValue.length > this.maxLength) {
      console.log("Invalid value length: " + sectionValue);
      sectionValue = sectionValue.substring(0, this.maxLength - 1);
    }

    let selStart_local = selStart - sectionPos;

    res.sectionPos = sectionPos;

    res.beforeValue = maskValue.substring(0, sectionPos); // До секции
    res.sectionValue = new MaskSectionValue(sectionValue, sectionPos, selStart); // Значение секции
    res.delimiter = maskValue.substring(delimiterStart, delimiterEnd); // Разделитель
    res.afterValue = maskValue.substring(delimiterEnd);  // После секции

    res.inSection = selStart_local >= 0 && selStart_local <= res.sectionValue.length;

    return res;
  }

  private skip(mv: MaskValue, selStart: number): MaskSectionKeyResult {
    let res: MaskSectionKeyResult = new MaskSectionKeyResult(mv.value(), MaskSectionAction.SKIP, mv.nextSectionPos());
    res.newSelStart = selStart;
    return res;
  }

  private none(mv: MaskValue): MaskSectionKeyResult {
    let res: MaskSectionKeyResult = new MaskSectionKeyResult(mv.value(), MaskSectionAction.NONE, mv.nextSectionPos());
    return res;
  }

  // Результат воздействия на секцию - клавиша применена
  private apply(mv: MaskValue, newSectionValue: string, selStart: number, direction: number = 1, isLast: boolean = false): MaskSectionKeyResult {

    let selStart_local = selStart - mv.sectionPos;

    // Если секция последняя и длина значения равняется максимально возможной длине и курсор стоит в конце строки...
    // ... то корректируем значение
    if(isLast && newSectionValue.length == this.maxLength && selStart_local >= newSectionValue.length - 1)
      newSectionValue = this.autoCorrectValue(newSectionValue);

    // Обновляем значение
    mv.update(newSectionValue, selStart);

    // Решаем, что делать дальше
    if(direction > 0)
      return this.goFwd(mv, selStart, 1, false); // Идем вперед
    else
      if(direction < 0)
        return this.goBack(mv, selStart, 1, false); // Идем назад
      else {
        // Остаемся на месте
        let res: MaskSectionKeyResult = new MaskSectionKeyResult(mv.value(), MaskSectionAction.APPLY, mv.nextSectionPos());
        res.newSelStart = selStart;
        res.newSelLength = this.options.replaceMode && selStart_local < this.length ? 1 : 0;
        return res;
      }
  }

  // Результат воздействия на секцию - клавиша с символом разделителя применена
  private applyDelimiter(mv: MaskValue, selStart: number): MaskSectionKeyResult
  {
    // Необходима автокорректировка значения
    let sv = this.autoCorrectValue(mv.sectionValue.value());

    mv.update(sv, selStart)
    mv.delimiter = this.delimiter;

    // И идем дальше
    let res: MaskSectionKeyResult = new MaskSectionKeyResult(mv.value(), MaskSectionAction.GO_FWD, mv.nextSectionPos());
    res.newSelStart = mv.nextSectionPos();
    return res;
  }

  // Движение курсора назад
  private goBack(mv: MaskValue, selStart: number, selLength: number, byBackspace: boolean = false): MaskSectionKeyResult
  {
    let res: MaskSectionKeyResult = new MaskSectionKeyResult(mv.value(), MaskSectionAction.APPLY, mv.nextSectionPos());

    if(selStart == 0 && selLength <= 1) {
      // Частный случай - выделен первый символ. Ставим курсор в начало строки.
      res.newSelLength = 0;
      return res;
    }

    res.newSelStart = selStart - 1;
    res.newSelLength = this.options.replaceMode ? 1 : 0;

    let selStart_local = res.newSelStart - mv.sectionPos;

    if(selStart_local >= this.length && selStart_local >= mv.sectionValue.length)
      res.newSelLength = 0;

    let newSelStart_local = res.newSelStart - mv.sectionPos;
    if(newSelStart_local < 0 && mv.beforeValue != "")
      res.action = byBackspace ? MaskSectionAction.GO_BACK_AND_DELETE : MaskSectionAction.GO_BACK;

    if(res.newSelStart < 0)
      res.newSelStart = 0;

    if(res.newSelLength == 0 && selStart == 0)
      res.newSelLength = 0;

    return res;
  }

  // Движение курсора вперед
  private goFwd(mv: MaskValue, selStart: number, selLength: number, appendDelimiter: boolean = false): MaskSectionKeyResult
  {
    let selStart_local: number = selStart - mv.sectionPos;

    let res: MaskSectionKeyResult = new MaskSectionKeyResult(mv.value(), MaskSectionAction.APPLY, mv.nextSectionPos());

    // Режим замены, selLength == 0 и что-то есть непустое.
    if(this.options.replaceMode && selLength == 0 && mv.sectionValue.currentChar != "") {
      // Остаемся на месте и выделяем следующий символ
      res.newSelStart = selStart;
      res.newSelLength = 1;
    } else {
      // Передвигаемся на один символ вперед
      if(mv.afterValue != "" || mv.sectionValue.afterChars != "") {
        res.newSelStart = selStart + 1;
        res.newSelLength = (mv.sectionValue.currentChar != "" && this.options.replaceMode) ? 1 : 0;

        // Секция с переменной длиной. Если мы в конце ее, то selLength = 0
        if(res.newSelStart - mv.sectionPos >= this.length && mv.sectionValue.afterChars == "")
          res.newSelLength = 0;
      } else
        {
          // Дальше ничего нет, просто ставим курсор в самый конец
          res.newSelStart = selStart + 1;
          res.newSelLength = 0;
        }
    }

    let newSelStart_local = res.newSelStart - mv.sectionPos;

    // Мы вышли за пределы
    if(newSelStart_local > mv.sectionValue.length || (newSelStart_local == this.maxLength && mv.afterValue != "")) {
      // Ну попробуем автокорректировку
      let v = this.autoCorrectValue(mv.sectionValue.value());

      // После этого положение курсора и следующей секции может измениться
      mv.update(v, selStart);
      res.newValue = mv.value();
      res.nextSectionPos = mv.nextSectionPos();
      res.newSelStart = mv.sectionValue.length;

      // Идем к следующей секции
      res.action = MaskSectionAction.GO_FWD;
    }

    return res;
  }

  // Проверка применимости клавиши к секции
  // Нам необходимо вернуть:
  //    - применена ли клавиша
  //    - новое значение секции
  //    - новое положение курсора
  //    - новую длину выделения
  applyKey(value: string, // Значение маски
      key: string,               // Нажатая клавиша
      sectionPos: number,        // Индекс первого символа маски
      selStart: number, // = null,          // Текущая позиция курсора
      selLength: number, // = null,         // Количество выделенных символов
      acceptDelimiterChars: boolean = false, // Принимать ли символы разделителя
      isLast: boolean = false
    ): MaskSectionKeyResult
    {
      // Парсим
      let mv: MaskValue = this.extractSectionValue(value, sectionPos, selStart, selLength);

      // Курсор находится до секции. Не реагируем.
      if(selStart < sectionPos)
        return this.none(mv);

      // Курсор находится дальше секции. Пропускаем эту секци.
      if(!mv.inSection)
        return this.skip(mv, selStart);

      // Положение курсора относительно начала текущей секции
      let selStart_local = selStart - sectionPos;

      // Если курсор в конце секции.. И у секции нет разделителя..
      // И в следующей секции что-то есть..
      // То мы уже не в этой секции, а в начале следующей. Отправляем SKIP
      if(selStart_local == this.maxLength && this.delimiter == "" && mv.afterValue != "")
        return this.skip(mv, selStart);

      if(key != this.delimiter[0] || !acceptDelimiterChars) {

        if(this.isEmpty() || // Пустая секция ИЛИ...
            (selStart == (sectionPos + mv.sectionValue.length) && // Мы находимся в конце секции
             mv.sectionValue.length == this.maxLength &&          // Содержимое этой секции внесено полностью
             key.length == 1)
        ) {
          // Добавляем разделитель при необходимости
          // Устанавливаем скорректированное значение и просим перейти к следующей секции
          mv.delimiter = this.delimiter;
          mv.update(this.autoCorrectValue(mv.sectionValue.value()), selStart);
          return this.skip(mv, mv.nextSectionPos()); // В начало следующей секции
        }
      }

      // Нажата одиночный символ
      if(key.length == 1)  {

        // Потенциально новое значение
        let cValue = mv.sectionValue.beforeChars;
        cValue += key;

        // Секция ограничена списком возможных значений
        if(this.hasVariants() && cValue != mv.sectionValue.beforeChars) {
          let variantFound: string = null;
          this.sectionType.variants.some(variant => {
            if(selStart_local < variant.length && variant.substring(0, cValue.length).toLowerCase() == cValue.toLowerCase()) {
              variantFound = variant;
              return true;
            }
            return false;
          });

          if(variantFound != null)
            return this.apply(mv, variantFound, selStart, 1, isLast);
        }

        // Регулярное выражение
        if(this.hasRegExp()) {
          // Новое значение будет таким:
          let nv: string = mv.sectionValue.value(key);
          // И может нам подойти
          if(nv.match(this.sectionType.regExp))
            return this.apply(mv, nv, selStart, 1, isLast);
        }

        // Секция настроена типами символов
        if(!this.hasVariants() && !this.isEmpty() && this.sectionType.regExp == null) {
          let isOk: boolean = false;

          if(selStart_local < this.maxLength) {

            if(this.sectionType.digits && this.intl.isDigit(key))
              isOk = true;

            if(this.sectionType.alpha && this.intl.isLetter(key))
              isOk = true;

            if(this.section == "*" && (this.intl.isLetter(key) || this.intl.isDigit(key))) // Возможно специальные символы понадобятся
              isOk = true;
          }

          if(isOk)
            return this.apply(mv, mv.sectionValue.value(key), selStart, 1, isLast);
        }

        // Введен символ разделителя. Переход на следующую секцию
        if(this.delimiter != "" && key == this.delimiter[0] && acceptDelimiterChars) {
          if(selStart_local == 0 && !this.isEmpty()) // Если ничего не внесено, то смысла нет переходить на следующую секцию
            return this.apply(mv, mv.sectionValue.value(), selStart, 0);
          return this.applyDelimiter(mv, selStart);
        }
      }

      // Клавиша Delete
      if(key == "Delete") {

        // Переменная длина секции. Мы больше минимальной длиниы
        if(selStart_local >= this.length && mv.sectionValue.afterChars == "") {
          if(mv.afterValue == "")
            mv.delimiter = "";
          return this.apply(mv, mv.sectionValue.beforeChars, selStart, 0);
        }

        if(mv.afterValue == "" &&  mv.sectionValue.afterChars == "") {
          // За удаляемым символом нет больше данных
          mv.delimiter = "";
          return this.apply(mv, mv.sectionValue.beforeChars, selStart, 0);
        }
        else
          return this.apply(mv, mv.sectionValue.value(this.options.placeholder), selStart, 0);
      }

      // Клавиша Backspace
      if(key == "Backspace") {

        if(mv.sectionValue.length == 0)
          return this.goBack(mv, selStart, selLength, true);

        if(mv.sectionValue.beforeChars == "") {
          // Нечего удалить в текущей секции
          if(mv.beforeValue == "")
            return this.none(mv);

          // Удаляем в предыдущей секции
          return this.goBack(mv, selStart, selLength, true);
        }

        mv.sectionValue.beforeChars = mv.sectionValue.beforeChars.substring(0, mv.sectionValue.beforeChars.length - 1);

        if((mv.sectionValue.beforeChars.length >= this.length && mv.afterValue == "") || (mv.sectionValue.currentChar == "" && mv.afterValue == "")) {
          // Удаляем совсем
          // Нужно и разделитель убрать
          mv.delimiter = "";
        }
        else // Заменяем плэйсхолдером
        {
          if(mv.sectionValue.beforeChars.length < this.length)
            mv.sectionValue.beforeChars += this.options.placeholder;
        }

        return this.apply(mv, mv.sectionValue.value(), selStart, -1);
      }

      // Идем назад
      if(key == "ArrowLeft")
        return this.goBack(mv, selStart, selLength);

      // Идем вперед
      if(key == "ArrowRight")
        return this.goFwd(mv, selStart, selLength);

      // Инкрементируем значение секции клавишей "Вверх"
      if(key == "ArrowUp" && this.options.incrementDecrementValueByArrows)
        return this.apply(mv, this.incValue(mv.sectionValue.value()), selStart, 0);

      // Декрементируем значение секции клавишей "Вниз"
      if(key == "ArrowDown" && this.options.incrementDecrementValueByArrows)
        return this.apply(mv, this.decValue(mv.sectionValue.value()), selStart, 0);

    return this.none(mv);
  }

  // Если не заполнена секция - заполняем первым вариантом
  setDefaultVariant(value: string, sectionPos: number):string {

    if(!this.options.defaultVariants)
      return value;

    if(!this.hasVariants())
      return value;

    // Теми инструментами, которые есть у нас..

    // Получаем значение секции
    let mv: MaskValue = this.extractSectionValue(value, sectionPos, 0, 0);

    // Очищаем от плэйсхолдеров
    let s = this.removePlaceholders(mv.sectionValue.value());

    // Если пустое значение
    if(s == "")
    {
      let applyResult: MaskSectionKeyResult = this.apply(mv, this.sectionType.variants[0], 0, 0);
      value = applyResult.newValue;
    }

    return value;
  }

  // Выделение первого символа в секции
  selectFirst(value: string, sectionPos: number): MaskSectionKeyResult {

    let mv: MaskValue = this.extractSectionValue(value, sectionPos, sectionPos, 0);
    let res: MaskSectionKeyResult = new MaskSectionKeyResult(mv.value(), MaskSectionAction.APPLY, mv.nextSectionPos());

    res.newSelStart = sectionPos;
    res.newSelLength = this.options.replaceMode ? 1 : 0;
    if(this.isEmpty())
      res.newSelLength = 0;

    return res;
  }

  // Выделение последнего символа в секции
  selectLast(value: string, sectionPos: number, forDelete: boolean = false): MaskSectionKeyResult {

    let mv: MaskValue = this.extractSectionValue(value, sectionPos, sectionPos, 0);
    let res: MaskSectionKeyResult = new MaskSectionKeyResult(mv.value(), MaskSectionAction.APPLY, mv.nextSectionPos());

    if(!this.options.replaceMode) {
      // Нужно встать перед последним символом
      res.newSelStart = sectionPos + mv.sectionValue.length - 1;
      res.newSelLength = 0;
      return res;
    }

    if((!forDelete && mv.sectionValue.length >= this.length && mv.sectionValue.length < this.maxLength) || this.isEmpty()) {
      // Мы не заполнили секцию целиком
      res.newSelStart = sectionPos + mv.sectionValue.length;
      res.newSelLength = 0;
    } else {
      // Заполнили - выделяем последний символ
      res.newSelStart = sectionPos + mv.sectionValue.length - 1;
      res.newSelLength = 1;
    }

    return res;
  }

  // Автокорректировка значения. Возвращает всё необходимое для применения изменений к контролу.
  autoCorrect(value: string, sectionPos: number, selStart: number, selLength: number): MaskSectionKeyResult {

    // Парсинг
    let mv: MaskValue = this.extractSectionValue(value, sectionPos, selStart, 0);
    let v = mv.sectionValue.value();

    // Корректировка значения
    v = this.autoCorrectValue(v);

    // Обновление результата
    mv.update(v, selStart);
    let res: MaskSectionKeyResult = new MaskSectionKeyResult(mv.value(), MaskSectionAction.APPLY, mv.nextSectionPos());
    res.newSelStart = res.newValue.length;
    res.newSelLength = 0;

    return res;
  }
}
