// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Directive, ElementRef, Input, HostListener, Renderer2, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { Internationalization } from "../internationalization/internationalization.class";
import { Locale } from "../internationalization/locale.class";

import { Mask } from "./mask.class";
import { MaskState } from "./mask-state.class";
import { MaskOptions } from "./mask-options.class";

import { MaskBaseDirective } from "./mask-base.directive";

import { DateParserPipe } from "./pipes/date-parser.pipe";
import { DateFormatterPipe } from "./pipes/date-formatter.pipe";

@Directive({
    selector: '[yn-mask-date]',
    host: {'(input)': 'input($event.target.value)', '(blur)': 'blur()'},
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MaskDateDirective),
        multi: true}]
})
export class MaskDateDirective extends MaskBaseDirective implements ControlValueAccessor {

    // Имплементируем ControlValueAccessor
    private _dateValue: any;

    private onChange = (_: any) => {};
    private onTouched = () => {};

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    // Заранее подготовим парсер и форматтер
    private _parser = new DateParserPipe();
    private _formatter = new DateFormatterPipe();

    // Потеря фокуса
    blur() {

      // Нет необходимости еще раз парсить, если всё произошло так, как ожидается.
      // this._dateValue = this._parser.transform(this._mask, this._txtValue);

      // Очищаем, если дата неверна
      if(this._dateValue == null || isNaN(this._dateValue.getTime()))
        if(!this._mask.options.allowIncomplete)
          this.setText("");

      this.onTouched();
    }

    // Обновляем состояние
    protected updateState() {
      if(this._dateValue == null)
        this.state = MaskState.EMPTY; // Пустое значение
      else
        if(isNaN(this._dateValue.getTime()))
          this.state = MaskState.TYPING; // Считаем, что пользователь не завершил ввод
        else
          this.state = MaskState.OK;
    }

    // Отправка значения в модель
    protected toModel() {
      // Получаем значение
      this._dateValue = this._parser.transform(this._mask, this._txtValue);
      // Отправляем в модель
      this.onChange(this._dateValue);
      // Обновляем состояние
      this.updateState();
    }

    // Parser: View --> Ctrl
    input(txt: any) {
      // Write back to model
      let masked = this._mask.applyMask(txt);
      if(masked != this._txtValue)
        this.setText(masked); // С отправкой в модель и обновлением состояния
    }

    // Formatter: Ctrl --> View
    writeValue(value: any) {
      this._dateValue = value;
      let txt = this._formatter.transform(this._mask, value);
      if(txt != this._txtValue)
        this.setText(txt, false); // Отправка в модель не нужна, т.к. этот обработчик и запущен после изменений в модели

      // Но обновить состояние нужно...
      this.updateState();
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
      // Отписываемся
      this.localeSubscription.unsubscribe();
    }

    constructor(protected _renderer: Renderer2, protected _elementRef: ElementRef, protected intl: Internationalization) {
      super(_renderer, _elementRef, intl);
    }
}
