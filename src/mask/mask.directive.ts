// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yn

import { Directive, ElementRef, Input, HostListener, Renderer2, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Internationalization } from "../internationalization/internationalization.class";
import { Mask } from "./mask.class";
import { Keys } from "../keys/keys.class";
import { MaskSectionAction, MaskSectionKeyResult } from "./mask-section.class";


@Directive({
    selector: '[yn-mask]',
    host: {'(input)': 'input($event.target.value)', '(blur)': 'blur()'},
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MaskDirective),
        multi: true}]
})
export class MaskDirective implements ControlValueAccessor {

    private _undo: Array<MaskSectionKeyResult> = [];
    private _redo: Array<MaskSectionKeyResult> = [];

    private _mask: Mask;
    private _txtValue: string;

    private onChange = (_: any) => {};
    private onTouched = () => {};

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    blur() {
      this.onTouched();
    }

    // Parser: View --> Ctrl
    input(value: any) {
        // Write back to model
        let masked = this._mask.applyMask(value);
        if(value != this._txtValue) {
          this.writeValue(masked);
        }

        this.onChange(masked);
    }

    // Formatter: Ctrl --> View
    writeValue(value: any): void {

      this._txtValue = value;
      console.log(value);
      this._renderer.setProperty(this._elementRef.nativeElement, 'value', this._txtValue);
    }

    @Input("yn-mask")
    public set mask(m: string) {
      this._mask.mask = m;
    }

    public get mask(): string {
      return this._mask.mask;
    }

    @HostListener("keydown", ["$event"])
    keyDown(e: any) {
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
        //console.log("UNDO");
        // UNDO
        let undoRes = this._undo.pop();
        if(undoRes) {
          console.log(undoRes);
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

    private setRes(res: MaskSectionKeyResult) {

      this.writeValue(res.newValue);
      this._renderer.setProperty(this._elementRef.nativeElement, 'selectionStart', res.newSelStart);
      this._renderer.setProperty(this._elementRef.nativeElement, 'selectionEnd', res.newSelStart + res.newSelLength);
    }

    private getRes(s: string, selStart: number, selEnd: number): MaskSectionKeyResult {
      let res = new MaskSectionKeyResult(s, MaskSectionAction.APPLY, 0);
      res.newSelStart = selStart;
      res.newSelLength = selEnd - selStart;
      return res;
    }

    ngOnInit() {
      //
    }

    constructor(private _renderer: Renderer2, private _elementRef: ElementRef, private intl: Internationalization) {
      //
      this._mask = new Mask(this.intl);
    }

}
