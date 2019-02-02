// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Directive, ElementRef, Input, Output, HostListener, EventEmitter, Renderer2, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import * as YN from "yopsilon-mask";

@Directive({
    selector: '[yn-test]',
    host: {'(input)': 'input($event.target.value)', '(blur)': 'blur()'},
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TestDirective),
        multi: true
      }]
})
export class TestDirective {

  private _numValue: number = null;
/*
  // Parse number
  public static parse(txt: string, format: string, separators: Array<string>): any {

    if(txt == "")
      return null;

    let fmt: YN.NumberFormat = null;
    if(format != "") {
      fmt = YN.NumberFormat.parseFormat(format);

      if(fmt == null)
        throw new Error("Invalid format");

      let pl = fmt.postfix.length;
      if(txt.substring(txt.length - pl, txt.length) == fmt.postfix)
        txt = txt.substring(0, txt.length - pl);

      pl = fmt.prefix.length;
      if(txt.substring(0, pl) == fmt.prefix)
        txt = txt.substring(pl, txt.length);
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
    for(let i = 1; i < groups.length; i++)
      pos += groups[i].length + thousandSeparator.length;

    let int: number = +groups.join("");
    let fraction: number = parts.length > 1 && parts[1] != "" ? (+parts[1]) * Math.pow(10, -parts[1].length) : 0;

    let resValue: number = sgn * (int + fraction) * Math.pow(10, orderOfMagnitude);

    return resValue;
  }
*/
/*
  // Проверка
  public static format(value: number, format: string,
    separators: Array<string>,
    selStart: number = 0,
    selEnd: number = 0,
    removeTrailingZeros: boolean = false): any {

    let fmt: YN.NumberFormat = YN.NumberFormat.parseFormat(format);

    if(fmt == null)
      throw new Error("Invalid format");

    if(fmt.specifier.toLowerCase() == "e") {
      // Exponential
      // Пока пропускаем - пока сложно
    }

    let sgn = Math.sign(value) < 0 ? "-" : "";

    if(fmt.signum && sgn == "")
      sgn = "+";

    let num = YN.NumberParserFormatter.roundTo(Math.abs(value), fmt.fractionMax).toFixed(fmt.fractionMax);
    let parts = num.split(".");

    let sInt = parts[0];
    let sFraction = parts.length > 0 ? parts[1] : "";

    // Remove trailing zeros
    while(sFraction.length > fmt.fractionMin && sFraction.substring(sFraction.length - 1) == "0")
      if(removeTrailingZeros) // Нужно оставить сколько есть..
        sFraction = sFraction.substring(0, sFraction.length - 1);

    // Add leading zeros
    while(sInt.length < fmt.integerMin)
      sInt = "0" + sInt;

    if(separators.length > 1) // Thousand separator
      for(let i = 3; i < sInt.length; i += 4) {
        // Необходимо добавить курсору немного позиции, если он стоит дальше этого разделителя...

        if(selStart > (sInt.length - i))
          selStart += separators[1].length;

        if(selEnd > (sInt.length - i))
          selEnd += separators[1].length;

        sInt = sInt.substring(0, sInt.length - i) + separators[1] + sInt.substring(sInt.length - i);
      }

    return { value: fmt.prefix + sgn + sInt + separators[0] + sFraction + fmt.postfix, selStart: selStart, selEnd: selEnd };
  }
*/

  private onChange = (_: any) => {};
  private onTouched = () => {};

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  blur() {
    // Очищаем, если формат неверен
    let value = YN.NumberParserFormatter.parse(this._txtValue, this.format, this._separators);
    if(isNaN(value))
      this.setText("");
    else
      this.setText(YN.NumberParserFormatter.format(value, this.format, this._separators));

    this.onTouched();
  }

  private _undo: Array<YN.MaskResult> = [];
  private _redo: Array<YN.MaskResult> = [];

  // Текущее текстовое значение
  protected _txtValue: string = "";

  // Смена состояния
  @Output("ynStateChange")
  stateChange = new EventEmitter<YN.MaskState>();

  // Состояние маски
  private _state: YN.MaskState = null;

