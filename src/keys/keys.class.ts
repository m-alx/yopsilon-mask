// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

// Different browsers have different key names,
// But it's more convenient to use an alias. So we're mapping codes to
// Names similar to those in Google Chrome

export class Keys {

  private static keys: Array<string> = new Array(255);
  private static keyCodes: Array<string> = new Array(255);

  public static keyName(keyCode: number, keyName: string): string {
    //
    if(keyCode>255 || keyCode < 0)
      return keyName;

    var res: string = this.keys[keyCode];
    if(res == null)
      res = keyName;

    return res;
  }

  public static keyCode(keyCode: number) {
    //
    if(keyCode>255 || keyCode < 0)
      return "";

    var res: string = this.keyCodes[keyCode];
    if(res == null)
      res = "";

    return res;
  }

  public static isFunctional(keyCode: number): boolean {
    return keyCode >= 112 && keyCode <= 123;
  }

  public static ar: string = "ArrowRight";
  public static al: string = "ArrowLeft";
  public static bs: string = "Backspace";
  public static del: string = "Delete";

  public static initialize(): void {
    // Not every key is required as of this moment
    this.keys[8] = Keys.bs;
    this.keys[9] = "Tab";

    this.keys[13] = "Enter";

    this.keys[35] = "End";
    this.keys[36] = "Home";

    this.keys[37] = Keys.al;
    this.keys[39] = Keys.ar;
    this.keys[38] = "ArrowUp";
    this.keys[40] = "ArrowDown";

    this.keys[45] = "Insert";
    this.keys[46] = Keys.del;

    this.keyCodes[65] = "KeyA";
    this.keyCodes[67] = "KeyC";
    this.keyCodes[86] = "KeyV";
    this.keyCodes[88] = "KeyX";
    this.keyCodes[89] = "KeyY";
    this.keyCodes[90] = "KeyZ";
  }

  public static whichKeyHasBeenPressed(txt1: string, txt2: string,
    selStart1: number, selStart2: number,
    selLength: number): string {

    if(txt1 == txt2 && selStart1 == selStart2 - 1)
      return Keys.ar;

    if(txt1 == txt2 && selStart1 == selStart2 + 1)
      return Keys.al;

    if(selLength == 1) {
      //
      if(txt1.substring(0, selStart2) == txt2.substring(0, selStart2) )
        if(txt1.substring(selStart2 + 1, txt1.length) == txt2.substring(selStart2, txt2.length))
          return Keys.bs;

      if(txt1.substring(0, selStart2) == txt2.substring(0, selStart2) )
        if(txt1.substring(selStart1 + 1, txt1.length) == txt2.substring(selStart2, txt2.length))
          if(selStart1 == selStart2 + 1)
            return Keys.bs;

      return txt2.substring(selStart1, selStart1 + 1);
    }

    // Tes|t -> Te|t
    if(txt1.substring(0, selStart1 - 1) == txt2.substring(0, selStart1 - 1) )
      if(txt1.substring(selStart1, txt1.length) == txt2.substring(selStart1 - 1, txt2.length))
        return Keys.bs;

    // Te|st -> Te|t
    if(txt1.substring(0, selStart1) == txt2.substring(0, selStart1) )
      if(txt1.substring(selStart1 + 1, txt1.length) == txt2.substring(selStart1, txt2.length))
        return Keys.del;

    return txt2.substring(selStart1, selStart1 + 1);
  }
}

Keys.initialize();
