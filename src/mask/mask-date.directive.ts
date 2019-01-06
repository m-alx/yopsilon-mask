// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Directive, ElementRef, Input, HostListener, Renderer2, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Internationalization } from "../internationalization/internationalization.class";
import { Mask } from "./mask.class";
import { MaskDate } from "./mask-date.class";
import { Keys } from "../keys/keys.class";
import { MaskSectionAction, MaskSectionKeyResult } from "./mask-section.class";
import { MaskOptions } from "./mask-options.class";

import { MaskBaseDirective } from "./mask-base.directive";

@Directive({
    selector: '[yn-mask-date]',
    host: {'(input)': 'input($event.target.value)', '(blur)': 'blur()'},
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MaskDateDirective),
        multi: true}]
})
export class MaskDateDirective extends MaskBaseDirective implements ControlValueAccessor {

    private _dateValue: any;

    private onChange = (_: any) => {};
    private onTouched = () => {};

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    blur() {

      // Очищаем, если маска неверна
      this._dateValue = MaskDate.parseDate(this._mask.sections, this._txtValue);

      let correctDate: boolean = true;
      if(this._dateValue == null)
        correctDate = false;

      if(isNaN(this._dateValue))
        correctDate = false;

      if(!correctDate && !this._mask.options.allowIncomplete)
        this.setText("");

      this.onTouched();
    }

    protected toModel(displayedValue: string): void {
      this._dateValue = MaskDate.parseDate(this._mask.sections, displayedValue);
      this.onChange(this._dateValue);
    }

    // Parser: View --> Ctrl
    input(txt: any) {
      // Write back to model
      let masked = this._mask.applyMask(txt);
      if(masked != this._txtValue)
        this.setText(masked, true); // С отправкой в модель
    }

    // Formatter: Ctrl --> View
    writeValue(value: any): void {
      let txt = MaskDate.formatDate(this._mask.sections, value);
      if(txt != this._txtValue)
        this.setText(txt, false); // Отправка в модель не нужна, т.к. этот обработчик и запущен после изменений в модели
    }

    /*
    protected setText(txt: string) {
      super.setText(txt);
      this._dateValue = MaskDate.parseDate(this._mask.sections, txt);

      // Вот оно! Но это сработает без реального изменения (при первом writeValue).. Нужно исправить.
      this.onChange(this._dateValue);
    }*/

    @Input("yn-mask-date")
    public set mask(m: string) {
      this._mask.mask = m;
    }

    public get mask(): string {
      return this._mask.mask;
    }

    @Input("yn-mask-date-options")
    set options(v: MaskOptions) {
      this._mask.options = v;
    }

    @HostListener("keydown", ["$event"])
    keyDown(e: any) {
      this.processKey(e);
    }

    constructor(protected _renderer: Renderer2, protected _elementRef: ElementRef, protected intl: Internationalization) {
      super(_renderer, _elementRef, intl);
    }

}