  public get state(): YN.MaskState {
    return this._state;
  }

  public set state(v: YN.MaskState) {
    if(this._state != v) {
      this._state = v;
      this.stateChange.emit(this._state); // Излучаем событие
    }
  }

  // Обновляем состояние
  protected updateState() {
    if(this._numValue == null)
      this.state = YN.MaskState.EMPTY;           // Пустое значение
    else {
      if(isNaN(this._numValue))
        this.state = YN.MaskState.TYPING;       // Считаем, что пользователь не завершил ввод
      else
        this.state = YN.MaskState.OK;
    }
  }

  // Sending a value to model
  protected toModel() {
    // Retrieving value
    if(this._txtValue == "")
      this._numValue = null;
    else
      this._numValue = YN.NumberParserFormatter.parse(this._txtValue, this.format, this._separators);

    // Sending to model
    this.onChange(this._numValue);
    // Updating the state
    this.updateState();
  }

  whichKeyIsPressed(txt1: string, txt2: string,
    selStart1: number, selStart2: number,
    selLength: number): string {

    if(txt1 == txt2 && selStart1 == selStart2 - 1)
      return "ArrowRight";

    if(txt1 == txt2 && selStart1 == selStart2 + 1)
      return "ArrowLeft";

    if(selLength == 1) {
      //
      if(txt1.substring(0, selStart2) == txt2.substring(0, selStart2) )
        if(txt1.substring(selStart2 + 1, txt1.length) == txt2.substring(selStart2, txt2.length))
          return "Backspace";

      if(txt1.substring(0, selStart2) == txt2.substring(0, selStart2) )
        if(txt1.substring(selStart1 + 1, txt1.length) == txt2.substring(selStart2, txt2.length))
          if(selStart1 == selStart2 + 1)
            return "Backspace";

      return txt2.substring(selStart1, selStart1 + 1);
    }

    // прове|рка
    // пров|рка
    if(txt1.substring(0, selStart1 - 1) == txt2.substring(0, selStart1 - 1) )
      if(txt1.substring(selStart1, txt1.length) == txt2.substring(selStart1 - 1, txt2.length))
        return "Backspace";

    // пров|ерка
    // пров|рка
    if(txt1.substring(0, selStart1) == txt2.substring(0, selStart1) )
      if(txt1.substring(selStart1 + 1, txt1.length) == txt2.substring(selStart1, txt2.length))
        return "Delete";

    return txt2.substring(selStart1, selStart1 + 1);
  }

  processAndroid(txt: any) {
    //
    let res = this.currentRes();

    // Теоретически положение курсора у нас есть..
    let key: string = this.whichKeyIsPressed(this.last_res.newValue, txt,
        this.last_res.newSelStart, res.newSelStart, this.last_res.newSelLength);

    let selStart = this.last_res.newSelStart;
    let selEnd = this.last_res.newSelStart;

    // Если текст вдруг стёрся
    if(this.last_res.newValue != "" && txt.length <= 1) {
      if(txt == "")
        key = "Delete";
      else
        key = txt;
      selStart = 0;
      selEnd = this.last_res.newValue.length;
    }

    let r = this.processKey(
      {
        keyCode: -1,
        key: key,
        shiftKey: false,
        ctrlKey: false,
        target: { selectionStart: selStart, selectionEnd: selEnd },
        preventDefault: (_: any) => {}
      });

    if(!r)
      this.setRes(this.last_res); // Не приняли, вернули всё назад

    // Зачем это здесь?.. А вдруг..
    this.android_behavior = false;
    return;
  }

  // Пользователь вносит значение. Parser: View --> Ctrl
  // Только то, что не обработано маской
  input(txt: any) {

      if(this.android_behavior) {
        this.processAndroid(txt);
        return;
      }
      console.log("INPUT", txt);

      // Поэтому пытаемся применить маску к введенному значению.
      let value = YN.NumberParserFormatter.parse(txt, this.format, this._separators);
      if(value == null)
        this.setText("");
      else
        if(!isNaN(value)) {
          this.setText(YN.NumberParserFormatter.format(value, this.format, this._separators), true);
      }
  }

