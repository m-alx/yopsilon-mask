// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Directive, ElementRef, Input, HostListener, Renderer2, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TestParser } from "./test-parser.class";

import * as YN from "yopsilon-mask";

@Directive({
    selector: '[yn-test]',
    host: {'(input)': 'input($event.target.value)',
           '(blur)': 'blur()'},
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TestDirective),
        multi: true}]
})
export class TestDirective implements ControlValueAccessor {

    private _mask: YN.Mask;
    private _dateValue: any;
    private _txtValue: string;

    private onChange = (_: any) => {
      // console.log(_);
    };

    private onTouched = () => {};

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    blur() {

      // Очищаем, если маска неверна
      let date = TestParser.parseDate(this._mask.sections, this._txtValue);
      if(date == null)
        this.writeValue("");

      this.onTouched();
    }

    // Parser: View --> Ctrl
    input(txt: string) {
        // Write back to model
        console.log("Input");
        console.log(txt);

        let date = TestParser.parseDate(this._mask.sections, txt);

        console.log("PARSED", date);
        if(txt != this._txtValue) {
          this.setText(txt);
          // this.setText = txt
          //this.writeValue(date);
        }

        this._dateValue = date;
        this.onChange(this._dateValue);
    }

    // Formatter: Ctrl --> View
    writeValue(date: any): void {

      console.log("writeValue");
      console.log(date);

      // let txt = "";

      //if(date != null)
      //{
        let txt = TestParser.formatDate(this._mask.sections, date);
        if(this._txtValue != txt)
          this.setText(txt);
        // Отрисовываем
      //}
      // На вход дата
      //this._dateValue = date; // MaskDate.parseDate(this._mask.sections, value);
    }

    setText(txt: string) {
      //
      this._txtValue = txt;
      this._renderer.setProperty(this._elementRef.nativeElement, 'value', this._txtValue);

      //
      this._dateValue = TestParser.parseDate(this._mask.sections, txt);;
    }

    @Input("yn-test")
    public set mask(m: string) {
      this._mask.mask = m;
    }

    public get mask(): string {
      return this._mask.mask;
    }

    @HostListener("keydown", ["$event"])
    keyDown(e: any) {
      //this.processKey(e);
    }

    constructor(protected _renderer: Renderer2, protected _elementRef: ElementRef, protected intl: YN.Internationalization) {
      this._mask = new YN.Mask(intl);
    }

}
