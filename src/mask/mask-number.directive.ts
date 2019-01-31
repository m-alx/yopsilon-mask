// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Directive, ElementRef, Input, Output, HostListener, EventEmitter, Renderer2, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { InternationalizationService } from "../internationalization/internationalization.service";
import { Locale } from "../internationalization/locale.class";

import { Keys } from "../keys/keys.class";

import { MaskState } from "./mask-state.class";
import { MaskSettings } from "./mask-settings.class";
import { MaskSectionAction, MaskSectionKeyResult } from "./mask-section.class";

import { NumberParserFormatter } from "../numbers/number-parser-formatter.class";

@Directive({
    selector: '[yn-mask-number]',
    host: {'(input)': 'input($event.target.value)', '(blur)': 'blur()'},
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MaskNumberDirective),
        multi: true
      }]
})
export class MaskNumberDirective {

  private onChange = (_: any) => {};
  private onTouched = () => {};

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  blur() {
    // Очищаем, если формат неверен
    let value = NumberParserFormatter.parse(this._txtValue, this.format, this._separators);
    if(value == null || isNaN(value))
      this.setText("");
    else
      this.setText(NumberParserFormatter.format(value, this.format, this._separators));

    this.onTouched();
  }

  private _undo: Array<MaskSectionKeyResult> = [];
  private _redo: Array<MaskSectionKeyResult> = [];

  // Текущее числовое значение
  private _numValue: number = null;

  // Текущее текстовое значение
  protected _txtValue: string = "";

  // Смена состояния
  @Output("ynStateChange")
  stateChange = new EventEmitter<MaskState>();

  // Состояние директивы
  private _state: MaskState = null;

  public get state(): MaskState {
    return this._state;
  }

  public set state(v: MaskState) {
    if(this._state != v) {
      this._state = v;
      this.stateChange.emit(this._state); // Излучаем событие
    }
  }

  // Обновляем состояние
  protected updateState() {
    if(this._numValue == null)
      this.state = MaskState.EMPTY;           // Пустое значение
    else {
      if(isNaN(this._numValue))
        this.state = MaskState.TYPING;       // Считаем, что пользователь не завершил ввод
      else
        this.state = MaskState.OK;
    }
  }

  // Sending a value to model
  protected toModel() {
    // Retrieving value
    if(this._txtValue == "")
      this._numValue = null;
    else
      this._numValue = NumberParserFormatter.parse(this._txtValue, this.format, this._separators);

    // Sending to model
    this.onChange(this._numValue);
    // Updating the state
    this.updateState();
  }

  processAndroid(txt: any) {
    //
    let res = this.currentRes();

    // Теоретически положение курсора у нас есть..
    let key: string = Keys.whichKeyHasBeenPressed(this.last_res.newValue, txt,
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
  input(txt: any) {

      if(this.android_behavior) {
        this.processAndroid(txt);
        return;
      }

      // Поэтому пытаемся применить формат к введенному значению.
      let value = NumberParserFormatter.parse(txt, this.format, this._separators);
      if(value == null)
        this.setText("");
      else
        if(!isNaN(value)) {
          this.setText(NumberParserFormatter.format(value, this.format, this._separators), true);
      }
  }

  // Formatter: Ctrl --> View
  writeValue(value: any) {

    this._numValue = value;
    let txt = "";
    if(value != null)
      txt = NumberParserFormatter.format(value, this.format, this._separators);

    if(txt != this._txtValue)
      this.setText(txt, false);

    // No need to send to model, because this processor is called on model change
    // but state still needs to be updated
    this.updateState();
  }

  private _separators: Array<string> = [",", " "];
  private _format: string = "{1.2}";

  @Input("yn-mask-number")
  public set format(f: string) {

    if(this._txtValue != "" && this._format != f) {
      // По сложному пути
      let res = this.currentRes();
      this._format = f;

      let state = NumberParserFormatter.reformat(this._txtValue, this.format, this._separators,
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

  android_behavior: boolean = false;
  last_res: MaskSectionKeyResult;

  @HostListener("keydown", ["$event"])
  keyDown(e: any) {
    return this.processKey(e);
  }


  private isDigit(char: string): boolean {
    if("0123456789".indexOf(char) >= 0)
      return true;

    return false;
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

    let key: string = Keys.keyName(e.keyCode, c);
    let keyCode: string = Keys.keyCode(e.keyCode);

    let selStart: number = e.target.selectionStart;
    let selEnd: number = e.target.selectionEnd;
    let s: string = this._txtValue;

    let state0: any = this.getRes(s, selStart, selEnd);


    if(Keys.isFunctional(e.keyCode))
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

      let canAccept = NumberParserFormatter.canAcceptKey(s, key, this.format, this._separators, selStart, selEnd);

      if(selStart == selEnd) {
        // Ничего не выделено
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
        // Выделено один или более символов
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

      if(NumberParserFormatter.canAcceptKey(s, key, this.format, this._separators, selStart)) {

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

      let state3 = NumberParserFormatter.reformat(s, this.format, this._separators, selStart, selEnd, leadToFormat);
      this.setRes(this.getRes(state3.value, state3.selStart, state3.selEnd));

      if(this.android_behavior)
        return true;

      e.preventDefault();
      return false;
    }
  }

  // Установить значение и положение курсора
  protected setRes(res: MaskSectionKeyResult) {

    if(this.android_behavior)
      res.newSelLength = 0;

    this.setText(res.newValue);
    this._renderer.setProperty(this._elementRef.nativeElement, 'selectionStart', res.newSelStart);
    this._renderer.setProperty(this._elementRef.nativeElement, 'selectionEnd', res.newSelStart + res.newSelLength);
  }

  protected currentRes() {
    let res = new MaskSectionKeyResult(this._txtValue, MaskSectionAction.APPLY, 0);
    res.newSelStart = this._elementRef.nativeElement.selectionStart;
    res.newSelLength = this._elementRef.nativeElement.selectionEnd - res.newSelStart;
    return res;
  }

  // Получить текущее значение маски и положение курсора
  protected getRes(s: string, selStart: number, selEnd: number): MaskSectionKeyResult {
    let res = new MaskSectionKeyResult(s, MaskSectionAction.APPLY, 0);
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

  setLocale(locale: Locale) {
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
      protected intl: InternationalizationService) {
        //
  }
}