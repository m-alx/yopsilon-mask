// Copyright (C) 2018 Aleksey Melnikov
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

import { Injectable } from '@angular/core';

export class Locale {
  public name: string;

  public shortMonthNames: Array<string> = [];
  public longMonthNames: Array<string> = [];

  public shortDayNames: Array<string> = [];
  public longDayNames: Array<string> = [];

  public firstDayOfWeek: number = 0;

  public dateFormat: string;
  public timeHMFormat: string;
  public timeHMSFormat: string;
  public dateTimeHMFormat: string;
  public dateTimeHMSFormat: string;

  public decimalSeparator: string;
  public thousandSeparator: string;

  public digits: RegExp = /[0-9]/;
  public letters: RegExp = /[a-z]/i;
}

@Injectable()
export class Internationalization {

  public locales: Array<Locale> = [];
  private currentLocaleName: string;

  public addLocale(locale: Locale) {
    if(!this.locales.find(l => l.name == locale.name))
      this.locales.push(locale);
  }

  public get currentLocale(): Locale {
    let res = this.locales.find(l => l.name == this.currentLocaleName);
    if(!res)
      return this.locales[0];
    else
      return res;
  }

  public setCurrentLocale(name: string) {
    this.currentLocaleName = name;
  }

  public get shortMonthNames() {
    return this.currentLocale.shortMonthNames;
  }

  public isDigit(c: string): boolean {
    return c.length === 1 && c.match(this.currentLocale.digits) != null;
  }

  public isLetter(c: string): boolean {
    return c.length === 1 && c.match(this.currentLocale.letters) != null;
  }

  constructor() {

    this.locales.push(
      {
        name: "default",

        shortMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                          "Aug", "Sep", "Oct", "Nov", "Dec"],

        longMonthNames: ["January", "February", "March", "April", "May", "June",
                         "July", "August", "September", "October", "November",
                         "December"],

        shortDayNames:  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

        longDayNames:   ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
                         "Friday", "Saturday"],

        firstDayOfWeek: 0,
        dateFormat: "mm/dd/yyyy",
        timeHMFormat: "hh:mi am",
        timeHMSFormat: "hh:mi:ss am",
        dateTimeHMFormat: "mm/dd/yyyy hh:mi am",
        dateTimeHMSFormat: "mm/dd/yyyy hh:mi:ss am",
        decimalSeparator: ".",
        thousandSeparator: ",",
        digits: /[0-9]/,
        letters: /[a-z]/i
      }
    );

    this.currentLocaleName = this.locales[0].name;
  }
}