  // Formatter: Ctrl --> View
  writeValue(value: any) {

    this._numValue = value;
    let txt = "";
    if(value != null)
      txt = YN.NumberParserFormatter.format(value, this.format, this._separators);

    if(txt != this._txtValue)
      this.setText(txt, false);

    // No need to send to model, because this processor is called on model change
    // but state still needs to be updated
    this.updateState();
  }

  private _separators: Array<string> = [",", " "];
  private _format: string = "{1.2}";

  @Input("yn-test")
  public set format(f: string) {

    if(this._txtValue != "" && this._format != f) {
      // По сложному пути

      let res = this.currentRes();
      this._format = f;

      let state = YN.NumberParserFormatter.reformat(this._txtValue, this.format, this._separators,
        res.newSelStart, res.newSelStart + res.newSelLength, true);

      this.setRes(this.getRes(state.value, state.selStart, state.selEnd));

    } else
      this._format = f;
  }

  public get format(): string {

    if(this._format == "currency")
      return this.intl.locale.currency;

    return this._format;
  }

  /*
  @Input("yn-mask-settings")
  set settings(v: YN.MaskSettings) {
    this._mask.settings = v;
  }*/

  android_behavior: boolean = false;
  last_res: YN.MaskResult;

  @HostListener("keydown", ["$event"])
  keyDown(e: any) {
    return this.processKey(e);
  }


  private isDigit(char: string): boolean {
    if("0123456789".indexOf(char) >= 0)
      return true;

    return false;
  }

