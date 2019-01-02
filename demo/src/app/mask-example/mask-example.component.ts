import { Component, Input } from "@angular/core";

import * as YN from "yopsilon-mask";

@Component({
  selector: 'mask-example',
  templateUrl: './mask-example.component.html'
})
export class MaskExampleComponent {

  private _mask: string = "";
  private _options: YN.MaskOptions = null;

  @Input("mask")
  set mask(s: string) {
    this._mask = s;
  }

  get mask() {
    return this._mask;
  }

  @Input("options")
  set options(o: YN.MaskOptions) {
    this._options = o;
  }

  get options(): YN.MaskOptions {
    return this._options;
  }

  @Input("placeholder")
  public placeholder = "";

  @Input("caption")
  public caption: string;

  public testValue: string = "";

  constructor() {
    //
  }
}
