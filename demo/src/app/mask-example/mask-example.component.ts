import { Component, Input } from "@angular/core";

import * as YN from "yopsilon-mask";

@Component({
  selector: 'mask-example',
  templateUrl: './mask-example.component.html'
})
export class MaskExampleComponent {

  private _mask: string = "";

  @Input("mask")
  set mask(s: string) {
    this._mask = s;
  }

  get mask() {
    return this._mask;
  }

  @Input("options")
  set options(o: any) {
    //
  }

  @Input("caption")
  public caption: string;

  public testValue: string = '13.12.1979';

  constructor() {
    console.log(YN);
    /*
    let intl = new Internationalization();
    let m = new Mask(intl);
    m.mask = "dd.MM.yyyy";
    */
  }
}
