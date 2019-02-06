// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Output, Directive, ElementRef, Renderer2, EventEmitter } from "@angular/core";
import { InternationalizationService } from "../internationalization/internationalization.service";
import { Mask } from "./mask.class";
import { Keys } from "../keys/keys.class";
import { MaskSectionAction, MaskResult } from "./mask-section.class";
import { MaskSettings } from "./mask-settings.class";
import { MaskState } from "./mask-state.class";

export abstract class MaskBaseDirective {

    private _undo: Array<MaskResult> = [];
    private _redo: Array<MaskResult> = [];

    // Current text value
    protected _txtValue: string = "";
    protected _mask: Mask;

    // On state change
    @Output("ynStateChange")
    stateChange = new EventEmitter<MaskState>();

    // Fetching mask state
    private _state: MaskState = null;

    public get state(): MaskState {
      return this._state;
    }

    public set state(v: MaskState) {
      if(this._state != v) {
        this._state = v;
        this.stateChange.emit(this._state); // Emitting event
      }
    }

    protected updateState() {
      //
    }

    protected processAndroid(txt: any): void {
      //
      let res = this.currentRes();

      // Possibly we have carriage position
      let key: string = Keys.whichKeyHasBeenPressed(this.last_res.newValue, txt,
          this.last_res.newSelStart, res.newSelStart, this.last_res.newSelLength);

      let r = this.processKey(
        {
          keyCode: -1,
          key: key,
          shiftKey: false,
          ctrlKey: false,
          target: { selectionStart: this.last_res.newSelStart, selectionEnd: 0 },
          preventDefault: (_: any) => {}
        });

      if(!r)
        this.setRes(this.last_res); // Reversing, value has not been accepted

      // Just to be safe
      this.android_behavior = false;
      return;
    }

    protected android_behavior: boolean = false;
    protected last_res: MaskResult;

    protected doInput(txt: any) {
      if(this.android_behavior) {
        this.processAndroid(txt);
        return;
      }

      // Thus we're trying to apply a mask to value entered
      let masked = this._mask.applyMask(txt);
      if(masked != this._txtValue)
        this.setText(masked, true);
    }

    protected processKey(e: any): boolean {

      if(e.keyCode == 229 || e.keyCode == 0 || e.keyCode == undefined) {
        // Android detected
        this.android_behavior = true;
        this.last_res = this.currentRes();
        return;
      }

      let c: string = e.char;
      if(c == undefined)
        c = e.key;

      let key: string = Keys.keyName(e.keyCode, c);
      let keyCode: string = Keys.keyCode(e.keyCode);

      let selStart: number = e.target.selectionStart;
      let selEnd: number = e.target.selectionEnd;
      let s = this._txtValue;

      if(Keys.isFunctional(e.keyCode))
        return true;

      if(key == "Tab")
        return true;

      if(key == "Alt")
        return true;

      if(key == "Home" || key == "End")
        return true;

      if(e.ctrlKey && (keyCode == "KeyA" || keyCode == "KeyX" || keyCode == "KeyC" || keyCode == "KeyV" || key == "Insert"))
        return true;

      if(e.shiftKey && (key == "Delete" || key == "Insert"))
        return true;

      if(e.altKey && (key == "ArrowDown" || key == "ArrowUp"))
        return true;

      if(e.ctrlKey && keyCode == "KeyZ") {
        // UNDO
        let undoRes = this._undo.pop();
        if(undoRes) {
          this._redo.push(this.getRes(s, selStart, selEnd));
          this.setRes(undoRes);
        }
        e.preventDefault();
        return false;
      }

      if(e.ctrlKey && keyCode == "KeyY") {
        // REDO
        let redoRes = this._redo.pop();
        if(redoRes) {
          this._undo.push(this.getRes(s, selStart, selEnd));
          this.setRes(redoRes);
        }
        e.preventDefault();
        return false;
      }

      // If everything is selected
      if(selStart == 0 && selEnd == this._txtValue.length)
      {
        if(key == "Delete" || key == "Backspace")
          return true;

        // If ArrowLeft key has been pressed, result should equal to pressing of Home
        if(key == "ArrowLeft") {
          selStart = 0;
          this._renderer.setProperty(this._elementRef.nativeElement, 'selectionStart', selStart);
          this._renderer.setProperty(this._elementRef.nativeElement, 'selectionEnd', selStart);
          return false;
        }

        if(key == "ArrowRight") {
          selStart = this._txtValue.length;
          this._renderer.setProperty(this._elementRef.nativeElement, 'selectionStart', selStart);
          this._renderer.setProperty(this._elementRef.nativeElement, 'selectionEnd', selStart);
          return false;
        }
      }

      if(selStart == 0 && selEnd == this._txtValue.length) {
        s = "";
        selStart = 0;
        selEnd = 0;
      }

      // Applying everything that's left
      let res: MaskResult = this._mask.applyKeyAtPos(s, key, selStart, selEnd);

      if(res != null && res.action == MaskSectionAction.APPLY) {

        // If value has been changed we'll add it to UNDO stack
        if(res.newValue != s) {
          this._undo.push(this.getRes(s, selStart, selEnd));
          this._redo = [];
        }

        this.setRes(res);

        if(this.android_behavior)
          return true;
      }

      e.preventDefault();
      return false;
    }

    // Setting value and carriage position
    protected setRes(res: MaskResult) {

      if(this.android_behavior)
        res.newSelLength = 0;

      this.setText(res.newValue);
      this._renderer.setProperty(this._elementRef.nativeElement, 'selectionStart', res.newSelStart);
      this._renderer.setProperty(this._elementRef.nativeElement, 'selectionEnd', res.newSelStart + res.newSelLength);
    }

    protected currentRes() {
      let res = new MaskResult(this._txtValue, MaskSectionAction.APPLY, 0);
      res.newSelStart = this._elementRef.nativeElement.selectionStart;
      res.newSelLength = this._elementRef.nativeElement.selectionEnd - res.newSelStart;
      return res;
    }

    // Retrieving current mask value and carriage position
    protected getRes(s: string, selStart: number, selEnd: number): MaskResult {
      let res = new MaskResult(s, MaskSectionAction.APPLY, 0);
      res.newSelStart = selStart;
      res.newSelLength = selEnd - selStart;
      return res;
    }

    // Following method should be overridden
    protected abstract toModel(): void;

    // Writing a text to control
    protected setText(displayedValue: string, toModel: boolean = true) {

      // Displaying
      this._txtValue = displayedValue;
      this._renderer.setProperty(this._elementRef.nativeElement, 'value', this._txtValue);

      // Sending to model
      if(toModel)
        this.toModel();
    }

    constructor(protected _renderer: Renderer2, protected _elementRef: ElementRef, protected intl: InternationalizationService) {
      this._mask = new Mask(this.intl);
    }
}
