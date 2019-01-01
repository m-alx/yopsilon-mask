// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

export class MaskOptions {
  public autoCorrect: boolean = true;
  public appendPlaceholders: boolean = false;
  public allowIncomplete: boolean = false;
  public incrementDecrementValueByArrows: boolean = true;

  constructor(public placeholder: string, public replaceMode: boolean = true) {
    //
  }
}
