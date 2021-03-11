// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Directive, ElementRef, Input, HostListener, Renderer2, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { InternationalizationService } from "../internationalization/internationalization.service";
import { Locale } from "../internationalization/locale.class";

import { MaskState } from "./mask-state.class";
import { MaskSettings } from "./mask-settings.class";

import { MaskBaseDirective } from "./mask-base.directive";

import { DateParserFormatter } from "../dates/date-parser-formatter.class";

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

    // Implementing ControlValueAccessor

    private onChange = (_: any) => {};
    private onTouched = () => {};

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    // Focus lost
    blur() {

      // No need to parse once more if result is as expected
      let autoCorrected = this._mask.applyMask(this._txtValue);
      if (autoCorrected != this._txtValue)
        this.setText(autoCorrected);

      // Clearing if Date is incorrect
      if (this._dateValue == null || isNaN(this._dateValue.getTime())) {
        if (!this._mask.settings.allowIncomplete)
          this.setText("");
      }

      this.onTouched();
    }

    // Updating the state
    protected updateState() {
      if (this._dateValue == null)
        this.state = MaskState.EMPTY; // empty value
      else
        if (isNaN(this._dateValue.getTime()))
          this.state = MaskState.TYPING; // User input is in progress
        else
          this.state = MaskState.OK;
    }

    // Sending a value to model
    protected toModel() {
      // Retrieving value
      this._dateValue = DateParserFormatter.parse(this._txtValue, this._mask);
      // Sending to model
      this.onChange(this._dateValue);
      // Updating the state
      this.updateState();
    }

    //
    public processKey(e: any): boolean {
      return super.processKey(e);
    }

    // Parser: View --> Ctrl
    input(txt: any) {
      this.doInput(txt);
    }

    // Formatter: Ctrl --> View
    writeValue(value: any) {
      this._dateValue = value;
      let txt = DateParserFormatter.format(value, this._mask);
      if (txt != this._txtValue)
        this.setText(txt, false);

      // No need to send to model, because this processor is called on model change
      // but state still needs to be updated
      this.updateState();
    }

    @Input("yn-mask-date")
    public set pattern(m: string) {
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

    setLocale(locale: Locale) {
      // Change format
      this._mask.updateMask(); 
      // Update view
      this.writeValue(this._dateValue); 
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

    constructor(protected _renderer: Renderer2, protected _elementRef: ElementRef, protected intl: InternationalizationService) {
      super(_renderer, _elementRef, intl);
    }
}
