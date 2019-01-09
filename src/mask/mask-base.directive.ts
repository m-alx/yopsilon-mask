// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Output, Directive, ElementRef, Renderer2, EventEmitter } from "@angular/core";
import { Internationalization } from "../internationalization/internationalization.class";
import { Mask } from "./mask.class";
import { Keys } from "../keys/keys.class";
import { MaskSectionAction, MaskSectionKeyResult } from "./mask-section.class";
import { MaskOptions } from "./mask-options.class";
import { MaskState } from "./mask-state.class";

@Directive({
    selector: '[yn-mask-base]'
})
export abstract class MaskBaseDirective {

    private _undo: Array<MaskSectionKeyResult> = [];
    private _redo: Array<MaskSectionKeyResult> = [];

    // Текущее текстовое значение
    protected _txtValue: string = "";
    protected _mask: Mask;

    // Смена состояния
    @Output("ynStateChange")
    stateChange = new EventEmitter<MaskState>();

    // Состояние маски
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

    protected updateState() {
      //
    }

    protected processKey(e: any): void {
      let c: string = e.char;
      if(c == undefined)
        c = e.key;

      let key: string = Keys.keyName(e.keyCode, c);
      let keyCode: string = Keys.keyCode(e.keyCode);

      let selStart: number = e.target.selectionStart;
      let selEnd: number = e.target.selectionEnd;
      let s = this._txtValue;

      if(Keys.isFunctional(e.keyCode))
        return;

      if(key == "Tab")
        return;

      if(key == "Alt")
        return;

      if(key == "Home" || key == "End")
        return;

      if(e.ctrlKey && (keyCode == "KeyA" || keyCode == "KeyX" || keyCode == "KeyC" || keyCode == "KeyV" || key == "Insert"))
        return;

      if(e.shiftKey && (key == "Delete" || key == "Insert")) {
        return;
      }

      if(e.ctrlKey && keyCode == "KeyZ") {
        // UNDO
        let undoRes = this._undo.pop();
        if(undoRes) {
          this._redo.push(this.getRes(s, selStart, selEnd));
          this.setRes(undoRes);
        }
        e.preventDefault();
        return;
      }

      if(e.ctrlKey && keyCode == "KeyY") {
        // REDO
        let redoRes = this._redo.pop();
        if(redoRes) {
          this._undo.push(this.getRes(s, selStart, selEnd));
          this.setRes(redoRes);
        }
        e.preventDefault();
        return;
      }

      // Если выделено всё
      if(selStart == 0 && selEnd == this._txtValue.length)
      {
        if(key == "Delete" || key == "Backspace")
          return;

        // Если стрелка влево, то всё равно что Home
        if(key == "ArrowLeft") {
          selStart = 0;
          this._renderer.setProperty(this._elementRef.nativeElement, 'selectionStart', selStart);
          this._renderer.setProperty(this._elementRef.nativeElement, 'selectionEnd', selStart);
          return;
        }

        if(key == "ArrowRight") {
          selStart = this._txtValue.length;
          this._renderer.setProperty(this._elementRef.nativeElement, 'selectionStart', selStart);
          this._renderer.setProperty(this._elementRef.nativeElement, 'selectionEnd', selStart);
          return;
        }
      }

      if(selStart == 0 && selEnd == this._txtValue.length) {
        s = "";
        selStart = 0;
        selEnd = 0;
      }

      // Применяем всё, что осталось
      let res: MaskSectionKeyResult = this._mask.applyKeyAtPos(s, key, selStart, selEnd);

      if(res != null && res.action == MaskSectionAction.APPLY) {

        // При изменении значения внесем в стэк undo
        if(res.newValue != s) {
          this._undo.push(this.getRes(s, selStart, selEnd));
          this._redo = [];
        }

        this.setRes(res);
      }

      e.preventDefault();
    }

    // Установить значение и положение курсора
    protected setRes(res: MaskSectionKeyResult) {
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

    // Необходимо будет переопределить этот метод..
    protected abstract toModel(): void;

    // Записывает текст в контрол
    protected setText(displayedValue: string, toModel: boolean = true) {

      // Отображаем
      this._txtValue = displayedValue;
      this._renderer.setProperty(this._elementRef.nativeElement, 'value', this._txtValue);

      // Отправляем в модель
      if(toModel)
        this.toModel();
    }

    constructor(protected _renderer: Renderer2, protected _elementRef: ElementRef, protected intl: Internationalization) {
      this._mask = new Mask(this.intl);
    }
}
