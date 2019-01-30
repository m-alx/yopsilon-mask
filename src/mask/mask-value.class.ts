// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { MaskSectionValue } from "./mask-section-value.class";

export class MaskValue {

  public inSection: boolean;

  public sectionPos: number;

  public before: string;
  public section: MaskSectionValue;
  public delimiter: string;
  public after: string;

  public nextSectionPos(): number {
    return this.before.length + this.section.length + this.delimiter.length;
  }

  public update(s: string, selStart: number): string {
    this.section = new MaskSectionValue(s, this.sectionPos, selStart);
    return this.value();
  }

  public value() {
    return this.before + this.section.value() + this.delimiter + this.after;
  }
}
