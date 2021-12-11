// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Directive, ElementRef, Input, HostListener, Renderer2, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { InternationalizationService } from "../internationalization/internationalization.service";
import { MaskState } from "./mask-state.class";
import { MaskSettings } from "./mask-settings.class";

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

    setDisabledState(isDisabled: boolean): void {
      this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }

    blur() {

      // Очищаем, если маска неверна
      let autocorrected = this._mask.applyMask(this._txtValue);
      if (autocorrected === '' && !this._mask.settings.allowIncomplete)
        this.setText('');
      else {
        // Маска верна, но нужно автокоррекцию провернуть
        if (autocorrected != this._txtValue)
          this.setText(autocorrected);
      }

      this.onTouched();
    }

    // Пользователь вносит значение. Parser: View --> Ctrl
    // Только то, что не обработано маской
    input(txt: any) {
      this.doInput(txt);
    }

    // Обновляем состояние
    protected updateState() {
      if (this._txtValue == "")
        this.state = MaskState.EMPTY;           // Пустое значение
      else
        if (!this._mask.checkMask(this._txtValue))
          this.state = MaskState.TYPING;       // Считаем, что пользователь не завершил ввод
        else
          this.state = MaskState.OK;
    }

    protected toModel(): void {
      // Отправляем в модель
      this.onChange(this._txtValue);
      // Обновляем состояние
      this.updateState();
    }

    // Отображаем значение в компоненте. Formatter: Ctrl --> View
    writeValue(txt: any): void {
      if (this._txtValue != txt)
        this.setText(txt, false); // Не отправляем значение в модель, т.к. этот метод вызывается как раз после изменения модели

      // Но обновить состояние нужно...
      this.updateState();

      let autocorrected = this._mask.applyMask(this._txtValue);
      if (autocorrected !== '' || this._mask.settings.allowIncomplete) {
        if (autocorrected != this._txtValue)
          this.setText(autocorrected);
      }
    }

    @Input("yn-mask")
    public set pattern(m: string) {

      if (this._txtValue != "" && this._mask.pattern != "" && this._mask.pattern != m) {
        // По сложному пути
        let res = this.currentRes();
        let s = this._mask.pureValue(res.newValue);
        this._mask.pattern = m;
        res.newValue = this._mask.applyPureValue(s);
        this.setRes(res);
      } else
        this._mask.pattern = m;
    }

    public get pattern(): string {
      return this._mask.pattern;
    }

    @Input("yn-mask-settings")
    set settings(v: MaskSettings) {
      this._mask.settings = v;
    }

    @HostListener("keydown", ["$event"])
    keyDown(e: any) {
      return this.processKey(e);
    }

    constructor(
      protected _renderer: Renderer2,
      protected _elementRef: ElementRef,
      protected intl: InternationalizationService) {
      super(_renderer, _elementRef, intl);
    }

}
