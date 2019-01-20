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
import { MaskSettings } from "./mask-settings.class";

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
    // implementing ControlValueAccessor
    private _dateValue: any;

    private onChange = (_: any) => {};
    private onTouched = () => {};

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    // Заранее подготовим парсер и форматтер
    // Preparing parser and formatter in advance
    private _parser = new DateParserPipe();
    private _formatter = new DateFormatterPipe();

    // Потеря фокуса
    // Focus lost
    blur() {

      // Нет необходимости еще раз парсить, если всё произошло так, как ожидается.
      // No need to parse once more if result is as expected
      // this._dateValue = this._parser.transform(this._mask, this._txtValue);
      let autoCorrected = this._mask.applyMask(this._txtValue);
      if(autoCorrected != this._txtValue)
        this.setText(autoCorrected);

      // Очищаем, если дата неверна
      // Clearing if Date is incorrect
      if(this._dateValue == null || isNaN(this._dateValue.getTime())) {


        if(!this._mask.settings.allowIncomplete)
          this.setText("");
      }

      this.onTouched();
    }

    // Обновляем состояние
    // Updating the state
    protected updateState() {
      if(this._dateValue == null)
        this.state = MaskState.EMPTY; // Пустое значение // empty value
      else
        if(isNaN(this._dateValue.getTime()))
          this.state = MaskState.TYPING; // Считаем, что пользователь не завершил ввод // User input is in progress
        else
          this.state = MaskState.OK;
    }

    // Отправка значения в модель
    // Sending a value to model
    protected toModel() {
      // Получаем значение
      // Retrieving value
      this._dateValue = this._parser.transform(this._mask, this._txtValue);
      // Отправляем в модель
      // Sending to model
      this.onChange(this._dateValue);
      // Обновляем состояние
      // Updating the state
      this.updateState();
    }

    // Parser: View --> Ctrl
    input(txt: any) {
      this.doInput(txt);
    }

    // Formatter: Ctrl --> View
    writeValue(value: any) {
      this._dateValue = value;
      let txt = this._formatter.transform(this._mask, value);
      if(txt != this._txtValue)
        this.setText(txt, false); // Отправка в модель не нужна, т.к. этот обработчик и запущен после изменений в модели
        // No need to send to model, because this processor is called on model change
      // Но обновить состояние нужно...
      // but state still needs to be updated
      this.updateState();
    }

    @Input("yn-mask-date")
    public set mask(m: string) {
      this._mask.mask = m;
    }

    public get mask(): string {
      return this._mask.mask;
    }

    @Input("yn-mask-settings")
    set settings(v: MaskSettings) {
      this._mask.settings = v;
    }

    @HostListener("keydown", ["$event"])
    keyDown(e: any) {
      return this.processKey(e);
    }

    setLocale(locale: Locale) {
      this._mask.updateMask(); // Заменим формат // Changing format
      this.writeValue(this._dateValue); // Обновим представление // Updating view
    }

    localeSubscription: any;

    ngOnInit() {
      // На смену локализации можем отреагировать изменением формата // Format change can follow locale change
      this.localeSubscription = this.intl.onLocaleChange.subscribe(locale => {
        this.setLocale(locale);
      });
    }

    ngOnDestroy() {
      // Отписываемся
      // Unsubscribing
      this.localeSubscription.unsubscribe();
    }

    constructor(protected _renderer: Renderer2, protected _elementRef: ElementRef, protected intl: Internationalization) {
      super(_renderer, _elementRef, intl);
    }
}
