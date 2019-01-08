// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Directive, ElementRef, Input, HostListener, Renderer2, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Internationalization } from "../internationalization/internationalization.class";
import { Mask } from "./mask.class";
import { Keys } from "../keys/keys.class";
import { MaskSectionAction, MaskSectionKeyResult } from "./mask-section.class";
import { MaskOptions } from "./mask-options.class";

import { MaskBaseDirective } from "./mask-base.directive";

@Directive({
    selector: '[yn-mask]',
    host: {'(input)': 'input($event.target.value)', '(blur)': 'blur()'},
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MaskDirective),
        multi: true}]
})
export class MaskDirective extends MaskBaseDirective implements ControlValueAccessor {

    private onChange = (_: any) => {};
    private onTouched = () => {};

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    blur() {

      // Очищаем, если маска неверна
      if(!this._mask.checkMask(this._txtValue) && !this._mask.options.allowIncomplete)
        this.setText("");

      this.onTouched();
    }

    protected toModel(displayedValue: any): void {
      this.onChange(displayedValue);
    }

    // Пользователь вносит значение. Parser: View --> Ctrl
    // Только то, что не обработано маской
    input(txt: any) {
        // Поэтому пытаемся применить маску к введенному значению.
        let masked = this._mask.applyMask(txt);
        if(masked != this._txtValue)
          this.setText(masked, true);
    }

    // Отображаем значение в компоненте. Formatter: Ctrl --> View
    writeValue(txt: any): void {
      if(this._txtValue != txt)
        this.setText(txt, false); // Не отправляем значение в модель, т.к. этот метод вызывается как раз после изменения модели
    }

    @Input("yn-mask")
    public set mask(m: string) {
      this._mask.mask = m;
    }

    public get mask(): string {
      return this._mask.mask;
    }

    @Input("yn-mask-options")
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
