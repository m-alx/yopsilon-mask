// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask


export class MaskSectionType {
  public selectors: Array<string> = [];
  public digits: boolean = false;
  public alpha: boolean = false;
  public min?: number = null;
  public max?: number = null;
  public variants?: Array<string>;
}
