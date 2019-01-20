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

  public static initialize(): void {
    // Not every key is required as of this moment
    this.keys[8] = "Backspace";
    this.keys[9] = "Tab";

    this.keys[13] = "Enter";

    this.keys[35] = "End";
    this.keys[36] = "Home";

    this.keys[37] = "ArrowLeft";
    this.keys[39] = "ArrowRight";
    this.keys[38] = "ArrowUp";
    this.keys[40] = "ArrowDown";

    this.keys[45] = "Insert";
    this.keys[46] = "Delete";

    this.keyCodes[65] = "KeyA";
    this.keyCodes[67] = "KeyC";
    this.keyCodes[86] = "KeyV";
    this.keyCodes[88] = "KeyX";
    this.keyCodes[89] = "KeyY";
    this.keyCodes[90] = "KeyZ";
  }

  constructor() {
    //
  }
}

Keys.initialize();
