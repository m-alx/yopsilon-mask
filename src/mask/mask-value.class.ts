// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { MaskSectionValue } from "./mask-section-value.class";

export class MaskValue {

  public inSection: boolean;

  public sectionPos: number;

  public beforeValue: string;
  public sectionValue: MaskSectionValue;
  public delimiter: string;   
  public afterValue: string;

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
