// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { MaskSectionType } from "./mask-section-type.class";

export class MaskSettings {

  // Autocorrection of section's value. If value entered is bigger than
  // Maximum - replaced with maxValue, if less than minimum - with minValue.
  public autoCorrect: boolean = true;

  // On start of input placeholders are added automatically
  public appendPlaceholders: boolean = true;

  // Allow values, for which input had not been completed (placeholders are present or length doesn't comply to a mask)
  public allowIncomplete: boolean = false;

  // ArrowUp and ArrowDown keys change values to previous and next
  public incDecByArrows: boolean = true;

  // If set to true, moving to an icnomplete section with predefined set of values,
  // first value of the set will be entered automatically
  public defaultOptions: boolean = true;

  // New type of section can be added
  public sectionTypes: Array<MaskSectionType> = [];

  constructor(
    public placeholder: string,        // Placeholder char
    public replaceMode: boolean = true // Replace mode - on carriage position change
                                       // current char is selected
  ) { }
}
