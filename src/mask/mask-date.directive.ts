// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Directive, ElementRef, Input, HostListener, Renderer2, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { Internationalization } from "../internationalization/internationalization.class";
import { Locale } from "../internationalization/locale.class";

import { Mask } from "./mask.class";
import { Keys } from "../keys/keys.class";
import { MaskSectionAction, MaskSectionKeyResult } from "./mask-section.class";
import { MaskOptions } from "./mask-options.class";

import { MaskBaseDirective } from "./mask-base.directive";

import { DateParserPipe } from "./date-parser.pipe";
import { DateFormatterPipe } from "./date-formatter.pipe";

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

    private _parser = new DateParserPipe();
    private _formatter = new DateFormatterPipe();

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    blur() {
      // Очищаем, если дата неверна
      this._dateValue = this._parser.transform(this._mask, this._txtValue); // MaskDate.parseDate(this._mask.sections, this._txtValue);

      let dateIsCorrect: boolean = true;
      if(this._dateValue == null)
        dateIsCorrect = false;

      if(isNaN(this._dateValue))
        dateIsCorrect = false;

      if(!dateIsCorrect && !this._mask.options.allowIncomplete)
        this.setText("");

      this.onTouched();
    }

    protected toModel(displayedValue: string): void {
      this._dateValue = this._parser.transform(this._mask, displayedValue); // MaskDate.parseDate(this._mask.sections, displayedValue);
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
      this._dateValue = value;
      let txt = this._formatter.transform(this._mask, value); // MaskDate.formatDate(this._mask.sections, value);
      if(txt != this._txtValue)
        this.setText(txt, false); // Отправка в модель не нужна, т.к. этот обработчик и запущен после изменений в модели
    }

    @Input("yn-mask-date")
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

    setLocale(locale: Locale) {
      this._mask.updateMask(); // Заменим формат
      this.writeValue(this._dateValue); // Обновим представление
    }

    localeSubscription: any;

    ngOnInit() {
      // На смену локализации можем отреагировать изменением формата
      this.localeSubscription = this.intl.onLocaleChanged.subscribe(locale => {
        this.setLocale(locale);
      });
    }

    ngOnDestroy() {
      this.localeSubscription.unsubscribe();
    }

    constructor(protected _renderer: Renderer2, protected _elementRef: ElementRef, protected intl: Internationalization) {
      super(_renderer, _elementRef, intl);
    }
}