  // Разделяем на префикс, число, постфикс
  public static unclotheNumber(txt: string, fmt: YN.NumberFormat): any {

    if(txt == null)
      return { prefix: "", number: "", postfix: "" };

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

  // Разделяем число на составляющие
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

  protected processKey(e: any): boolean {

    if(e.keyCode == 229 || e.keyCode == 0 || e.keyCode == undefined) { // test: if(e.keyCode >= 0) ...
      // Android detected
      this.android_behavior = true;
      this.last_res = this.currentRes();
      return;
    }

    // Редактируем числовое значение
    let c: string = e.char;
    if(c == undefined)
      c = e.key;

    let key: string = YN.Keys.keyName(e.keyCode, c);
    let keyCode: string = YN.Keys.keyCode(e.keyCode);

    let selStart: number = e.target.selectionStart;
    let selEnd: number = e.target.selectionEnd;
    let s: string = this._txtValue;

    let state0: any = this.getRes(s, selStart, selEnd);


    if(YN.Keys.isFunctional(e.keyCode))
      return true;

    if(key == "Tab")
      return true;

    if(key == "Alt")
      return true;

    if(key == "Home" || key == "End")
      return true;

    if(e.ctrlKey && (keyCode == "KeyA" || keyCode == "KeyX" || keyCode == "KeyC" || keyCode == "KeyV" || key == "Insert"))
      return true;

    if(e.shiftKey && (key == "Delete" || key == "Insert")) {
      return true;
    }

    if(e.ctrlKey && keyCode == "KeyZ") {
      // UNDO
      let undoRes = this._undo.pop();
      if(undoRes) {
        this._redo.push(this.getRes(s, selStart, selEnd));
        this.setRes(undoRes);
      }
      e.preventDefault();
      return false;
    }

    if(e.ctrlKey && keyCode == "KeyY") {
      // REDO
      let redoRes = this._redo.pop();
      if(redoRes) {
        this._undo.push(this.getRes(s, selStart, selEnd));
        this.setRes(redoRes);
      }
      e.preventDefault();
      return false;
    }

    if(selStart == 0 && selEnd == this._txtValue.length) {
      s = "";
      selStart = 0;
      selEnd = 0;
    }

    let leadToFormat = false; //true;
    let applied = false;

    if(key == "Backspace" || key == "Delete") {

      let canAccept = YN.NumberParserFormatter.canAcceptKey(s, key, this.format, this._separators, selStart, selEnd);

      if(selStart == selEnd) {

        if(key == "Backspace" && selStart > 0) {
          if(canAccept)
            s = s.substring(0, selStart - 1) + s.substring(selEnd);

          selStart--;
          selEnd--;
        }

        if(key == "Delete") {
          if(canAccept)
            s = s.substring(0, selStart) + s.substring(selEnd + 1);
          else {
            selStart++;
            selEnd++;
          }
        }

        applied = true;
      }

      if(selStart < selEnd) {

        let fragmentToDelete = s.substring(selStart, selEnd);

        if(canAccept) {
          if(fragmentToDelete.indexOf(this._separators[0])>=0)
            s = s.substring(0, selStart) + this._separators[0] + s.substring(selEnd);
          else
            s = s.substring(0, selStart) + s.substring(selEnd);
        }

        selEnd = selStart;
        applied = true;
      }
    }

    if(key.length == 1) {

      s = s.substring(0, selStart) + s.substring(selEnd);

      if(YN.NumberParserFormatter.canAcceptKey(s, key, this.format, this._separators, selStart)) {

        s = s.substring(0, selStart) + key + s.substring(selStart);
        selStart++;
        selEnd = selStart;
        applied = true;
      } else {
        e.preventDefault();
        return false;
      }
    }

    if(applied) {
      // При изменении значения внесем в стэк undo
      if(s != state0.newValue) {
        this._undo.push(state0);
        this._redo = [];
      }

      let state3 = YN.NumberParserFormatter.reformat(s, this.format, this._separators, selStart, selEnd, leadToFormat);
      this.setRes(this.getRes(state3.value, state3.selStart, state3.selEnd));

      if(this.android_behavior)
        return true;

      e.preventDefault();
      return false;
    }

    //}

    /*
    // Применяем всё, что осталось
    let res: YN.MaskResult = this.applyKeyAtPosNumeric(s, key, selStart, selEnd);

    if(res != null && res.action == YN.MaskSectionAction.APPLY) {

      // При изменении значения внесем в стэк undo
      if(res.newValue != s) {
        this._undo.push(this.getRes(s, selStart, selEnd));
        this._redo = [];
      }

      this.setRes(res);

      if(this.android_behavior)
        return true; // ???? Для процесскея норм, а для инпута не очень.
    }

    e.preventDefault();
    return false; */
  }

  // Установить значение и положение курсора
  protected setRes(res: YN.MaskResult) {

    if(this.android_behavior)
      res.newSelLength = 0;

    this.setText(res.newValue);
    this._renderer.setProperty(this._elementRef.nativeElement, 'selectionStart', res.newSelStart);
    this._renderer.setProperty(this._elementRef.nativeElement, 'selectionEnd', res.newSelStart + res.newSelLength);
  }

  protected currentRes() {
    let res = new YN.MaskResult(this._txtValue, YN.MaskSectionAction.APPLY, 0);
    res.newSelStart = this._elementRef.nativeElement.selectionStart;
    res.newSelLength = this._elementRef.nativeElement.selectionEnd - res.newSelStart;
    return res;
  }

  // Получить текущее значение маски и положение курсора
  protected getRes(s: string, selStart: number, selEnd: number): YN.MaskResult {
    let res = new YN.MaskResult(s, YN.MaskSectionAction.APPLY, 0);
    res.newSelStart = selStart;
    res.newSelLength = selEnd - selStart;
    return res;
  }

  // Записывает текст в контрол
  protected setText(displayedValue: string, toModel: boolean = true) {

    // Отображаем
    this._txtValue = displayedValue;
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', this._txtValue);

    // Отправляем в модель
    if(toModel)
      this.toModel();
  }

  setLocale(locale: YN.Locale) {
    this._separators[0] = locale.separators[0];
    this._separators[1] = locale.separators[1];

    this.writeValue(this._numValue); // Updating view
  }

  localeSubscription: any;

  ngOnInit() {
    // Format change can follow locale change
    this.localeSubscription = this.intl.onLocaleChange.subscribe(locale => {
      this.setLocale(locale);
    });
  }

  ngOnDestroy() {
    // Unsubscribing
    this.localeSubscription.unsubscribe();
  }

  constructor(protected _renderer: Renderer2,
      protected _elementRef: ElementRef,
      protected intl: YN.InternationalizationService) {
        //
  }
}
