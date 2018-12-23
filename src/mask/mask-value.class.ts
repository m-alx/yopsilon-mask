// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yn

import { MaskSectionValue } from "./mask-section-value.class";

export class MaskValue {

  public inSection: boolean;

  public sectionPos: number;

  public beforeValue: string; // textBefore
  public sectionValue: MaskSectionValue;
  public delimiter: string;   //
  public afterValue: string;  // textAfter

  public nextSectionPos(): number {
    return this.beforeValue.length + this.sectionValue.length + this.delimiter.length;
  }

  public update(s: string, selStart: number): string {
    this.sectionValue = new MaskSectionValue(s, this.sectionPos, selStart);
    return this.value();
  }

  public value() {
    return this.beforeValue + this.sectionValue.value() + this.delimiter + this.afterValue;
  }
}
