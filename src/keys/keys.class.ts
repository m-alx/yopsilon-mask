// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

export class KeyInfo {
  constructor(public code: number, public char: string = '') { }
}

export class Keys {

  public static BACKSPACE = 8;
  public static TAB = 9;
  public static ENTER = 13;

  public static ESCAPE = 27;

  public static SPACE = 32;

  public static PAGE_UP = 33;
  public static PAGE_DOWN = 34;

  public static END = 35;
  public static HOME = 36;

  public static LEFT = 37;
  public static UP = 38;
  public static RIGHT = 39;
  public static DOWN = 40;

  public static INSERT = 45;
  public static DELETE = 46;

  public static A = 65;
  public static C = 67;
  public static V = 86;
  public static X = 88;
  public static Y = 89;
  public static Z = 90;

  public static isFunctional(keyCode: number): boolean {
    return keyCode >= 112 && keyCode <= 123;
  }

  // For Android
  public static whichKeyHasBeenPressed(txt1: string, txt2: string,
    selStart1: number, selStart2: number,
    selLength: number): KeyInfo {

    if(txt1 == txt2 && selStart1 == selStart2 - 1)
      return new KeyInfo(Keys.RIGHT);

    if(txt1 == txt2 && selStart1 == selStart2 + 1)
      return new KeyInfo(Keys.LEFT);

    if(selLength == 1) {
      //
      if(txt1.substring(0, selStart2) == txt2.substring(0, selStart2) )
        if(txt1.substring(selStart2 + 1, txt1.length) == txt2.substring(selStart2, txt2.length))
          return new KeyInfo(Keys.BACKSPACE);

      if(txt1.substring(0, selStart2) == txt2.substring(0, selStart2) )
        if(txt1.substring(selStart1 + 1, txt1.length) == txt2.substring(selStart2, txt2.length))
          if(selStart1 == selStart2 + 1)
            return new KeyInfo(Keys.BACKSPACE);

      return new KeyInfo(0, txt2.substring(selStart1, selStart1 + 1));
    }

    // Tes|t -> Te|t
    if(txt1.substring(0, selStart1 - 1) == txt2.substring(0, selStart1 - 1) )
      if(txt1.substring(selStart1, txt1.length) == txt2.substring(selStart1 - 1, txt2.length))
        return new KeyInfo(Keys.BACKSPACE);

    // Te|st -> Te|t
    if(txt1.substring(0, selStart1) == txt2.substring(0, selStart1) )
      if(txt1.substring(selStart1 + 1, txt1.length) == txt2.substring(selStart1, txt2.length))
        return new KeyInfo(Keys.DELETE);

    return new KeyInfo(0, txt2.substring(selStart1, selStart1 + 1));
  }
}
